try:
    from django.utils.deprecation import MiddlewareMixin  # Django 1.10.x
except ImportError:
    MiddlewareMixin = object  # Django 1.4.x - Django 1.9.x


class CustomMiddleware(MiddlewareMixin):

    def process_request(self, request):
        print(request.META)
        return

    def process_response(self, request, response):
        print(f"{request.META.get('REQUEST_METHOD')}")
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        print("-" * 80)
        print("MD 中的process_view")
        print(view_func, view_func.__name__)



