from rest_framework import viewsets, serializers
from django.contrib.auth.models import User, make_password


class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(required=True, max_length=64)
    password = serializers.HiddenField(default=serializers.CurrentUserDefault())
    email = serializers.EmailField(required=False)
    is_superuser = serializers.BooleanField(required=True)
    is_staff = serializers.BooleanField(required=True)
    is_active = serializers.BooleanField(required=True)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=True)
    last_login = serializers.DateTimeField(required=False)
    date_joined = serializers.DateTimeField(required=False)

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get("password"))
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.password = make_password(validated_data.get("password")) if validated_data.get("password") else instance.password
        instance.email = validated_data.get("email", instance.email)
        instance.is_superuser = validated_data.get("is_superuser", instance.is_superuser)
        instance.is_staff = validated_data.get("is_staff", instance.is_staff)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_login = validated_data.get("last_login", instance.last_login)
        instance.email = validated_data.get("email", instance.email)
        instance.date_joined = validated_data.get("date_joined", instance.date_joined)
        instance.save()
        return instance


class UserModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"




