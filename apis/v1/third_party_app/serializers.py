from rest_framework import serializers, exceptions
# from asgiref.sync import sync_to_async
from django.utils.translation import gettext_lazy as _

from core.utils.ba_salam import upload_image_file, upload_file
from core.utils.enums import ImageTypeChoices, FileTypeChoices
from core_app.models import Image, UploadFile


class ImageUploadSerializer(serializers.ModelSerializer):
    file_type = serializers.ChoiceField(
        choices=[(tag.value, tag.name) for tag in ImageTypeChoices],
        required=False,
    )
    class Meta:
        model = Image
        fields = ("image", "image_id_ba_salam", "file_type")

    # async def create(self, validated_data):
    #     image = validated_data['image']
    #     async_upload = sync_to_async(image)
    #     res = await async_upload(image)
    #     return Image.objects.acreate(
    #         image=image,
    #         image_id_ba_salam=res.get("id")
    #     )

    def validate(self, data):
        file_type = data.get("file_type", None)
        if file_type is None:
            raise exceptions.ValidationError(
                {
                    "message": _("File type is required"),
                }
            )
        return data

    def create(self, validated_data):
        image = validated_data.get("image", None)
        file_type = validated_data.pop("file_type")
        res = upload_image_file(image, file_type)
        return Image.objects.create(
            image=image,
            image_id_ba_salam=res.get("id", None),
        )


class UploadFileSerializer(serializers.ModelSerializer):
    file_type = serializers.ChoiceField(
        choices=[(i.value, i.name) for i in FileTypeChoices],
        required=False
    )

    class Meta:
        model = UploadFile
        fields = (
            "file",
            "file_id_ba_salam",
            "file_type"
        )

    def create(self, validated_data):
        file = validated_data.pop("file")
        file_type = validated_data.pop("file_type", None)
        res = upload_file(file_data=file, file_type=file_type)
        UploadFile.objects.create(
            file=file,
            file_id_ba_salam=res.get("id"),
        )
        return res

    def validate(self, data):
        file_type = data.get("file_type", None)
        if file_type is None:
            raise exceptions.ValidationError(
                {
                    "message": _("File type is required"),
                }
            )
        return data


class CreateProductBaSalamSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    price = serializers.IntegerField()
    category_id = serializers.IntegerField()
    images = serializers.ListField(child=serializers.IntegerField())
    inventory = serializers.IntegerField()
    is_active = serializers.BooleanField(default=False)
    vendor_id = serializers.IntegerField()
