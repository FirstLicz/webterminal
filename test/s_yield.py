l = [x for x in range(6)]


def nums():
    for x in l:
        yield x


def fixed_l():
    yield from l


def bottom():
    return (yield 42)


def middle():
    return (yield from bottom())


def top():
    return (yield from middle())


if __name__ == '__main__':
    print(l)
    ret = nums()
    print(ret)
    print(fixed_l())

    # 获取生成器
    gen = top()
    value = next(gen)
    print(value)  # Print '42'

    try:
        value = gen.send(value * 2)
    except StopIteration as exc:
        value = exc.value
    print(value)
