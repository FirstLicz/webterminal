from guacamole.client import GuacamoleClient
import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer

import logging

logger = logging.getLogger("default")


class GuacamoleAsyncConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        logger.info(f"channel_name = {self.channel_name} connect")
        await self.accept()

    async def disconnect(self, code):
        logger.info(f"channel_name = {self.channel_name} disconnect")
        pass

    async def receive(self, text_data=None, bytes_data=None):
        client = GuacamoleClient('192.168.1.83', 4822)
        client.handshake(protocol='rdp', hostname='localhost', port=3389)
        instruction = client.receive()

    # 接收 通道消息
    async def guacamole_message(self, event):
        message = event["message"]
        logger.info(f"message = {message}")
        # Send message to websocket
        await self.send(text_data=message)
