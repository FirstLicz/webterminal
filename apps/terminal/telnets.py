import telnetlib
import json
import time
from threading import Thread
import traceback
import logging
import redis
from paramiko.py3compat import u

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.conf import settings

try:
    import select
    import termios
    import tty
except ImportError:
    pass

logger = logging.getLogger("default")

__all__ = ["TelnetClient"]


class TelnetClient(object):
    """
    由于 telnetlib 库的原因，终端无法显示颜色以及设置终端大小
    """

    def __init__(self, host=None, port: int = None, username=None, password=None, session_id=None):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.cmd = ''
        self.res = ''
        self.telnet = telnetlib.Telnet()
        self.timeout = 60
        self.session_id = session_id
        self.websocket_channel = get_channel_layer()
        self.first_flag = False

    def connect(self, host=None, port: int = None, username=None, password=None, session_id=None):
        try:
            self.session_id = session_id
            self.telnet.open(host=host, port=port, timeout=self.timeout)
            self.telnet.read_until(b'login: ', timeout=20)
            user = '{0}\n'.format(username).encode('utf-8')
            self.telnet.write(user)

            self.telnet.read_until(b'Password: ', timeout=10)
            password = '{0}\n'.format(password).encode('utf-8')
            self.telnet.write(password)

            time.sleep(0.5)  # 服务器响应慢的话需要多等待些时间
            command_result = self.telnet.read_very_eager().decode('utf-8')
            logger.info(f"command_result = {command_result}")
            # self.res += command_result
            if 'Login incorrect' in command_result:
                message = 'connection login failed...'
                logger.info(f"{message}")
                return 1, f"password incorrect"
            self.telnet.write(b'export TERM=xterm\n')
            time.sleep(0.2)
            self.telnet.read_very_eager().decode('utf-8')
            # 把登录结果发送 web page
            # async_to_sync(self.websocket_channel.group_send)(self.session_id, {
            #     "type": "telnet_message",
            #     "message": command_result
            # })
            # 创建1线程将服务器返回的数据发送到django websocket, 多个的话会极容易导致前端显示数据错乱
            # Thread(target=self.django_to_shell).start()  # write to telnet thread
            Thread(target=self.websocket_to_django).start()  # write front end thread
            if command_result.startswith("\r\n"):
                command_result = command_result[2:]
            return 0, command_result
        except Exception as e:
            logger.exception(e)
            return 2, f"{str(e)}"

    async def django_to_shell(self, data):
        # pubsub = self.redis_instance.pubsub()
        # pubsub.subscribe(self.session_id)  # 开启订阅
        # while True:
        #     data = pubsub.get_message()
        if data:
            logger.info(f"redis receive data = {data}")
            send_data = data
            # if isinstance(data, dict):
            #     send_data = data.get("data")
            if send_data == 1 and not self.first_flag:
                self.first_flag = True
            else:  # isinstance(send_data, bytes):
                tmp_data = u(send_data)
                logger.info(f"send data = {tmp_data} encode data = {tmp_data.encode()}")
                try:
                    if tmp_data == '\r\n' or tmp_data == "\r":
                        await self.websocket_channel.group_send(self.session_id, {
                            "type": "telnet_message",
                            "message": tmp_data
                        })
                        logger.info(f"command confirm")
                        self.telnet.write(b"\n")
                        self.cmd = ""
                    elif tmp_data == '\t':
                        # 不支持tab 键
                        pass
                        # self.telnet.write(b"\t\n")
                        # async_to_sync(self.websocket_channel.group_send)(self.session_id, {
                        #     "type": "telnet_message",
                        #     "message": tmp_data
                        # })
                    else:
                        if tmp_data.encode() == b'\x0c':
                            # 组合键 ctrl + l
                            self.telnet.write(b"\x0c\n")
                        elif tmp_data.encode() == b'\x7f' and self.cmd == "":
                            # backspace 当命令为空时
                            pass
                        elif tmp_data.encode() == b'\x1b[D' or tmp_data.encode() == b'\x1b[C':
                            # 屏蔽左右键 左键 b'\x1b[D' 右键  b'\x1b[C'
                            pass
                        elif tmp_data.encode() == b'\x1b[B' or tmp_data.encode() ==  b'\x1b[A':
                            # 下键  b'\x1b[B'  上键   b'\x1b[A'
                            self.telnet.write(tmp_data.encode() + b'\n')
                        elif tmp_data.encode() == b'\x7f' and self.cmd != "":
                            # backspace 当命令为空时
                            self.cmd = self.cmd[:-1]
                            self.telnet.write(b"\x7f")
                            await self.websocket_channel.group_send(self.session_id, {
                                "type": "telnet_message",
                                "message": tmp_data
                            })
                        else:
                            await self.websocket_channel.group_send(self.session_id, {
                                "type": "telnet_message",
                                "message": tmp_data
                            })
                            self.telnet.write(tmp_data.encode())
                            self.cmd += tmp_data
                except Exception as e:
                    logger.exception(e)
                    self.telnet.close()
        # logger.info(f"clear sub scribe = {self.session_id}")
        # self.redis_instance.pubsub().unsubscribe(self.session_id)

    def websocket_to_django(self):
        try:
            while True:
                data = self.telnet.read_very_eager().decode()
                if not len(data):
                    continue
                async_to_sync(self.websocket_channel.group_send)(self.session_id, {
                    "type": "telnet_message",
                    "message": data
                })
        except Exception as e:
            logger.exception(e)
            # 断开连接
            async_to_sync(self.websocket_channel.group_send)(self.session_id, {
                "type": "disconnect",
            })

    def resize(self):
        pass

    def close(self):
        self.telnet.close()
