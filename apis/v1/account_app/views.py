from rest_framework import viewsets, mixins

from account_app.models import User
from core.utils.permissions import NotAuthenticated
from . import serializers


class UserCreateViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    "mobile phone and password is required"

    queryset = User.objects.only("id")
    serializer_class = serializers.UserCreateSerializer
    permission_classes = (NotAuthenticated,)
