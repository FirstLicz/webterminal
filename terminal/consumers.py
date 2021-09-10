from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import json
from paramiko import SSHClient, SSHException
import socket
import logging

from terminal.models import Connections
from utils.encrypt import AesEncrypt
from terminal.interactive import ShellHandler


__all__ = ["AsyncTerminalConsumer", ]
logger = logging.getLogger("default")

connect_dict = {}


class AsyncTerminalConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print(f"session_id = {self.scope['url_route']['kwargs']['session_id']}")
        await self.accept()

    async def disconnect(self, code):
        pass

    # 数据库 访问
    @database_sync_to_async
    def get_connect(self):
        con = Connections.objects.get(id=1)
        return con

    async def receive(self, text_data=None, bytes_data=None):
        print(f"text_data = {text_data}")
        if text_data:
            text_data_json = json.loads(text_data)
            if len(text_data_json) == 3:
                ip, width, height = text_data_json
                print(f"ip = {ip} width = {width} height = {height}")
                # ssh client
                ssh = SSHClient()
                try:
                    con = await self.get_connect()
                    ssh.connect(hostname=con.server, username=con.username, password=AesEncrypt().decrypt(con.password),
                                port=con.port)
                    channel = ssh.invoke_shell(width=width, height=height)
                    shell = ShellHandler(channel=channel, channel_name=self.channel_name)
                    shell.windows_shell()
                except socket.timeout:
                    await self.send(text_data=json.dumps({
                        "message": f"\033[1;3;31m Connect to server {con.server} time out\033[0m"
                    }))
                    await self.accept(False)
                except SSHException:
                    pass
                except Exception as e:
                    logger.exception(e)

                await self.send(text_data=json.dumps({
                    "message": self.channel_name
                }))
            elif len(text_data_json) == 2:
                method, message = text_data_json
                print(method, message)
