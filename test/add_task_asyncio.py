import asyncio
import time
from threading import Thread
import random
import threading
from queue import Queue


def start_loop(loop=None):
    asyncio.set_event_loop(loop)
    print(f"start time= {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))}")
    loop.run_forever()


def do_some_work(x, n):
    print(f"start time={time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))} x = {x}")
    time.sleep(1)
    print(f"end time={time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))} x = {x + random.randint(1, 30)}")


# new_loop = asyncio.new_event_loop()
# t = Thread(target=start_loop, args=(new_loop,))
# t.setDaemon(True)
# t.start()
#
# for x in range(10):
#     asyncio.run_coroutine_threadsafe(do_some_work(x), new_loop)
#
# t.join()
# new_loop.close()

report_clipboard_task_queue = Queue(1024)


class ClipboardTaskQueue(object):

    def __init__(self):
        self.queue = report_clipboard_task_queue
        # self.setDaemon(True)    # 设置为守护 随着主线程结束而 结束
        self._loop, _ = self.start_loop()

    @staticmethod
    def _start_loop(loop):
        asyncio.set_event_loop(loop)
        # print(f"start time= {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))}")
        loop.run_forever()

    def start_loop(self):
        new_loop = asyncio.new_event_loop()
        t = threading.Thread(target=self._start_loop, args=(new_loop,))
        t.setDaemon(True)
        t.start()
        return new_loop, t

    def add_task(self):
        pass

    def run(self) -> None:
        # 向 线程中添加任务
        async def worker(url, params):
            result = do_some_work(url, params)
        print("---")
        while True:
            if not self.queue.empty():
                url, param = self.queue.get()
                asyncio.run_coroutine_threadsafe(worker(url, param), self._loop)


def main():
    for x in range(10):
        report_clipboard_task_queue.put((x, x))
        time.sleep(1)


if __name__ == '__main__':

    clip = ClipboardTaskQueue()
    Thread(target=clip.run).start()
    main()

    time.sleep(100)
