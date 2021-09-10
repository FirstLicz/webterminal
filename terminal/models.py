from django.db import models
from django.contrib.auth.hashers import make_password, check_password

from utils.encrypt import AesEncrypt

# Create your models here.


class Connections(models.Model):

    PROTOCOL_TYPE = [
        ("SSH2", "Ssh2"),
        ("RDP", "RDP"),
        ("VNC", "RNV"),
    ]

    name = models.CharField(max_length=128, verbose_name="别名")
    username = models.CharField(max_length=128, verbose_name="用户名", null=True, blank=False)
    password = models.CharField(max_length=256, verbose_name="用户密码")
    protocol_type = models.CharField(max_length=6, choices=PROTOCOL_TYPE, verbose_name="协议类型")
    server = models.CharField(max_length=16, verbose_name="ipv4", blank=False)
    port = models.CharField(max_length=5, verbose_name="端口", blank=False)

    @classmethod
    def make_password(cls, passwd):
        aes = AesEncrypt()
        return aes.encrypt(passwd)

    @classmethod
    def check_password(cls, passwd):
        pass
