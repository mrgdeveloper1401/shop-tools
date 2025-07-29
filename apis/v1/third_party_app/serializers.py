from rest_framework import serializers

from core_app.models import Image


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("image",)


class CreateProductBaSalamSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    price = serializers.IntegerField()
    category_id = serializers.IntegerField()
    images = serializers.ListField(child=serializers.IntegerField())
    inventory = serializers.IntegerField()
    is_active = serializers.BooleanField(default=False)
    vendor_id = serializers.IntegerField()
