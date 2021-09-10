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
