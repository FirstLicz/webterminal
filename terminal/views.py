from django.shortcuts import render
from django.views.generic import View
from django.http.response import JsonResponse

import uuid


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
