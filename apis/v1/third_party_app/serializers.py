from rest_framework import serializers

from core_app.models import Image


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("image",)
