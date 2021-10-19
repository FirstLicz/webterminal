import logging
import paramiko
import socket
import threading
import sys
from paramiko.py3compat import u
from datetime import datetime, timedelta
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import os
from django.conf import settings

from paramiko.channel import Channel
from queue import Queue
import redis
import json
import time
import platform
import uuid

try:
    import select
except ImportError:
    pass

logger = logging.getLogger("default")


class ShellHandler:

    def __init__(self, channel: Channel = None, width=800, height=600, channel_name=None, extra_params: dict = None,
                 room_id: str = None):
        if channel:
            self.channel = channel
            self.ssh = extra_params["ssh"]
        else:
            self.ssh = paramiko.SSHClient()
            self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            try:
                self.ssh.connect(hostname="192.168.1.83", username="root", password="bwda123!@#", port=22)
            except socket.timeout:
                print(f"connect 192.168.1.83 failed")
            self.channel = self.ssh.invoke_shell(width=width, height=height)
        self.channel_name = channel_name
        self.extra_params = extra_params
        self.room_id = room_id

    def __del__(self):
        self.ssh.close()

    def windows_shell(self):
        logger.info(f"channel = {self.channel}")
        write = SubscribeWriteThread(channel=self.channel, channel_name=self.channel_name, room_id=self.room_id)
        write.start()
        self.extra_params["thread_ssh2_write"] = write
        display = InteractiveThread(channel=self.channel, channel_name=self.channel_name, room_id=self.room_id,
                                    extra_params=self.extra_params)
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

    def __init__(self, channel: Channel = None, channel_name=None, extra_params: dict = None, room_id: str = None):
        super(InteractiveThread, self).__init__()
        self.__control = threading.Event()  # 暂停控制标识
        self.__run_control = threading.Event()  # 停止控制
        self.__control.set()
        self.__run_control.set()
        self.channel = channel
        self.channel_name = channel_name
        self.extra_params = extra_params
        self.room_id = room_id

    def pause(self):
        self.__control.clear()  # 设置为False, 让现场阻塞

    def resume(self):
        self.__control.set()  # 设置为True，让现场继续

    def stop(self):
        self.__control.set()  # 恢复正常运行状态，
        self.__run_control.clear()  # 设置 False， 跳出循环

    def run(self) -> None:
        websocket_channel = get_channel_layer()
        begin_time = time.time()
        ssh_obj = self.extra_params.get("ssh")
        thread_ssh2_write = self.extra_params.get("thread_ssh2_write", None)
        # 记录文件日志, 使用version 2 版本，优化 顺序写文件，防止文件过大，吃内存
        first_line = {
            "version": 2,
            "width": self.extra_params.get("width") // 9 - 1,
            "height": self.extra_params.get("height") // 17 - 1,
            "timestamp": round(begin_time), "title": "",
            "env": {
                "TERM": "xterm-256color", "SHELL": "/bin/bash"
            }
        }
        target_dir = os.path.join(settings.MEDIA_ROOT, "SSH2")
        if not os.path.isdir(target_dir):
            os.makedirs(target_dir)
        # target_file = os.path.join(target_dir, self.channel_name.split(".")[1])   # 默认单通道
        target_file = os.path.join(target_dir, self.channel_name + "_" + uuid.uuid1().hex)  # 团体通道
        f = open(target_file, 'w', encoding="utf8")
        try:
            f.writelines([json.dumps(first_line), '\n'])
            while self.__run_control.isSet():
                self.__control.wait()  # 为True时立即返回，为False时阻塞直到内部设置为True返回
                data = self.channel.recv(1024)
                data = u(data)
                logger.info(f"recv data = {data}")
                if not data:
                    break
                elif data == "<<<close>>>":
                    self.channel.close()
                    if isinstance(ssh_obj, paramiko.SSHClient):
                        ssh_obj.close()
                    if thread_ssh2_write and isinstance(thread_ssh2_write, SubscribeWriteThread):
                        thread_ssh2_write.stop()
                    break
                if platform.system().lower() == "windows":
                    sys.stdout.flush()
                # 计算时差、记录内容
                end_time = time.time()
                delay = round(end_time - begin_time, 6)
                # if len(data) == 1 or data == '\r\n':
                #     f.writelines([json.dumps([delay, 'i', data]), '\n'])
                # else:
                f.writelines([json.dumps([delay, 'o', data]), '\n'])
                # 分组 发送
                async_to_sync(websocket_channel.group_send)(self.room_id, {
                    "type": "terminal_message",
                    "message": u(data)
                })
                # 单通道发送
                # async_to_sync(websocket_channel.send)(self.channel_name, {
                #     "type": "terminal_message",
                #     "message": data
                # })
            logger.info(f"thread ID = {thread_ssh2_write.ident}  is alive = {thread_ssh2_write.is_alive()}")
            # 建立 redis 订阅机制, 先有订阅，才能发送
            redis_instance = redis.Redis(host="127.0.0.1")
            pubsub = redis_instance.pubsub()
            pubsub.unsubscribe(self.room_id)
            logger.info(f"unsubscribe name = {self.room_id}")
            # 入口存储 视频记录
            duration_time = end_time -begin_time
            logger.info(f"duration_time = {round(duration_time)}")
            time.sleep(0.2)
            logger.info(f"last thread ID = {thread_ssh2_write.ident}  is alive = {thread_ssh2_write.is_alive()}")
        except Exception as e:
            logger.exception(e)
        finally:
            f.close()


class SubscribeWriteThread(threading.Thread):

    def __init__(self, channel_name: str = None, channel: Channel = None, extra_params: dict = None, room_id: str = None):
        super(SubscribeWriteThread, self).__init__()
        self.channel_name = channel_name
        self.channel = channel
        self.__control = threading.Event()
        self.__control.set()
        # 建立 redis 订阅机制, 先有订阅，才能发送
        redis_instance = redis.Redis(host="127.0.0.1")
        self.pubsub = redis_instance.pubsub()
        self.extra_params = extra_params
        self.room_id = room_id  # redis 订阅
        self.pubsub.subscribe(self.room_id)

    def stop(self):
        self.__control.clear()

    def run(self) -> None:
        while self.__control.isSet():
            result = self.pubsub.get_message(timeout=0.001)
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

            # time.sleep(0.001)
        logger.info(f"SubscribeWriteThread ID = {self.ident} closed")


if __name__ == '__main__':
    shell = ShellHandler()
    print(shell.windows_shell())
