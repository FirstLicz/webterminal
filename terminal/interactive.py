import logging
import paramiko
import socket
import threading
import sys
from paramiko.py3compat import u
from datetime import datetime, timedelta
from paramiko import SSHClient, SSHException, AutoAddPolicy
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import os
from django.conf import settings
from django.core.cache import cache
from django.utils.timezone import now
from paramiko.channel import Channel
from queue import Queue
import redis
import json
import time
import platform
import uuid
import ast
import re

try:
    import select
    import termios
    import tty
except ImportError:
    pass

from utils.commandDeal import CommandDeal
from terminal.models import ScreenRecord

logger = logging.getLogger("default")
zmodem_sz_start = b'rz\r**\x18B00000000000000\r\x8a'
zmodem_sz_end = b'**\x18B0800000000022d\r\x8a'
zmodem_rz_start = b'rz waiting to receive.**\x18B0100000023be50\r\x8a'
zmodem_rz_end = b'**\x18B0800000000022d\r\x8a'
zmodem_cancel = b'\x18\x18\x18\x18\x18\x08\x08\x08\x08\x08'


class ShellHandler:

    def __init__(self, channel_name=None, session_id: str = None, hostname=None, username=None, password=None,
                 port=None):
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.channel_name = channel_name
        self.extra_params = dict()
        self.room_id = session_id
        self.extra_params['ssh'] = self.ssh
        # ssh client
        self.ssh.connect(hostname=hostname, username=username, password=password, port=port, timeout=3)
        self.channel = self.ssh.invoke_shell(term='xterm')
        # socket 不能 pickle
        # cache.set(session_id, {
        #     "ssh": self.ssh,
        # })

    def __del__(self):
        logger.info(f"self {self} close")
        # self.ssh.close()

    def windows_shell(self):
        logger.info(f"channel = {self.channel}")
        write = SubscribeWriteThread(channel=self.channel, channel_name=self.channel_name, room_id=self.room_id)
        write.setDaemon(True)
        write.start()
        self.extra_params["thread_ssh2_write"] = write
        display = InteractiveThread(channel=self.channel, channel_name=self.channel_name, room_id=self.room_id,
                                    extra_params=self.extra_params)
        display.setDaemon(True)
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
        write = SubscribeWriteThread(channel=self.channel, channel_name=self.channel_name, room_id=self.room_id,
                                     extra_params=self.extra_params)
        write.setDaemon(True)
        write.start()
        self.extra_params["thread_ssh2_write"] = write
        display = LinuxInteractiveThread(channel=self.channel, channel_name=self.channel_name, room_id=self.room_id,
                                         extra_params=self.extra_params)
        display.setDaemon(True)
        display.start()

    def resize_terminal(self, width=80, height=24, width_pixels=0, height_pixels=0):
        self.channel.resize_pty(width=width, height=height, width_pixels=width_pixels, height_pixels=height_pixels)

    def receive(self, text_data=None, bytes_data=None):
        pass

    def websocket_bytes_to_ssh(self, data):
        self.channel.send(data)


class InteractiveThread(threading.Thread):

    def __init__(self, channel: Channel = None, channel_name=None, extra_params: dict = None, room_id: str = None):
        super(InteractiveThread, self).__init__()
        self._control = threading.Event()  # 暂停控制标识
        self._run_control = threading.Event()  # 停止控制
        self._control.set()
        self._run_control.set()
        self.channel = channel
        self.channel_name = channel_name
        self.extra_params = extra_params
        self.room_id = room_id

    def pause(self):
        self._control.clear()  # 设置为False, 让现场阻塞

    def resume(self):
        self._control.set()  # 设置为True，让现场继续

    def stop(self):
        self._control.set()  # 恢复正常运行状态，
        self._run_control.clear()  # 设置 False， 跳出循环

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
            while self._run_control.isSet():
                self._control.wait()  # 为True时立即返回，为False时阻塞直到内部设置为True返回
                data = self.channel.recv(4096)
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
            duration_time = time.time() - begin_time
            logger.info(f"duration_time = {round(duration_time)}")
            time.sleep(0.2)
            logger.info(f"last thread ID = {thread_ssh2_write.ident}  is alive = {thread_ssh2_write.is_alive()}")
        except Exception as e:
            logger.exception(e)
        finally:
            f.close()


