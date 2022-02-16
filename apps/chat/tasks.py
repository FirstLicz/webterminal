from __future__ import absolute_import
from celery import shared_task, task


def add(x, y):
    return


@shared_task
def print_hello():
    return "Hello world"
