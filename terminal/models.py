from django.db import models
from django.contrib.auth.hashers import make_password, check_password

from utils.encrypt import AesEncrypt

# Create your models here.


class Connections(models.Model):

    SSH2 = "SSH2"
    RDP = "RDP"
    VNC = "VNC"
    TELNET = 'TELNET'

    PROTOCOL_TYPE = [
        (SSH2, "ssh2"),
        (RDP, "rdp"),
        (VNC, "vnc"),
        (TELNET, "telnet"),
    ]

    name = models.CharField(max_length=128, verbose_name="别名")
    username = models.CharField(max_length=128, verbose_name="用户名", null=True, blank=False)
    password = models.CharField(max_length=256, verbose_name="用户密码")
    protocol_type = models.CharField(max_length=6, choices=PROTOCOL_TYPE, verbose_name="协议类型", default=SSH2)
    server = models.CharField(max_length=16, verbose_name="ipv4", blank=False)
    port = models.CharField(max_length=5, verbose_name="端口", blank=False)

    @classmethod
    def make_password(cls, passwd):
        aes = AesEncrypt()
        return aes.encrypt(passwd)

    @classmethod
    def check_password(cls, passwd):
        pass


class CommandLog(models.Model):

    session = models.CharField(max_length=64, verbose_name="会话ID", db_index=True)
    content = models.TextField(verbose_name="命令内容")

    class Meta:
        verbose_name = "command_log"
        db_table = "command_log"
        verbose_name_plural = verbose_name


class ScreenRecord(models.Model):

    SSH2 = "ssh2"
    RDP = "rdp"
    TELNET = "telnet"
    SSH = "ssh"
    VNC = "vnc"

    CHOOSE_PROTO = (
        (SSH2, "ssh2"),
        (RDP, "windows rdp"),
        (TELNET, "telnet"),
        (SSH, "ssh"),
        (VNC, "vnc"),
    )

    session = models.CharField(max_length=64, verbose_name="会话ID", db_index=True)
    path = models.FilePathField(verbose_name="屏幕记录", match="/media/")
    start_time = models.DateTimeField(verbose_name="开始时间", blank=True, null=True)
    end_time = models.DateTimeField(verbose_name="结束时间", blank=True, null=True)
    duration_second = models.IntegerField(verbose_name="持续N秒", blank=True, null=True)
    protocol = models.CharField(max_length=10, verbose_name="协议类别", choices=CHOOSE_PROTO, default=SSH2, blank=True,
                                null=True)

    class Meta:
        verbose_name = "screen_record"
        db_table = "screen_record"
        verbose_name_plural = verbose_name