class LinuxInteractiveThread(InteractiveThread):

    def run(self) -> None:
        websocket_channel = get_channel_layer()
        begin_time = time.time()
        ssh = self.extra_params['ssh']
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
        screen_record = ScreenRecord(session=self.room_id, path=target_file, start_time=now(),
                                     protocol=ScreenRecord.SSH2)
        command = list()
        zmodem = False
        zmodemOO = False
        vim_flag = False
        vim_data = ''
        try:
            f.writelines([json.dumps(first_line), '\n'])
            self.channel.settimeout(0.0)
            data = None
            while self._run_control.isSet():
                self._control.wait()  # 为True时立即返回，为False时阻塞直到内部设置为True返回
                try:
                    r, w, e = select.select([self.channel], [], [])
                    if self.channel in r:
                        logger.debug(f"zmodem = {zmodem} zmodemOO = {zmodemOO}")
                        if zmodemOO:
                            zmodemOO = False
                            data = self.channel.recv(2)
                            if not data:
                                break
                            if data == b'OO':
                                async_to_sync(websocket_channel.send)(self.channel_name, {
                                    "type": "terminal_message",
                                    "message": data
                                })
                                continue
                            else:
                                data = data + self.channel.recv(4096)
                        else:
                            data = self.channel.recv(4096)
                        logger.debug(f"data = {u(data)} active = {self.channel.active}")
                        if len(u(data)) == 0:
                            break
                        if zmodem:
                            if zmodem_rz_end in data or zmodem_sz_end in data:
                                logger.info(f"zmodem end")
                                zmodem = False
                                if zmodem_sz_end in data:
                                    zmodemOO = True
                            if zmodem_cancel in data:
                                zmodem = False
                            async_to_sync(websocket_channel.send)(self.channel_name, {
                                "type": "terminal_message",
                                "message": data
                            })
                            continue
                        else:
                            if zmodem_sz_start in data or zmodem_rz_start in data:
                                # 单通道发送
                                logger.debug(f"zmodem start")
                                zmodem = True
                                async_to_sync(websocket_channel.send)(self.channel_name, {
                                    "type": "terminal_message",
                                    "message": data
                                })
                                continue
                            else:
                                message_data = u(data)
                                if message_data == "exit\r\n" or message_data == "logout\r\n" or \
                                        message_data == 'logout':
                                    self.channel.close()
                                    break
                                if message_data == "<<<close>>>":
                                    self.channel.close()
                                    ssh.close()
                                    break
                                if '\r\n' not in message_data:
                                    command.append(message_data)
                                else:
                                    logger.info(f"command = {command}")
                                    command_result = CommandDeal().deal_command(''.join(command))
                                    if len(command_result) != 0:
                                        # vim command record patch
                                        logger.info(f"command = {command_result}")
                                        if command_result.strip().startswith('vi') or \
                                                command_result.strip().startswith('fg'):
                                            vim_flag = True
                                        else:
                                            if vim_flag:
                                                if re.compile('\[.*@.*\][\$#]').search(vim_data):
                                                    vim_flag = False
                                                    vim_data = ''
                                            else:
                                                pass
                                        command = list()
                                async_to_sync(websocket_channel.group_send)(self.room_id, {
                                    "type": "terminal_message",
                                    "message": message_data
                                })
                        # 计算时差、记录内容
                        delay = round(time.time() - begin_time, 6)
                        f.writelines([json.dumps([delay, 'o', u(data)]), '\n'])
                except socket.timeout:
                    logger.info(f"socket time out")
                    break
                except Exception as e:
                    logger.exception(e)
                    async_to_sync(websocket_channel.group_send)(self.room_id, {
                        "type": "terminal_message",
                        "message": data
                    })
        except Exception as e:
            logger.exception(e)
        finally:
            f.close()
            # cache.delete(self.room_id)
            # 入口存储 视频记录
            duration_time = round(time.time() - begin_time)
            logger.info(f"duration_time = {duration_time}")
            screen_record.end_time = now()
            screen_record.duration_second = duration_time
            screen_record.save()
            logger.info(f"save screen record complete")
            # 发送关闭线程命令
            if thread_ssh2_write.is_alive():
                thread_ssh2_write.stop()
            redis_instance = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
            redis_instance.publish(self.room_id, json.dumps(['close']))
            logger.info(f"thread ID = {thread_ssh2_write.ident}  is alive = {thread_ssh2_write.is_alive()}")


