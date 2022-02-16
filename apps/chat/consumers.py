import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from channels_redis.core import RedisChannelLayer
from asgiref.sync import async_to_sync


class ChatConsumer(WebsocketConsumer):
    """
        同步消费者
    """

    def connect(self):
        print(f"scope = {self.scope}")
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        # 房间 分组 名
        # self.room_group_name = "chat_%s" % self.room_name
        self.room_group_name = "chat_test"

        # join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        print(f"connect socket")
        self.accept()
        print(f"accept connect socket")

    def disconnect(self, code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        print(f"断开连接")

    # Receive message from WebSocket
    def receive(self, text_data=None, bytes_data=None):
        print(type(text_data), text_data)
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        print(f"send message: {message}, {self.channel_name}")
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message
            }
        )
        # self.send(text_data=json.dumps({"message": message}))

    # Receive message from room group
    def chat_message(self, event):
        message = event["message"]
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))


class ChatAsyncConsumer(AsyncWebsocketConsumer):
    """
        异步消费者
    """

    async def connect(self):
        print(f"异步 连接 {self.scope}")
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]

        # self.room_group_name = "chat_%s" % self.room_name
        self.room_group_name = "chat_test"

        # 分组添加，使用 channel_name
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()
        print(f"异步连接完成")

    async def disconnect(self, code):
        print(f"断开连接, 离开分组")
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # 接收 消息
    async def receive(self, text_data=None, bytes_data=None):
        print(f"text_data = {text_data} {self.channel_name}")
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
            }
        )
        ret = get_channel_layer()
        print(f"ret = {ret}")
        print(f"{ret.__dict__}")
        print(f"{ret.pools[0].__dict__}")
        print(f"{ret.pools[0].in_use}")

    # 接收分组消息
    async def chat_message(self, event):
        message = event["message"]
        print(f"message = {message}")
        # Send message to websocket
        await self.send(text_data=json.dumps(
            {
                "message": message
            }
        ))
