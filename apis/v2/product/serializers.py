from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from discount_app.models import ProductDiscount
from product_app.models import Product, ProductVariant, ProductImages


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    @extend_schema_field(serializers.URLField())
    def get_image_url(self, obj):
        return obj.image.get_image_url

    class Meta:
        model = ProductImages
        fields = (
            "alt_text_image",
            "order",
            "image_url"
        )

class NestedProductImageSerializer(serializers.ModelSerializer):
    product_image = ProductImageSerializer(many=True, source="product_product_image")

    class Meta:
        model = Product
        fields = ("product_image",)


class NestedProductVariantDiscount(serializers.ModelSerializer):
    class Meta:
        model = ProductDiscount
        fields = ("amount", "discount_type")


class ProductListHomePageSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(source="product.category_id", allow_null=True)
    product_name = serializers.CharField(source="product.product_name", allow_null=True)
    images = NestedProductImageSerializer(source="product", allow_null=True)
    variant_id = serializers.IntegerField(source="id")
    variant_price = serializers.IntegerField(source="price")
    variant_name = serializers.CharField(source="name")
    variant_is_available = serializers.BooleanField(source="is_available")
    variant_stock_number = serializers.IntegerField(source="stock_number")
    discount = serializers.SerializerMethodField(source="product_variant_discounts", allow_null=True)
    product_slug = serializers.CharField(source="product.product_slug")
    description_slug = serializers.CharField(source="product.description_slug")

    def get_discount(self, obj):
        if hasattr(obj, "discounts") and obj.discounts:
            discount = obj.discounts[-1]
            return {
                "id": discount.id,
                "amount": discount.amount,
                "discount_type": discount.discount_type,
            }
        return None

    class Meta:
        model = ProductVariant
        fields = (
            "variant_id",
            "category_id",
            "product_name",
            "variant_price",
            "variant_name",
            "variant_is_available",
            "variant_stock_number",
            "product_slug",
            "description_slug",
            "created_at",
            "updated_at",
            "images",
            "discount"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['images'] = data['images']['product_image']
        return data