class WindowInteractiveThread(InteractiveThread):

    def run(self) -> None:
        websocket_channel = get_channel_layer()
        begin_time = time.time()
        ssh = self.extra_params['ssh']
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
        screen_record = ScreenRecord(session=self.room_id, path=target_file, start_time=now(),
                                     protocol=ScreenRecord.SSH2)
        command = list()
        zmodem = False
        zmodemOO = False
        vim_flag = False
        vim_data = ''
        try:
            f.writelines([json.dumps(first_line), '\n'])
            self.channel.settimeout(0.0)
            data = None
            while self._run_control.isSet():
                self._control.wait()  # 为True时立即返回，为False时阻塞直到内部设置为True返回
                try:
                    if self.channel:
                        logger.debug(f"zmodem = {zmodem} zmodemOO = {zmodemOO}")
                        if zmodemOO:
                            zmodemOO = False
                            data = self.channel.recv(2)
                            if not data:
                                break
                            if data == b'OO':
                                async_to_sync(websocket_channel.send)(self.channel_name, {
                                    "type": "terminal_message",
                                    "message": data
                                })
                                continue
                            else:
                                data = data + self.channel.recv(4096)
                        else:
                            data = self.channel.recv(4096)
                        logger.debug(f"data = {u(data)} active = {self.channel.active}")
                        if len(u(data)) == 0:
                            break
                        if zmodem:
                            if zmodem_rz_end in data or zmodem_sz_end in data:
                                logger.info(f"zmodem end")
                                zmodem = False
                                if zmodem_sz_end in data:
                                    zmodemOO = True
                            if zmodem_cancel in data:
                                zmodem = False
                            async_to_sync(websocket_channel.send)(self.channel_name, {
                                "type": "terminal_message",
                                "message": data
                            })
                            continue
                        else:
                            if zmodem_sz_start in data or zmodem_rz_start in data:
                                # 单通道发送
                                logger.debug(f"zmodem start")
                                zmodem = True
                                async_to_sync(websocket_channel.send)(self.channel_name, {
                                    "type": "terminal_message",
                                    "message": data
                                })
                                continue
                            else:
                                message_data = u(data)
                                if message_data == "exit\r\n" or message_data == "logout\r\n" or \
                                        message_data == 'logout':
                                    self.channel.close()
                                    break
                                if message_data == "<<<close>>>":
                                    self.channel.close()
                                    ssh.close()
                                    break
                                if '\r\n' not in message_data:
                                    command.append(message_data)
                                else:
                                    logger.info(f"command = {command}")
                                    command_result = CommandDeal().deal_command(''.join(command))
                                    if len(command_result) != 0:
                                        # vim command record patch
                                        logger.info(f"command = {command_result}")
                                        if command_result.strip().startswith('vi') or \
                                                command_result.strip().startswith('fg'):
                                            vim_flag = True
                                        else:
                                            if vim_flag:
                                                if re.compile('\[.*@.*\][\$#]').search(vim_data):
                                                    vim_flag = False
                                                    vim_data = ''
                                            else:
                                                pass
                                        command = list()
                                async_to_sync(websocket_channel.group_send)(self.room_id, {
                                    "type": "terminal_message",
                                    "message": message_data
                                })
                        # 计算时差、记录内容
                        delay = round(time.time() - begin_time, 6)
                        f.writelines([json.dumps([delay, 'o', u(data)]), '\n'])
                except socket.timeout:
                    logger.info(f"socket time out")
                    break
                except Exception as e:
                    logger.exception(e)
                    async_to_sync(websocket_channel.group_send)(self.room_id, {
                        "type": "terminal_message",
                        "message": data
                    })
        except Exception as e:
            logger.exception(e)
        finally:
            f.close()
            # cache.delete(self.room_id)
            # 入口存储 视频记录
            duration_time = round(time.time() - begin_time)
            logger.info(f"duration_time = {duration_time}")
            screen_record.end_time = now()
            screen_record.duration_second = duration_time
            screen_record.save()
            logger.info(f"save screen record complete")
            # 发送关闭线程命令
            if thread_ssh2_write.is_alive():
                thread_ssh2_write.stop()
            redis_instance = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
            redis_instance.publish(self.room_id, json.dumps(['close']))
            logger.info(f"thread ID = {thread_ssh2_write.ident}  is alive = {thread_ssh2_write.is_alive()}")


