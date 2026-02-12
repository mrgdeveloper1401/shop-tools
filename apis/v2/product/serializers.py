from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from discount_app.models import ProductDiscount
from product_app.models import Product, ProductVariant, ProductImages


class ProductImageSerializer(serializers.ModelSerializer):
    get_image_url = serializers.SerializerMethodField(method_name="get_image")
    image_id_ba_salam = serializers.IntegerField(source="image.image_id_ba_salam")

    @extend_schema_field(serializers.URLField())
    def get_image(self, obj):
        return obj.image.get_image_url

    class Meta:
        model = ProductImages
        fields = (
            "alt_text_image",
            "order",
            "get_image_url",
            'image_id_ba_salam'
        )

class NestedProductImageSerializer(serializers.ModelSerializer):
    image = ProductImageSerializer(many=True, source="product_product_image")

    class Meta:
        model = Product
        fields = ("image",)


class NestedProductVariantDiscount(serializers.ModelSerializer):
    class Meta:
        model = ProductDiscount
        fields = ("amount", "discount_type")


class ProductListHomePageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="product.id")
    category_id = serializers.IntegerField(source="product.category_id", allow_null=True)
    product_product_image = NestedProductImageSerializer(source="product", allow_null=True)
    product_name = serializers.CharField(source="product.product_name", allow_null=True)
    variant_id = serializers.IntegerField(source="id")
    product_variant_discounts = serializers.SerializerMethodField(source="product_variant_discounts", allow_null=True)
    product_slug = serializers.CharField(source="product.product_slug")
    description_slug = serializers.CharField(source="product.description_slug")
    brand_id = serializers.IntegerField(source="product.product_brand_id", allow_null=True)
    base_price = serializers.IntegerField(source="product.base_price", allow_null=True)
    sku = serializers.CharField(source="product.sku")
    product_brand_name = serializers.CharField(source="product.product_brand.brand_name")
    in_person_purchase = serializers.BooleanField(source="product.in_person_purchase")

    def get_product_variant_discounts(self, obj):
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
            "id",
            "category_id",
            "product_product_image",
            "variant_id",
            "brand_id",
            "product_name",
            "price",
            "name",
            "is_available",
            "stock_number",
            "product_slug",
            "description_slug",
            "created_at",
            "updated_at",
            "base_price",
            "sku",
            "product_brand_name",
            "in_person_purchase",
            "product_variant_discounts"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['product_product_image'] = data['product_product_image']
        return data
