from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

# Create your views here.
from .tasks import print_hello


def index(request):
    return render(request, "chat/index.html")


def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })


def hello(request):
    task = print_hello.delay()
    return JsonResponse({"id": task.task_id})

