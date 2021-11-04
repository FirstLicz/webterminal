from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels_redis.core import RedisChannelLayer
import json
import redis

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
        logger.info(f"query_param =  {query_param} session_id = {session_id}")
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
        con = await self.get_connect()
        # 真实高度, windows 、 字符数量
        self.shell = ShellHandler(
            channel_name=self.channel_name,
            room_id=query_param.get("room_id"),
            # channel=channel, channel_name=query_param.get("room_id"),
        )
        logger.info(f"shell = {self.shell}")
        # 把会话 存储到 全局管理 列表中
        settings.TERMINAL_SESSION_DICT[session_id] = self.shell
        self.shell.connect(hostname=con.server, username=con.username, password=AesEncrypt().decrypt(con.password),
                           port=con.port)

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
        logger.debug(f"text_data = {text_data}, bytes_data = {bytes_data} session_id = {session_id}")
        # send message to room group
        query_param = QueryDict(self.scope.get('query_string'))
        room_id = query_param.get('room_id')
        logger.info(f"room_id = {room_id}")
        # self.channel_name = query_param.get("room_id")    # 无效
        if text_data:
            try:
                text_data_json = json.loads(text_data)
                if len(text_data_json) == 3:
                    cmd, width, height = text_data_json
                    logger.debug(f"ip = {cmd} width = {width} height = {height}")
                    self.shell.resize_terminal(
                        width_pixels=width, height_pixels=height,
                        width=(width // 9), height=(height // 17)
                    )
                    if cmd == "onopen":
                        # 根据操作系统 设定 使用
                        self.shell.extra_params['width'] = width
                        self.shell.extra_params['height'] = height
                        if platform.system() == "Linux":
                            self.shell.posix_shell()
                        elif platform.system() == "Windows":
                            self.shell.windows_shell()
            except Exception as e:
                self.redis_pubsub.publish(query_param.get("room_id"), text_data)  # 频道
        if bytes_data:
            # 字节流发送
            self.shell.websocket_bytes_to_ssh(bytes_data)

    # 接收通道消息
    async def terminal_message(self, event):
        message = event["message"]
        logger.info(f"message = {message}")
        # Send message to websocket
        if isinstance(message, str):
            await self.send(text_data=message)
        elif isinstance(message, bytes):
            await self.send(bytes_data=message)

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
