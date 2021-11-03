## 前端插件 xterm.js 
1. npm i xterm -s
2. npm i xterm-addon-attach -s
3. npm i xterm-addon-fit -s
4. npm i xterm-addon-search -s
5. npm i xterm-addon-web-links -s  

####快速使用 xterm.js
pip install [pyxtermjs](https://pypi.org/project/pyxtermjs/#description)

> ### 操作记录，终端视频播放插件 [asciinema-player](https://github.com/asciinema/asciinema-player)
> 1. node.js 安装 npm install asciinema-player
> 2. 挂载 [asciinema-player.min.css](https://cdn.bootcdn.net/ajax/libs/asciinema-player/2.6.1/asciinema-player.min.css)
> 3. 挂载 [asciinema-player.min.js](https://cdn.bootcdn.net/ajax/libs/asciinema-player/2.6.1/asciinema-player.min.js)
> 4. 生成 demo.cast 文件: 如下, version=1, version=2;以换行符分割 两种写法, 建议使用 第二版, 方便持续写文件
```text
{
  "version": 1,
  "width": 80,
  "height": 24,
  "duration": 1.515658,
  "command": "/bin/zsh",
  "title": "",
  "env": {
    "TERM": "xterm-256color",
    "SHELL": "/bin/zsh"
  },
  "stdout": [
    [
      0.248848,
      "\u001b[1;31mHello \u001b[32mWorld!\u001b[0m\n"
    ],
    [
      1.001376,
      "I am \rThis is on the next line."
    ]
  ]
}
```
```text
{"version": 2, "width": 80, "height": 24,
    "timestamp": 1504467315, "title": "Demo",
    "env": {"TERM": "xterm-256color", "SHELL": "/bin/zsh"}}
[0.248848, "o", "\u001b[1;31mHello \u001b[32mWorld!\u001b[0m\n"]
[1.001376, "o", "That was ok\rThis is better."]
[2.143733, "o", " "]
[6.541828, "o", "Bye!"]
```
> 5. 以下是 html demo
```html
<html>
<head>
...
<link rel="stylesheet" type="text/css" href="/asciinema-player.css" />
...
</head>
<body>
...
<asciinema-player src="/demo.cast"></asciinema-player>
...
<script src="/asciinema-player.js"></script>
</body>
</html>
```

## 使用远程桌面 guacamole
### 安装guacamole 插件[pyguacamole](https://pypi.org/project/pyguacamole/)
> 1. pip install pyguacamole 
> 2. 

## django websocket 实现 监听
> pip install -U [channels](https://channels.readthedocs.io/en/stable/installation.html)
> 
> 4A V2.3版本需要实现
> 

## 文件上传 、下载  
> 1. npm i js-uploader -S  上传插件
>

## web Ui dialog 
> 1.npm i sweetalert2 
>

## docker 部署
> 1. docker run -d --privileged=true --name centos7_terminal -p 8000:8000 -v   F:\bwd_workspace\gitspace\github\personal\webterminal:/app/webterminal -p 8090:8090   centos:7.6.1810 /usr/sbin/init
> 
>
>
## 加密包
> 1. pip install pycryptodomex
>
>
## Centos7 python3.8 sqlite需要调整
  pip3 install pysqlite3-binary  
  vi /usr/local/python3/lib/python3.8/site-packages/django/db/backends/sqlite3/base.py
```text
# 修改内容
# from sqlite3 import dbapi2 as Database (注释掉这段)
from pysqlite3 import dbapi2 as Database # 启用pysqlite3
# :wq 保存即可
```
