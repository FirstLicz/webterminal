import asyncio
import time
from datetime import datetime, timedelta
import requests
import threading


async def custom_sleep(x):
    print(f"wait {x}")
    print(f"start time ==>{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    await asyncio.sleep(x)
    print(f"end time ==>{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    return x


async def display_date(loop):
    end_time = loop.time() + 5.0
    while True:
        print(datetime.now())
        if (loop.time() + 1.0) >= end_time:
            break
        await asyncio.sleep(1)


async def main(num):
    ret = await custom_sleep(num)
    print(ret)


async def test2(i):
    r = await other_test(i)
    print(i, r)


async def other_test(i):
    r = requests.get(i)
    print(i)
    await asyncio.sleep(4)
    print(time.time() - start)
    return r


url = ["https://segmentfault.com/p/1210000013564725",
       "https://www.jianshu.com/p/83badc8028bd",
       "https://www.baidu.com/"]


# loop = asyncio.get_event_loop()
# task = [asyncio.ensure_future(test2(i)) for i in url]
# start = time.time()
# loop.run_until_complete(asyncio.wait(task))
# endtime = time.time() - start
# print(endtime)
# loop.close()


def create_task_after_loop():
    coroutine = custom_sleep(3)
    print(f"coroutine: {coroutine}")

    task = asyncio.ensure_future(coroutine)
    print(f"Task: {task}")
    loop = asyncio.get_event_loop()
    loop.run_until_complete(task)
    print(f"task result = {task.result()}")
    loop.close()


async def request_baidu():
    url = "http://www.baidu.com"
    status = requests.get(url)
    return status


def callback(task):
    print(f"Status: {task.result()}")


def task_add_done_callback():
    coroutine = request_baidu()
    print(f"coroutine: {coroutine}")
    task = asyncio.ensure_future(coroutine)
    task.add_done_callback(callback)
    print(f"Task: {task}")

    loop = asyncio.get_event_loop()
    loop.run_until_complete(task)
    loop.close()


async def hello():
    print(f"hello world ==> %s" % threading.currentThread().ident)
    await asyncio.sleep(1)
    print(f"hello again %s " % threading.currentThread().ident)


def test_main():
    loop = asyncio.get_event_loop()
    tasks = [hello() for x in range(10 ** 6)]
    loop.run_until_complete(asyncio.wait(tasks))
    loop.close()


class TestAsyncDemo:

    def __init__(self):
        pass

    async def sleep(self, num):
        await asyncio.sleep(3)
        print(f"{time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))} num = {num}")

    async def start(self):
        n = 0
        try:
            while True:
                time.sleep(1)
                n += 1
                await self.sleep(n)
                print(f"{time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time()))} n = {n}")
        except KeyboardInterrupt:
            pass

    def main(self):
        loop = asyncio.get_event_loop()
        loop.run_until_complete(self.start())
        loop.close()


if __name__ == '__main__':
    # 先创建task，在创建事件 循环
    # create_task_after_loop()

    # task add_done_callback 绑定回调函数
    # task_add_done_callback()
    #
    # test_main()
    a = TestAsyncDemo()
    a.main()
