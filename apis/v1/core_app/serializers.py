from rest_framework import serializers


from core_app.models import PublicNotification


class PublicNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PublicNotification
        fields = (
            "id",
            "title",
            "body",
            "created_at"
        )
