from rest_framework import viewsets, permissions

from core.utils.custom_filters import AdminImageFilter
from core.utils.pagination import TwentyPageNumberPagination
from . import serializers
from core_app.models import PublicNotification, Image


class PublicNotificationViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PublicNotificationSerializer
    queryset = PublicNotification.objects.filter(is_active=True).only(
        "title",
        "body",
        "created_at",
    )

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            self.permission_classes = (permissions.IsAuthenticated,)
        else:
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()


class AdminImageViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item
    """
    serializer_class = serializers.AdminImageSerializer
    permission_classes = (permissions.IsAdminUser,)
    pagination_class = TwentyPageNumberPagination
    filterset_class = AdminImageFilter
    queryset = Image.objects.defer(
        "is_deleted",
        "deleted_at",
    )
