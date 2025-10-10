from rest_framework import serializers, exceptions
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MinLengthValidator
from core.utils.ba_salam import upload_image_file, upload_file
from core.utils.browsable_api_custom import TextInputListField
from core.utils.enums import FileTypeChoices
from core_app.models import Image, UploadFile
from product_app.models import Product, ProductImages, ProductVariant, ProductAttributeValues


class ImageUploadSerializer(serializers.ModelSerializer):
    # file_type = serializers.ChoiceField(
    #     choices=[(tag.value, tag.name) for tag in ImageTypeChoices],
    #     required=False,
    # )
    class Meta:
        model = Image
        fields = ("image", "image_id_ba_salam", 'wp_image_url', "created_at")

        extra_kwargs = {
            "wp_image_url": {'required': False},
        }

    # async def create(self, validated_data):
    #     image = validated_data['image']
    #     async_upload = sync_to_async(image)
    #     res = await async_upload(image)
    #     return Image.objects.acreate(
    #         image=image,
    #         image_id_ba_salam=res.get("id")
    #     )

    def validate(self, data):
        image = data.get("image", None)
        if image is None:
            raise exceptions.ValidationError(
                {
                    "message": _("image is required"),
                }
            )
        return data

    def create(self, validated_data):
        image = validated_data.get("image", None)
        # file_type = validated_data.pop("file_type")
        res = upload_image_file(image, "product.photo")
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
    preparation_days = serializers.IntegerField(
        help_text=_("مدت زمان اماده سازی"),
    )
    weight = serializers.IntegerField(
        help_text=_("وزن محصول"),
    )
    package_weight = serializers.IntegerField(
        help_text=_("وزن محصول با بسته بندی محصول"),
    )
    primary_price = serializers.IntegerField()
    stock = serializers.IntegerField(help_text=_("موجودی محصول"), default=10)
    description = serializers.CharField(help_text=_("توضحی در مورد محصول"))
    is_wholesale = serializers.BooleanField(
        default=False,
        help_text=_("محصول من عمده فروشی هست یا خیر"),
        required=False
    )
    photos = serializers.ListSerializer(
        child=serializers.IntegerField(),
        required=False,
        help_text=_("برای ارسال عکس های اضافی")
    )
    photo = serializers.IntegerField(
        help_text=_("ارسال عکس به صورت لیستی")
    )
    sku = serializers.CharField()


class UpdateProductSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    category_id = serializers.IntegerField(required=False)
    primary_price = serializers.IntegerField(required=False)
    stock = serializers.IntegerField(required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    photo = serializers.IntegerField(required=False)
    sku = serializers.CharField(required=False)
    preparation_days = serializers.IntegerField(required=False)
    weight = serializers.IntegerField(required=False)
    package_weight = serializers.IntegerField(required=False)
    status = serializers.IntegerField(required=False)


class CreateProductTorob(serializers.Serializer):
    pass


class TorobProductImageSerializer(serializers.ModelSerializer):
    image = serializers.CharField(source="image.image")

    class Meta:
        model = ProductImages
        fields = ('image',)


class TorobProductAttributeValue(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source="attribute.attribute_name")

    class Meta:
        model = ProductAttributeValues
        fields = (
            "attribute_name",
            "value"
        )


class TrobSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="name")
    availability = serializers.BooleanField(source="is_active")
    category_name = serializers.CharField(source="product.category.category_name", required=False)
    image_links = serializers.SerializerMethodField()
    date_added = serializers.CharField(source="created_at")
    date_updated = serializers.CharField(source="updated_at")
    current_price = serializers.IntegerField(source="price")
    guarantee = serializers.CharField(default=None)
    page_url = serializers.SerializerMethodField()
    page_unique = serializers.CharField(source="id")
    spec = serializers.SerializerMethodField()

    class Meta:
        model = ProductVariant
        fields = (
            "page_unique",
            "page_url",
            "title",
            "availability",
            "category_name",
            "image_links",
            "date_added",
            "date_updated",
            "current_price",
            "subtitle",
            "old_price",
            "short_desc",
            "guarantee",
            "spec"
        )

    def get_image_links(self, obj):
        return [
            str(product_image.image.image.url)
            for product_image in obj.product.product_product_image.all()
        ]

    def get_page_url(self, obj):
        product_category_id = obj.product.category_id
        product_id = obj.product_id
        product_slug = obj.product.product_slug
        product_variant_id = obj.id
        # base_url = "http://localhost:8000" if settings.DEBUG else "https://gs-tools.ir"
        base_url = "https://gs-tools.ir"
        page_url = f"{base_url}/product/{product_id}/{product_category_id}/{product_slug}"
        return page_url

    def get_spec(self, obj):
        attributes = obj.product.attributes.all()
        spec_dict = {}
        
        for attr in attributes:
            # استفاده از slugify برای ایجاد کلیدهای استاندارد
            key = slugify(attr.attribute.attribute_name, allow_unicode=True)
            spec_dict[key] = attr.value

        return spec_dict


class PostRequestTorobSerializer(serializers.Serializer):
    page_urls = serializers.ListField(child=serializers.CharField(), required=False, validators=(MinLengthValidator(1),))
    page_uniques = serializers.ListField(child=serializers.CharField(), required=False, validators=(MinLengthValidator(1),))
    page = serializers.IntegerField(required=False)
    sort = serializers.CharField(required=False, help_text=_("date_added_desc, date_updated_desc"))

    def validate(self, data):
        # import ipdb
        # ipdb.set_trace()
        page = data.get('page', None)
        sort = data.get("sort", None)
        page_urls = data.get("page_urls", None)
        page_uniques = data.get("page_uniques", None)

        if page and sort is None:
            raise serializers.ValidationError({"error": "sort parameter is not provided"})

        if sort and page is None:
            raise serializers.ValidationError({"error": "page parametrs is not provided"})

        if page is None and sort is None and page_uniques is None and page_urls is None:
            raise serializers.ValidationError({"error": "request body is required"})

        return data
