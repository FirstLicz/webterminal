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
        video_path = "/media/" + "SSH2/specific.59919a870b3049929863120073d7b143!75fe9ee2079444128f56470f93b62f92"
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
