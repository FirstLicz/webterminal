from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels_redis.core import RedisChannelLayer
import json
import redis
from paramiko import SSHClient, SSHException, AutoAddPolicy
import socket
import logging
import platform

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
        logger.debug(f"session_id = {self.scope['url_route']['kwargs']['session_id']}")
        await self.accept()

    async def disconnect(self, code):
        self.redis_pubsub.publish(self.channel_name, json.dumps({"message": "<<<close>>>"}))

    def get_pubsub(self):
        redis_instance = redis.Redis(host="127.0.0.1")
        return redis_instance

    # 数据库 访问
    @database_sync_to_async
    def get_connect(self):
        con = Connections.objects.get(id=2)
        return con

    async def receive(self, text_data=None, bytes_data=None):
        logger.debug(f"text_data = {text_data}, type = {type(text_data)}")
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
                        channel = ssh.invoke_shell(width=width, height=height)
                        shell = ShellHandler(channel=channel, channel_name=self.channel_name)
                        shell.windows_shell()
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
                self.redis_pubsub.publish(self.channel_name, text_data)

    # 接收分组消息
    async def terminal_message(self, event):
        message = event["message"]
        logger.info(f"message = {message}")
        # Send message to websocket
        await self.send(text_data=message)
