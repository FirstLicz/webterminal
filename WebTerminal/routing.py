from django.urls import re_path

from apps.chat.consumers import ChatAsyncConsumer
from apps.terminal.consumers import AsyncTerminalConsumer, AsyncTerminalConsumerMonitor, AsyncTelnetConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", ChatAsyncConsumer.as_asgi()),
    re_path(r"ws/terminal/(?P<session_id>\w+)/$", AsyncTerminalConsumer.as_asgi()),
    re_path(r"ws/terminal/monitor/(?P<session_id>\w+)/$", AsyncTerminalConsumerMonitor.as_asgi()),
    re_path(r"ws/telnet/(?P<session_id>\w+)/$", AsyncTelnetConsumer.as_asgi()),
    re_path(r"ws/telnet/monitor/(?P<session_id>\w+)/$", AsyncTerminalConsumer.as_asgi()),
]
