"""
ASGI config for WebTerminal project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter, ChannelNameRouter
from channels.auth import AuthMiddlewareStack
import WebTerminal.routing
from channels.security.websocket import OriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'WebTerminal.settings')

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        # Just HTTP for now. (We can add other protocols later.)
        "websocket": AuthMiddlewareStack(URLRouter(
            WebTerminal.routing.websocket_urlpatterns
        )),
        "channel": ChannelNameRouter({
            # 后台任务 worker
            # "thumbnails-generate": consumers.GenerateConsumer.as_asgi(),
        })
    }
)
