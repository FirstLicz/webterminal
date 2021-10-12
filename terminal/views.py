from django.shortcuts import render
from django.views.generic import View
from django.http.response import JsonResponse
from django.conf import settings
import uuid
import logging

from common.custom_storge import SFTPStorage

logger = logging.getLogger("test" if settings.DEBUG else "default")


# Create your views here.


class WebSshTwoView(View):

    def get(self, request):
        return render(request, "terminal/ssh.html", {
            "session_id": uuid.uuid1().hex,
        })


class TerminalPlayView(View):

    def get(self, request):
        # TODO 读取视频文件
        video_path = "/media/" + "SSH2/0b3016bed7eb4e26ba2c6883e65fff66!f03b512444d44f7f87626dba67c9f00c"
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
        文件列表
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

    def get(self, request, token):
        path = request.GET.get('path', "/")
        logger.info(f"token = {token}, param = {path}")
        try:
            shell = settings.TERMINAL_SESSION_DICT[token]
            logger.info(f"shell object = {shell}")
            storage = SFTPStorage(token)
            dirs, files = storage.listdir(path)
            _files = self.response_files(storage, files, dirs)
            return JsonResponse({
                "cwd": path,
                "files": _files
            })
        except (ValueError, KeyError) as e:
            logger.exception(e)
            return JsonResponse({
                "cwd": path,
                "files": []
            })

    def post(self, request, token):
        pass
