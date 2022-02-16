from django.urls import re_path, path

from . import views

urlpatterns = [
    re_path('^(?P<server_id>\d+)/$', views.WebTerminalView.as_view(), name='index'),
    path('monitor/<str:session_id>/', views.WebTerminalMonitorView.as_view(), name='ssh2_monitor'),
    path('kill/', views.WebTerminalMonitorView.as_view(), name='ssh2_monitor'),
    path('test/', views.TestView.as_view(), name='test'),
    path('play/<str:session_id>/', views.TerminalPlayView.as_view(), name='play_video'),
    path('sftp/<str:server_id>/', views.TerminalSftp.as_view(), name='terminal_sftp'),
    # telnet
]

