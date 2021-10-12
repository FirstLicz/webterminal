from threading import Thread, Event
import redis
import json
import time

# 找到对应websocket ID
from channels.layers import get_channel_layer


class GuacamoleWriteThread(Thread):

    def __init__(self):
        super(GuacamoleWriteThread, self).__init__()
        self.__control_event = Event()
        self.__control_event.set()  # 停止线程
        self.__wait_event = Event()
        self.__wait_event.set()

    def stop(self):
        self.__control_event.clear()

    def pause(self):
        self.__wait_event.clear()

    def resume(self):
        self.__wait_event.set()

    def run(self) -> None:
        while self.__control_event.isSet():
            print(f"{time.strftime('%H:%M:%S', time.localtime(time.time()))} 开始...")
            self.__wait_event.wait()
            print(f"{time.strftime('%H:%M:%S', time.localtime(time.time()))} 暂定中...")
            time.sleep(0.4)
        print(f"{time.strftime('%H:%M:%S', time.localtime(time.time()))} 线程结束...")


if __name__ == '__main__':
    a = GuacamoleWriteThread()
    a.start()
    time.sleep(1)
    a.pause()
    time.sleep(2)
    a.resume()
    time.sleep(2)
    a.stop()
