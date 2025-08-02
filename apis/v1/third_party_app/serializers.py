from rest_framework import serializers, exceptions
# from asgiref.sync import sync_to_async
from django.utils.translation import gettext_lazy as _

from core.utils.ba_salam import upload_image_file, upload_file
from core.utils.browsable_api_custom import TextInputListField
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


class CreateProductAttributeSerializer(serializers.Serializer):
    pass


class CreateProductBaSalamSerializer(serializers.Serializer):
    name = serializers.CharField()
    category_id = serializers.IntegerField()
    status = serializers.IntegerField(default=3568)
    preparation_days = serializers.IntegerField(help_text=_("مدت زمان اماده سازی"))
    # photo = serializers.IntegerField()
    weight = serializers.IntegerField(help_text=_("وزن محصول"))
    package_weight = serializers.IntegerField(help_text=_("وزن محصول با بسته بندی محصول"))
    primary_price = serializers.IntegerField()
    stock = serializers.IntegerField(help_text=_("موجودی محصول"))
    description = serializers.CharField(help_text=_("توضحی در مورد محصول"))
    is_wholesale = serializers.BooleanField(default=False, help_text=_("محصول من عمده فروشی هست یا خیر"))
    photos = TextInputListField(
        child=serializers.IntegerField(),
        # required=False,
        help_text=_("ارسال عکس به صورت لیستی")
    )
    sku = serializers.CharField()

