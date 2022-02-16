from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
import redis

import socket
import logging
import platform
from django.conf import settings
from django.http.request import QueryDict
import paramiko

from apps.terminal.models import Connections
from utils.encrypt import AesEncrypt
from apps.terminal.interactive import LinuxInteractiveThread, SubscribeWriteThread
from apps.terminal.telnets import TelnetClient

__all__ = ["AsyncTerminalConsumer", "AsyncTerminalConsumerMonitor", "AsyncTelnetConsumer"]
logger = logging.getLogger("default")

connect_dict = {}


class AsyncTerminalConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super(AsyncTerminalConsumer, self).__init__(*args, **kwargs)
        self.redis_pubsub = self.get_pubsub()
        self.cmd = []  # 所有命令
        self.cmd_tmp = ''  # 一行命令
        self.tab_mode = False  # 使用tab命令补全时需要读取返回数据然后添加到当前输入命令后
        self.history_mode = False
        self.index = 0

    async def connect(self):
        session_id = self.scope['url_route']['kwargs']['session_id']
        query_param = QueryDict(self.scope.get('query_string'))
        logger.info(f"query_param =  {query_param} session_id = {session_id}")
        # 修改 channel_name
        # self.channel_name = query_param.get("room_id")    # 无效
        # 增加到异步
        # 分组添加，使用 channel_name
        logger.info(f"room_id = {session_id}")
        pubsub_channels = self.get_pubsub().pubsub_channels()
        logger.info(f"pubsub_channels = {pubsub_channels}")
        await self.channel_layer.group_add(
            session_id,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, code):
        logger.info(f"disconnect code = {code}")
        query_param = QueryDict(self.scope.get('query_string'))
        session_id = self.scope['url_route']['kwargs']['session_id']
        self.redis_pubsub.publish(session_id, json.dumps(["close"]))
        # 分组添加，使用 channel_name
        await self.channel_layer.group_discard(
            session_id,
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
        logger.debug(f"text_data = {text_data}, bytes_data = {bytes_data} session_id = {session_id}")
        # send message to room group
        # query_param = QueryDict(self.scope.get('query_string'))
        # self.channel_name = query_param.get("room_id")    # 无效
        if text_data:
            try:
                text_data_json = json.loads(text_data)
                if len(text_data_json) == 3:
                    cmd, width, height = text_data_json
                    logger.debug(f"ip = {cmd} width = {width} height = {height}")
                    if cmd == "onopen":
                        con = await self.get_connect()
                        try:
                            # 真实高度, windows 、 字符数量
                            ssh = paramiko.SSHClient()
                            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
                            extra_params = dict()
                            extra_params['ssh'] = ssh
                            # ssh client
                            ssh.connect(hostname=con.server, username=con.username,
                                        password=AesEncrypt().decrypt(con.password), port=int(con.port),
                                        timeout=3)
                            channel = ssh.invoke_shell(width=(width // 9), height=(height // 17), term='xterm')
                        except socket.timeout:
                            await self.send(text_data='\033[1;3;31mConnect to server time out\033[0m')
                            logger.error("Connect to server {0} time out!".format(con.server))
                            await self.close()
                            return
                        except Exception as e:
                            await self.send(text_data='\033[1;3;31mCan not connect to server: {0}\033[0m'.format(e))
                            logger.error("Can not connect to server {0}: {1}".format(con.server, e))
                            await self.close()
                            return
                        # # 根据操作系统 设定 使用
                        extra_params['width'] = width
                        extra_params['height'] = height
                        # channel.resize_pty(
                        #     width_pixels=width, height_pixels=height,
                        #     width=(width // 9), height=(height // 17)
                        # )
                        if platform.system() == "Linux":
                            write = SubscribeWriteThread(channel=channel, channel_name=self.channel_name,
                                                         room_id=session_id, extra_params=extra_params)
                            # write.setDaemon(True)
                            write.start()
                            extra_params["thread_ssh2_write"] = write
                            display = LinuxInteractiveThread(channel=channel, channel_name=self.channel_name,
                                                             room_id=session_id, extra_params=extra_params)
                            # display.setDaemon(True)
                            display.start()
                        elif platform.system() == "Windows":
                            # shell.windows_shell()
                            pass
                    elif cmd == "resize":
                        self.redis_pubsub.publish(session_id, json.dumps(text_data_json))
            except Exception as e:
                self.redis_pubsub.publish(session_id, text_data)  # 频道
        if bytes_data:
            # 字节流发送
            self.redis_pubsub.publish(session_id, bytes_data)
            # await self.send(bytes_data=bytes_data)

    # 接收通道消息
    async def terminal_message(self, event):
        message = event["message"]
        # logger.info(f"message = {message}")
        # Send message to websocket
        if isinstance(message, str):
            await self.send(text_data=message)
        elif isinstance(message, bytes):
            await self.send(bytes_data=message)

    # 重载 调用方法 修改 channel_name
    # 接收分组消息
    async def terminal_group_message(self, event):
        message = event["message"]
        # logger.info(f"message = {message}")
        # Send message to websocket
        await self.send(text_data=message)


class AsyncTerminalConsumerMonitor(AsyncWebsocketConsumer):

    def __init__(self):
        super(AsyncTerminalConsumerMonitor, self).__init__()
        self.redis_pubsub = self.get_pubsub()

    async def connect(self):
        # 监听
        # 如果 订阅不存在、既无法连接上
        session_id = self.scope['url_route']['kwargs']['session_id']
        logger.info(f"ssh2 session_id =  {session_id}")
        logger.info(f"pubsub_channels = {self.redis_pubsub.pubsub_channels()}")
        # 监听 订阅是否存在、不存在，不允许连接
        if session_id.encode() in self.redis_pubsub.pubsub_channels():
            # 分组添加，使用 channel_name
            await self.channel_layer.group_add(
                session_id,
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
        session_id = self.scope['url_route']['kwargs']['session_id']
        # 分组添加，使用 channel_name
        await self.channel_layer.group_discard(
            session_id,
            self.channel_name,
        )

    async def receive(self, text_data=None, bytes_data=None):
        session_id = self.scope['url_route']['kwargs']['session_id']
        logger.info(f"monitor text_data = {text_data} session_id = {session_id}")
        self.redis_pubsub.publish(session_id, text_data)  # 频道

    # 接收分组消息
    async def terminal_message(self, event):
        message = event["message"]
        # logger.info(f"message = {message}")
        # Send message to websocket
        await self.send(text_data=message)


class AsyncTelnetConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super(AsyncTelnetConsumer, self).__init__(*args, **kwargs)
        self.telnet_client = TelnetClient(
            # session_id=session_id
        )

    # 数据库 访问
    @database_sync_to_async
    def get_connect(self, db_id):
        con = Connections.objects.get(id=db_id)
        return con

    def get_pubsub(self):
        redis_instance = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
        return redis_instance

    async def connect(self):
        session_id = self.scope['url_route']['kwargs']['session_id']
        query_param = QueryDict(self.scope.get('query_string'))
        logger.info(f"query_param =  {query_param} session_id = {session_id}")
        # 修改 channel_name
        # 增加到异步
        # 分组添加，使用 channel_name
        await self.channel_layer.group_add(
            session_id,
            self.channel_name,
        )
        await self.accept()

    async def disconnect(self, code):
        logger.info(f"disconnect code = {code}")
        # query_param = QueryDict(self.scope.get('query_string'))
        session_id = self.scope['url_route']['kwargs']['session_id']
        self.telnet_client.close()
        # 分组添加，使用 channel_name
        await self.channel_layer.group_discard(
            session_id,
            self.channel_name,
        )

    async def receive(self, text_data=None, bytes_data=None):
        session_id = self.scope['url_route']['kwargs']['session_id']
        logger.debug(f"text_data = {text_data}, bytes_data = {bytes_data} session_id = {session_id}")
        # send message to room group
        if text_data:
            try:
                text_data_json = json.loads(text_data)
                if text_data_json:
                    logger.debug(f"json data = {text_data_json}")
                    flag_str, col, row = text_data_json
                    if flag_str == "onopen":
                        # 初始化
                        con = await self.get_connect(2)
                        code, message = self.telnet_client.connect(
                            host=con.server, port=int(con.port), username=con.username,
                            password=AesEncrypt().decrypt(con.password),
                            session_id=session_id
                        )
                        if code != 0:
                            await self.send(f"\033[1;3;31mCan not connect to server: {message}\033[0m")
                            await self.disconnect(3000)
                        else:
                            await self.channel_layer.group_send(
                                session_id,
                                {
                                    "type": "telnet_message",
                                    "message": message
                                }
                            )
            except Exception as e:
                # logger.exception(e)
                await self.telnet_client.django_to_shell(text_data)
        if bytes_data:
            # 字节流发送
            # self.redis_pubsub.publish(session_id, bytes_data)
            # await self.send(bytes_data=bytes_data)
            pass

    async def telnet_message(self, event):
        message = event["message"]
        logger.info(f"message = {message}")
        await self.send(text_data=message)
