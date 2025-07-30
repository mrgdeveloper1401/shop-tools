from rest_framework import serializers
from asgiref.sync import sync_to_async

from core.utils.ba_salam import upload_image_file
from core_app.models import Image


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("image", "image_id_ba_salam")

    # async def create(self, validated_data):
    #     image = validated_data['image']
    #     async_upload = sync_to_async(image)
    #     res = await async_upload(image)
    #     return Image.objects.acreate(
    #         image=image,
    #         image_id_ba_salam=res.get("id")
    #     )
    def create(self, validated_data):
        image = validated_data.pop("image")
        res = upload_image_file(image)
        return Image.objects.create(
            image=image,
            image_id_ba_salam=res["id"],
        )

class CreateProductBaSalamSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    price = serializers.IntegerField()
    category_id = serializers.IntegerField()
    images = serializers.ListField(child=serializers.IntegerField())
    inventory = serializers.IntegerField()
    is_active = serializers.BooleanField(default=False)
    vendor_id = serializers.IntegerField()
