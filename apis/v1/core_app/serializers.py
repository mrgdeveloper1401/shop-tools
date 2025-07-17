from rest_framework import serializers

from account_app.models import User
from core_app.models import PublicNotification, Image


class PublicNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicNotification
        fields = (
            "id",
            "title",
            "body",
            "created_at"
        )


class AdminImageSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_active=True).only("mobile_phone"),
    )

    class Meta:
        model = Image
        exclude = (
            "is_deleted",
            "deleted_at"
        )
