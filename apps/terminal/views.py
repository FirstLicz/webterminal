from django.shortcuts import render
from django.views.generic import View
from django.http.response import JsonResponse, Http404
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from pathlib import Path
import uuid
import logging
import io
import os

from apps.common.custom_storge import SFTPStorage
from apps.common.utils import SFTPFileResponse, StreamingFileResponse
from apps.terminal.models import Connections, ScreenRecord

logger = logging.getLogger("test" if settings.DEBUG else "default")


# Create your views here.


class WebTerminalView(View):

    def get(self, request, server_id):
        try:
            conn = Connections.objects.get(id=int(server_id))  # 可以随机生成、但是要入库-->找到即可
        except:
            return Http404("网页不存在")
        if not conn:
            return Http404("网页不存在")
        logger.info(f"protocol type = {conn.protocol_type}")
        if conn.protocol_type == Connections.TELNET:
            return render(request, "terminal/telnet.html", {
                "session_id": uuid.uuid1().hex,
                "server_id": server_id,
            })
        elif conn.protocol_type == Connections.SSH2:
            return render(request, "terminal/ssh.html", {
                "session_id": uuid.uuid1().hex,
                "server_id": server_id,
            })
        elif conn.protocol_type == Connections.RDP:
            return render(request, "terminal/ssh.html", {
                "session_id": uuid.uuid1().hex,
                "server_id": server_id,
            })
        else:
            return Http404("网页不存在")


class WebTerminalMonitorView(View):

    def get(self, request, session_id):
        return render(request, "terminal/ssh2Monitor.html", {
            "session_id": session_id,
        })


class WebTerminalKillView(View):

    def post(self, request):
        room_id = request.POST.get("room_id")
        async_to_sync(get_channel_layer().group_send)(room_id, {
            "type": "disconnect",
        })
        return JsonResponse({
            "data": {},
            "code": 0
        })


class TerminalPlayView(View):

    def get(self, request, session_id):
        # TODO 读取视频文件
        screen_record = ScreenRecord.objects.get(session=session_id)
        if screen_record:
            logger.info(f"path = {screen_record.path} len = {len(settings.BASE_DIR.as_posix())}")
            video_path = screen_record.path[len(settings.BASE_DIR.as_posix()):]
        return render(request, "terminal/terminal_play.html", locals())


class GuacamoleView(View):

    def get(self, request):
        return render(request, "terminal/ssh.html", {
            "session_id": uuid.uuid1().hex,
        })


class TestView(View):

    def get(self, request):
        return render(request, "test_html/test_onchange.html", {
            "session_id": uuid.uuid1().hex,
        })


class TestApiView(View):

    def post(self, request):
        print(f"{request.POST}")
        return JsonResponse({
            "code": 0,
            "msg": "success"
        })


class TerminalSftp(View):
    """
        文件列表, post/get 请求都需要把文件列表 重新发送一遍
    """

    @staticmethod
    def response_files(storage: SFTPStorage = None, files=None, dirs=None):
        result_list = list()
        tmp_list = files[::] + dirs
        for _elem in tmp_list:
            _dict = {}
            elem = storage.stat(_elem)
            _dict["name"] = _elem
            _dict["mtime"] = elem.st_mtime
            if _elem in files:
                _dict["size"] = elem.st_size
                _dict["mime"] = "text/plain"
            else:
                _dict["size"] = "unknown"
                _dict["mime"] = "directory"
            result_list.append(_dict)
        return result_list

    def sftp_storage(self, server, cmd, path, name):
        """
            name: GET method 是target path name
                  POST method 是 files
        """
        storage = SFTPStorage(server)
        if cmd == "download":
            filename = Path(path, name).as_posix()
            is_dir = storage.is_dir(filename)
            logger.info(f"download filename = {filename} is_dir = {is_dir}")
            if is_dir:
                # 目录下载, 临时目录
                local_path = Path(settings.MEDIA_ROOT, server.id, "_DOWNTMP")
                if not local_path.is_dir():
                    os.makedirs(local_path.as_posix())
                tarfile = storage.download_folder(filename, local_path.as_posix())
                logger.info(f"download folder tarfile = {tarfile}")
                # 删除本地文件夹
                fn = open(tarfile, 'rb')
                def file_iterator(fn, chunk_size=4096):
                    while True:
                        c = fn.read(chunk_size)
                        if c:
                            yield c
                        else:
                            break
                response = StreamingFileResponse(file_iterator(fn), filename=Path(tarfile).name)
                return response
            else:
                # 下载，直接退出相应
                file = io.BytesIO()
                storage.write(filename, file)
                file.seek(0)
                # file = open(r'F:\bwd_workspace\gitspace\github\personal\webterminal\terminal\urls.py', 'rb')
                # name = "urls.py"
                response = SFTPFileResponse(file, filename=name)
                return response
        elif cmd == "upload":
            # 支持多文件上传
            # for f in name:    # 上传到本地目录
            #     target_path = Path(settings.MEDIA_ROOT, path[1:])
            #     if not target_path.is_dir():
            #         os.makedirs(target_path.as_posix())
            #     print(f.__dict__)
            #     with open(Path(target_path,  f.name).as_posix(), 'wb+') as destination:
            #         for chunk in f.chunks():
            #             destination.write(chunk)
            # 上传到 sftp
            try:
                storage.save(path, name)
            except:
                return JsonResponse({
                    "success": False,  # 返回状态
                    "message": "上传失败，内部错误"
                })
        dirs, files = storage.listdir(path)
        file_list = self.response_files(storage, files, dirs)
        return JsonResponse({
            "cwd": path,
            "files": file_list,
            "success": True     # 返回状态
        })

    def ftp_storage(self):
        pass

    def rdp_storage(self):
        pass

    def render_to_response(self, **kwargs):
        return

    def get(self, request, server_id):
        path = request.GET.get('path', "/")
        cmd = request.GET.get('cmd', "ls")
        option = request.GET.get('option', "sftp")
        name = request.GET.get("name", "")
        logger.info(
            f"server_id = {server_id} type server_id = {type(server_id)}, param = {path}, option = {option}, name = {name}")
        try:
            server = Connections.objects.get(id=int(server_id))
            if option == "sftp":
                return self.sftp_storage(server, cmd, path, name)
            else:
                dirs, files = list(), list()
            return
        except (ValueError, KeyError) as e:
            logger.exception(e)
            return JsonResponse({
                "cwd": path,
                "files": []
            })

    def post(self, request, token):
        path = request.POST.get('path', "/")
        cmd = request.POST.get('cmd', "ls")
        option = request.POST.get('option', "sftp")
        logger.info(f"token = {token}, param = {path}, option = {option}")
        logger.info(f"files = {request.FILES}")
        logger.info(f"filename = {request.FILES.getlist('qqfile')}")
        # 上传到 sftp
        if option == "sftp":
            return self.sftp_storage(token, cmd, path, request.FILES.getlist('qqfile'))