class SubscribeWriteThread(threading.Thread):

    def __init__(self, channel_name: str = None, channel: Channel = None, extra_params: dict = None,
                 room_id: str = None):
        super(SubscribeWriteThread, self).__init__()
        self.channel_name = channel_name
        self.channel = channel
        self._control = threading.Event()
        self._control.set()
        # 建立 redis 订阅机制, 先有订阅，才能发送
        redis_instance = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
        self.pubsub = redis_instance.pubsub()
        self.extra_params = extra_params
        self.room_id = room_id  # redis 订阅
        self.pubsub.subscribe(self.room_id)
        self.cmd = ""
        self.last_cmd = ""

    def stop(self):
        self._control.clear()

    def run(self) -> None:
        first_flag = True
        while self._control.isSet():
            try:
                result = self.pubsub.get_message()
                if isinstance(result, bytes):
                    logger.info(f"send bytes data = {result}")
                    self.channel.send(result)
                if result and isinstance(result, dict):
                    logger.debug(f"result = {result}, type = {type(result)}")
                    data = result.get("data")
                    if isinstance(data, (str, bytes)):
                        if isinstance(data, bytes):
                            try:
                                data = u(data)
                            except Exception as e:
                                data = data
                        else:
                            try:
                                data = ast.literal_eval(data)
                            except Exception as e:
                                data = data
                    else:
                        data = data
                    logger.info(f"redis receive data = {data}")
                    try:
                        data = json.loads(data)
                        if data[0] == "close":
                            self.channel.send('<<<close>>>')  # close flag
                            break
                        elif data[0] == "resize":
                            self.channel.resize_pty(width=(data[1] // 9), height=(data[2] // 17))
                    except:
                        if isinstance(data, int):
                            # 第一次 接收内容为1
                            if data == 1 and first_flag:
                                first_flag = False
                                continue
                        if isinstance(data, bytes):
                            logger.info(f"send bytes data = {data}")
                            self.channel.send(data)
                        else:
                            logger.info(f"send str data = {str(data)}")
                            self.channel.send(str(data))
            except Exception as e:
                logger.exception(e)
            # time.sleep(0.001)
        logger.info(f"SubscribeWriteThread ID = {self.ident} closed unsubscribe name = {self.room_id}")
        self.pubsub.unsubscribe(self.room_id)


if __name__ == '__main__':
    shell = ShellHandler()
    print(shell.windows_shell())
