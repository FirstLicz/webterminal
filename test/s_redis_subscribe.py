import redis
import json
import sys
import time
import threading


class RedisThread(threading.Thread):

    def __init__(self):
        super(RedisThread, self).__init__()
        self.__control = threading.Event()
        self.__control.set()

    def stop(self):
        self.__control.clear()

    def run(self) -> None:
        redis_con = redis.Redis(host="127.0.0.1")
        # 创建订阅客户端
        pubsub = redis_con.pubsub()
        result = redis_con.pubsub_channels()
        print(result)
        pubsub.subscribe("test")
        while self.__control.isSet():
            content = pubsub.get_message()
            if content:
                print(content)
            # redis_con.publish("test", json.dumps({"message": "test"}))
        print(f"stop thread id = {self.ident}")
        pubsub.unsubscribe("test")


class SendRedis(threading.Thread):

    def __init__(self):
        super(SendRedis, self).__init__()
        self.__control = threading.Event()
        self.__control.set()

    def stop(self):
        self.__control.clear()

    def run(self) -> None:
        redis_con = redis.Redis(host="127.0.0.1")
        # 创建订阅客户端
        while self.__control.isSet():
            redis_con.publish("test", json.dumps({"message": "test"}))
            time.sleep(2.5)
        print(f"send redis end = {self.ident}")


def redis_subscribe():
    redis_con = redis.Redis(host="127.0.0.1")
    # 创建订阅客户端
    pubsub = redis_con.pubsub()
    result = redis_con.pubsub_channels()
    print(result)
    pubsub.subscribe("test")
    index = 0
    while True:
        content = pubsub.parse_response()
        if content:
            print(content)
        # redis_con.publish("test", json.dumps({"message": "test"}))


def worker():
    print(f"start time = {time.strftime('%Y-%m-%d %H:%M:S', time.localtime(time.time()))}")
    test_redis = RedisThread()
    test_redis.start()
    send_redis = SendRedis()
    send_redis.start()
    time.sleep(30)
    print(f"end time = {time.strftime('%Y-%m-%d %H:%M:S', time.localtime(time.time()))}")
    send_redis.stop()
    # stop subscribe
    test_redis.stop()
    print(f"end time = {time.strftime('%Y-%m-%d %H:%M:S', time.localtime(time.time()))}")
    time.sleep(60)


def redis_unsubscribe():
    redis_con = redis.Redis(host="127.0.0.1")
    # 取消 订阅
    redis_con.pubsub().unsubscribe("test")
    redis_con.close()


if __name__ == '__main__':
    # redis_subscribe()
    # print(f"退出")
    # time.sleep(4)
    # redis_unsubscribe()
    # print(f"注销")
    # time.sleep(1000)
    worker()
