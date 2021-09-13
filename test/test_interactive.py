import logging
import paramiko
import socket
import threading
import sys
from paramiko.py3compat import u
from datetime import datetime, timedelta
from channels.layers import get_channel_layer
from paramiko.channel import Channel
from queue import Queue

try:
    import select
except ImportError:
    pass

logger = logging.getLogger("default")


class ShellHandler:

    def __init__(self, channel: Channel = None, width=800, height=600, channel_name=None,
                 read_queue: Queue = None, write_queue: Queue = None):
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            self.ssh.connect(hostname="192.168.1.82", username="root", password="bwda123!@#", port=22)
        except socket.timeout:
            print(f"connect 192.168.1.83 failed")
        if channel:
            self.channel = channel
        else:
            self.channel = self.ssh.invoke_shell(width=width, height=height)
        self.channel_name = channel_name
        self.read_queue = read_queue
        self.write_queue = write_queue

    def __del__(self):
        self.ssh.close()

    def windows_shell(self):

        read = InteractiveThread(channel=self.channel, channel_name=self.channel_name, read_queue=self.read_queue)
        read.start()

        writer = SshTerminalWriteThread(channel=self.channel, write_queue=self.write_queue)
        writer.start()
        # try:
        #     while True:
        #         d = sys.stdin.read(1)
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

    def __init__(self, channel: Channel = None, channel_name=None, read_queue: Queue = None):
        super(InteractiveThread, self).__init__()
        self.__control = threading.Event()  # 暂停控制标识
        self.__run_control = threading.Event()  # 停止控制
        self.__control.set()
        self.__run_control.set()
        self.channel = channel
        self.channel_name = channel_name
        self.read_queue = read_queue

    def pause(self):
        self.__control.clear()  # 设置为False, 让现场阻塞

    def resume(self):
        self.__control.set()  # 设置为True，让现场继续

    def stop(self):
        self.__control.set()  # 恢复正常运行状态，
        self.__run_control.clear()  # 设置 False， 跳出循环

    def run(self) -> None:
        while self.__run_control.isSet():
            self.__control.wait()  # 为True时立即返回，为False时阻塞直到内部设置为True返回
            data = self.channel.recv(1024)
            data = u(data)
            if not data:
                break
            sys.stdout.write(data)
            sys.stdout.flush()
            # self.read_queue.put(data)


class SshTerminalWriteThread(threading.Thread):

    def __init__(self, channel: Channel = None, write_queue: Queue = None):
        super(SshTerminalWriteThread, self).__init__()
        self.channel = channel
        self.__control = threading.Event()
        self.__control.set()
        self.write_queue = write_queue

    def run(self) -> None:
        try:
            while self.__control.isSet():
                # d = self.write_queue.get()
                d = sys.stdin.read(1)
                if not d:
                    break
                self.channel.send(d)
        except EOFError:
            # user hit ^Z or F6
            pass


class SubscribeThread(threading.Thread):

    def __init__(self):
        super(SubscribeThread, self).__init__()
        self.read_queue = Queue()
        self.write_queue = Queue()

    def run(self) -> None:
        shell = ShellHandler(read_queue=self.read_queue, write_queue=self.write_queue)
        shell.windows_shell()
        while True:
            data = self.read_queue.get()
            print(data)


if __name__ == '__main__':
    SubscribeThread().start()

