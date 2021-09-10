import yaml
import os


def write_yaml_file(data: dict = None):
    with open("test.yaml", 'w', encoding="utf8") as f:
        yaml.dump(data, f)


def read_yaml_file(file_name: str = ""):
    if os.path.isfile(file_name):
        with open(file_name, 'r', encoding="utf8") as f:
            result = yaml.load(f)
        return result


if __name__ == '__main__':
    data = {
        "name": "张三",
        "age": 20
    }
    # write_yaml_file(data)
    file_name = os.path.join(os.getcwd(), "test.yaml")
    ret = read_yaml_file(file_name)
    print(ret)
