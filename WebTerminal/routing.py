from django.urls import re_path

from chat.consumers import ChatAsyncConsumer
from terminal.consumers import AsyncTerminalConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", ChatAsyncConsumer.as_asgi()),
    re_path(r"ws/terminal/(?P<session_id>\w+)/$", AsyncTerminalConsumer.as_asgi()),
]
