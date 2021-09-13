import logging
import paramiko
import socket
import threading
import sys
from paramiko.py3compat import u
from datetime import datetime, timedelta
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from paramiko.channel import Channel
from queue import Queue
import redis
import json
import time
import platform

try:
    import select
except ImportError:
    pass

logger = logging.getLogger("default")


class ShellHandler:

    def __init__(self, channel: Channel = None, width=800, height=600, channel_name=None):
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            self.ssh.connect(hostname="192.168.1.83", username="root", password="bwda123!@#", port=22)
        except socket.timeout:
            print(f"connect 192.168.1.83 failed")
        if channel:
            self.channel = channel
        else:
            self.channel = self.ssh.invoke_shell(width=width, height=height)
        self.channel_name = channel_name

    def __del__(self):
        self.ssh.close()

    def windows_shell(self):
        logger.info(f"channel = {self.channel}")
        write = SubscribeWriteThread(channel=self.channel, channel_name=self.channel_name)
        write.start()
        display = InteractiveThread(channel=self.channel, channel_name=self.channel_name)
        display.start()
        # 接收前端页面输入内容，发送到 shell
        # try:
        #     while True:
        #         d = self.channel.recv(1024)
        #         print(f"d = {d}")
        #         if not d:
        #             break
        #         self.channel.send(d)
        # except EOFError:
        #     # user hit ^Z or F6
        #     pass

    def posix_shell(self):
        try:
            self.channel.settimeout(0.0)

            while True:
                r, w, e = select.select([self.channel, ], [], [])
                if self.channel in r:
                    try:
                        x = u(self.channel.recv(1024))
                        if len(x) == 0:
                            sys.stdout.write("\r\n*** EOF\r\n")
                            break
                        sys.stdout.write(x)
                        sys.stdout.flush()
                    except socket.timeout:
                        pass
                if sys.stdin in r:
                    x = sys.stdin.read(1)
                    if len(x) == 0:
                        break
                    self.channel.send(x)

        finally:
            pass


class InteractiveThread(threading.Thread):

    def __init__(self, channel: Channel = None, channel_name=None):
        super(InteractiveThread, self).__init__()
        self.__control = threading.Event()  # 暂停控制标识
        self.__run_control = threading.Event()  # 停止控制
        self.__control.set()
        self.__run_control.set()
        self.channel = channel
        self.channel_name = channel_name

    def pause(self):
        self.__control.clear()  # 设置为False, 让现场阻塞

    def resume(self):
        self.__control.set()  # 设置为True，让现场继续

    def stop(self):
        self.__control.set()  # 恢复正常运行状态，
        self.__run_control.clear()  # 设置 False， 跳出循环

    def run(self) -> None:
        websocket_channel = get_channel_layer()
        while self.__run_control.isSet():
            self.__control.wait()  # 为True时立即返回，为False时阻塞直到内部设置为True返回
            data = self.channel.recv(1024)
            data = u(data)
            logger.info(f"recv data = {data}")
            if not data:
                break
            if platform.system().lower() == "windows":
                sys.stdout.flush()
            async_to_sync(websocket_channel.send)(self.channel_name, {
                "type": "terminal_message",
                "message": data
            })


class SubscribeWriteThread(threading.Thread):

    def __init__(self, channel_name: str = None, channel: Channel = None):
        super(SubscribeWriteThread, self).__init__()
        self.channel_name = channel_name
        self.channel = channel
        self.__control = threading.Event()
        self.__control.set()
        # 建立 redis 订阅机制, 先有订阅，才能发送
        redis_instance = redis.Redis(host="127.0.0.1")
        self.pubsub = redis_instance.pubsub()
        self.pubsub.subscribe(self.channel_name)

    def stop(self):
        self.__control.clear()

    def run(self) -> None:
        while self.__control.isSet():
            result = self.pubsub.get_message()
            if result:
                logger.debug(f"result = {result}, type = {type(result)}")
                data = result.get("data")
                if isinstance(data, str):
                    if platform.system().lower() == "windows":
                        if data == "\\r":
                            data = "\\r\\n"
                    self.channel.send(data)
                elif isinstance(data, bytes):
                    if platform.system().lower() == "windows":
                        if data == "\\r":
                            data = "\\r\\n"
                    self.channel.send(data.decode())
                # self.pubsub.publish(self.channel_name, json.dumps({"message": "test"}))

            time.sleep(0.001)


if __name__ == '__main__':
    shell = ShellHandler()
    print(shell.windows_shell())
