from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels_redis.core import RedisChannelLayer
import json
import redis
from paramiko import SSHClient, SSHException, AutoAddPolicy
import socket
import logging
import platform
from django.conf import settings
from django.http.request import QueryDict
from channels.layers import get_channel_layer

from terminal.models import Connections
from utils.encrypt import AesEncrypt
from terminal.interactive import ShellHandler

__all__ = ["AsyncTerminalConsumer", ]
logger = logging.getLogger("default")

connect_dict = {}


class AsyncTerminalConsumer(AsyncWebsocketConsumer):

    def __init__(self):
        super(AsyncTerminalConsumer, self).__init__()
        self.redis_pubsub = self.get_pubsub()

    async def connect(self):
        session_id = self.scope['url_route']['kwargs']['session_id']
        query_param = QueryDict(self.scope.get('query_string'))
        logger.info(f"query_param =  {query_param}")
        settings.TERMINAL_SESSION_DICT[session_id] = None
        logger.debug(f"session_id = {session_id}")
        # 修改 channel_name
        # self.channel_name = query_param.get("room_id")    # 无效
        # 增加到异步
        # 分组添加，使用 channel_name
        room_id = query_param.get('room_id')
        logger.info(f"room_id = {room_id}")
        pubsub_channels = self.get_pubsub().pubsub_channels()
        logger.info(f"pubsub_channels = {pubsub_channels}")
        await self.channel_layer.group_add(
            query_param.get("room_id"),
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, code):
        query_param = QueryDict(self.scope.get('query_string'))
        self.redis_pubsub.publish(query_param.get("room_id"), "<<<close>>>")
        session_id = self.scope['url_route']['kwargs']['session_id']
        del settings.TERMINAL_SESSION_DICT[session_id]
        # 分组添加，使用 channel_name
        await self.channel_layer.group_discard(
            query_param.get("room_id"),
            self.channel_name,
        )

    def get_pubsub(self):
        redis_instance = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
        return redis_instance

    # 数据库 访问
    @database_sync_to_async
    def get_connect(self):
        con = Connections.objects.get(id=1)
        return con

    async def receive(self, text_data=None, bytes_data=None):
        session_id = self.scope['url_route']['kwargs']['session_id']
        logger.debug(f"text_data = {text_data}, type = {type(text_data)}")
        # send message to room group
        query_param = QueryDict(self.scope.get('query_string'))
        room_id = query_param.get('room_id')
        logger.info(f"room_id = {room_id}")
        # self.channel_name = query_param.get("room_id")    # 无效
        if text_data:
            try:
                text_data_json = json.loads(text_data)
                if len(text_data_json) == 3:
                    ip, width, height = text_data_json
                    logger.debug(f"ip = {ip} width = {width} height = {height}")
                    # ssh client
                    ssh = SSHClient()
                    try:
                        con = await self.get_connect()
                        ssh.set_missing_host_key_policy(AutoAddPolicy())
                        ssh.connect(hostname=con.server, username=con.username,
                                    password=AesEncrypt().decrypt(con.password),
                                    port=con.port)
                        # 真实高度, windows 、 字符数量
                        channel = ssh.invoke_shell(width=(width // 9), height=(height // 17),
                                                   width_pixels=width, height_pixels=height)
                        shell = ShellHandler(
                            channel=channel, channel_name=self.channel_name,
                            room_id=query_param.get("room_id"),
                            # channel=channel, channel_name=query_param.get("room_id"),
                            extra_params={"ssh": ssh, "width": width, "height": height}
                        )
                        # 根据操作系统 设定 使用
                        if platform.system() == "Linux":
                            shell.posix_shell()
                        elif platform.system() == "Windows":
                            shell.windows_shell()
                        # 把会话 存储到 全局管理 列表中
                        settings.TERMINAL_SESSION_DICT[session_id] = shell
                    except socket.timeout:
                        await self.send(text_data=json.dumps({
                            "message": f"\033[1;3;31m Connect to server {con.server} time out\033[0m"
                        }))
                        await self.accept(False)
                    except SSHException as e:
                        logger.exception(e)
                    except Exception as e:
                        logger.exception(e)

                elif len(text_data_json) == 2:
                    method, message = text_data_json
                    print(method, message)
            except:
                self.redis_pubsub.publish(query_param.get("room_id"), text_data)  # 频道
                # self.redis_pubsub.publish(self.channel_name, text_data)
                # 群发, 发送至监听
                # send message to room group
                # await self.channel_layer.group_send(
                #     room_id,
                #     {
                #         "type": "terminal_group_message",
                #         "message": text_data,
                #     }
                # )

    # 接收通道消息
    async def terminal_message(self, event):
        message = event["message"]
        logger.info(f"message = {message}")
        # Send message to websocket
        await self.send(text_data=message)

    # 重载 调用方法 修改 channel_name
    # 接收分组消息
    async def terminal_group_message(self, event):
        message = event["message"]
        logger.info(f"message = {message}")
        # Send message to websocket
        await self.send(text_data=message)


class AsyncTerminalConsumerMonitor(AsyncWebsocketConsumer):

    def __init__(self):
        super(AsyncTerminalConsumerMonitor, self).__init__()
        self.redis_pubsub = self.get_pubsub()

    async def connect(self):
        # 监听
        # 如果 订阅不存在、既无法连接上
        query_param = QueryDict(self.scope.get('query_string'))
        logger.info(f"query_param =  {query_param}")
        logger.info(f"pubsub_channels = {self.redis_pubsub.pubsub_channels()}")
        room_id = query_param.get("room_id", "")
        # 监听 订阅是否存在、不存在，不允许连接
        if room_id.encode() in self.redis_pubsub.pubsub_channels():
            # 分组添加，使用 channel_name
            await self.channel_layer.group_add(
                room_id,
                self.channel_name,
            )
            await self.accept()
        else:
            await self.accept(False)

    def get_pubsub(self):
        redis_instance = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
        return redis_instance

    async def disconnect(self, code):
        # 取消订阅
        query_param = QueryDict(self.scope.get('query_string'))
        # 分组添加，使用 channel_name
        room_id = query_param.get("room_id", "")
        await self.channel_layer.group_discard(
            room_id,
            self.channel_name,
        )

    async def receive(self, text_data=None, bytes_data=None):
        logger.info(f"monitor text_data = {text_data}")
        query_param = QueryDict(self.scope.get('query_string'))
        # 分组添加，使用 channel_name
        room_id = query_param.get("room_id", "")
        self.redis_pubsub.publish(room_id, text_data)  # 频道

    # 接收分组消息
    async def terminal_message(self, event):
        message = event["message"]
        logger.info(f"message = {message}")
        # Send message to websocket
        await self.send(text_data=message)
