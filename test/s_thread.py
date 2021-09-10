from threading import Thread, currentThread
import time


class TestThread(Thread):

    def __init__(self):
        super(TestThread, self).__init__()

    def run(self) -> None:
        while True:
            time.sleep(6)
            print(f"id = {self.ident} running")


class ControlThread(Thread):
    
    def __init__(self):
        super(ControlThread, self).__init__()

    def run(self) -> None:
        pass


if __name__ == '__main__':
    t_l = [TestThread() for x in range(5)]
    run_l = list()
    for t in t_l:
        t.start()
        run_l.append(t.ident)
    print(run_l)
    for t in t_l:
        t.join()

