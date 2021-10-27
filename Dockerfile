FROM centos:7.6.1810

LABEL terminal.image.author="licz"

# 设置语言格式
ENV LANG C.UTF-8

WORKDIR /app

# 安装python3 环境
RUN yum install gcc-c++ wget make libffi-devel zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel -y \
    && wget https://www.python.org/ftp/python/3.8.12/Python-3.8.12.tar.xz && tar -xvf Python-3.8.12.tar.xz \
    && cd Python-3.8.12 && mkdir /usr/local/python3 && ./configure --prefix=/usr/local/python3 --enable-shared \
    && make && make install && ln -s /usr/local/python3/bin/python3 /usr/bin/python3 \
    && ln -s /usr/local/python3/bin/pip3 /usr/bin/pip3 && cp /usr/local/python3/lib/libpython3.8.so.1.0 /usr/lib64/ \
    && cd /app/ && rm -rf Python-3.8.12* && pip3 config set global.index-url http://mirrors.aliyun.com/pypi/simple/ \
    && pip3 config set install.trusted-host mirrors.aliyun.com && mkdir -p /usr/local/sqlite && cd /usr/local/sqlite \
    && wget https://www.sqlite.org/2021/sqlite-autoconf-3360000.tar.gz --no-check-certificate \
    && tar -zxvf sqlite-autoconf-3360000.tar.gz && cd sqlite-autoconf-3360000 && ./configure --prefix=/usr/local/sqlite \
    && make && make install && mv /usr/bin/sqlite3 /usr/bin/sqlite3.bak \
    && ln -s /usr/local/sqlite/bin/sqlite3 /usr/bin/sqlite3 && cd /app/ \
    && echo 'export LD_LIBRARY_PATH="/usr/local/sqlite/lib"' > /etc/profile && source /etc/profile \




