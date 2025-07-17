from rest_framework import viewsets, permissions

from . import serializers
from core_app.models import PublicNotification


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
