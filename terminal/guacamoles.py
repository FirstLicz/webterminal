from guacamole.client import GuacamoleClient
import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer

client = GuacamoleClient('192.168.1.83', 4822)
client.handshake(protocol='rdp', hostname='localhost', port=3389)
instruction = client.receive()


class GuacamoleAsyncConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()

    async def disconnect(self, code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        pass
