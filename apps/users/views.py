from django.shortcuts import render
from django.contrib.auth.models import User
from apps.users.serializers import UserSerializer, UserModelSerializer
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework import permissions, status, mixins, generics, viewsets
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication  # 认证模块
from rest_framework.authentication import SessionAuthentication


# Create your views here.


@api_view(['GET', 'POST'])
@permission_classes((permissions.AllowAny,))  # 设置权限
def user_list(request):
    if request.method == "GET":
        queryset = User.objects.all()
        users_list = UserSerializer(queryset, many=True)
        # return JsonResponse(user_list.data, safe=False)   普通restful api
        return Response(users_list.data)  # 使用rest_framework api
    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            queryset = User.objects.all()
            users_list = UserSerializer(queryset, many=True)
            return Response(users_list.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    # 使用 apiview

    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        queryset = User.objects.all()
        users_list = UserSerializer(queryset, many=True)
        return Response(users_list.data)


class UserListMixinView(mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                        generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class UserGenericsView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]  # 增加权限才可以进行post 提交内容
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserViewSet(viewsets.ModelViewSet):   # 使用viewsets
    queryset = User.objects.all()
    serializer_class = UserModelSerializer
    permission_classes = [permissions.IsAuthenticated]
    # authentication_classes = [JSONWebTokenAuthentication, SessionAuthentication]

    # 局部配置认证模块
    # 当发送get请求时，请求头中必须配置Authorization:JWT+空格+登录后返回的token
    # 由jwt配置文件中的'JWT_AUTH_HEADER_PREFIX': 'JWT',来控制
    # 默认JWT+空格+token，内部会根据空格来切割，取出token进行后续操作
    # 如果不传，则也能访问但是此时用户是游客模式
    # 加上下面的代码，就取消了游客模式，只有登录用户才能够访问
    # permission_classes = [IsAuthenticated, ]


# user_list = UserViewSet.as_view({
#     'get': 'list',
#     'post': 'create'
# })
