from django.urls import re_path, path

from . import views

urlpatterns = [
    path('', views.WebSshTwoView.as_view(), name='index'),
    path('monitor/', views.WebSShTwoMonitorView.as_view(), name='ssh2_monitor'),
    path('test/', views.TestView.as_view(), name='test'),
    path('playVideo/', views.TerminalPlayView.as_view(), name='play_video'),
    path('sftp/<str:token>/', views.TerminalSftp.as_view(), name='terminal_sftp'),
]

