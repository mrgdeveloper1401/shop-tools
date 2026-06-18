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
            "get_image_url",
            'image_id_ba_salam',
            "order",
            "alt_text_image",
            "updated_at"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return {
            "image": {
                "get_image_url": data.get("get_image_url"),
                "image_id_ba_salam": data.get("get_image_id_ba_salam"),
            },
            "order": data.get("order"),
            "alt_text_image": data.get("alt_text_image"),
            "updated_at": data.get("updated_at"),
        }


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
    id = serializers.IntegerField(source="product_id")
    category_id = serializers.IntegerField(source="product.category_id", allow_null=True)
    product_product_image = NestedProductImageSerializer(source="product", allow_null=True)
    product_name = serializers.CharField(source="product.product_name", allow_null=True)
    variant_id = serializers.IntegerField(source="id")
    product_variant_discounts = serializers.SerializerMethodField(source="product_variant_discounts", allow_null=True)
    product_slug = serializers.CharField(source="product.product_slug")
    description_slug = serializers.CharField(source="product.description_slug")
    brand_id = serializers.IntegerField(source="product.product_brand_id", allow_null=True)
    base_price = serializers.IntegerField(source="price", allow_null=True)
    product_brand_name = serializers.CharField(source="product.product_brand.brand_name")
    in_person_purchase = serializers.BooleanField()
    stock = serializers.IntegerField(source="stock_number")

    def get_product_variant_discounts(self, obj):
        if hasattr(obj, "discounts") and obj.discounts:
            discount = obj.discounts[-1]
            return {
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
            "stock",
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
        data['product_product_image'] = data['product_product_image']['image']
        variant_id = data.pop("variant_id", None)
        price =data.pop("price", None)
        product_variant_discounts = data.pop("product_variant_discounts", None)
        is_available = data.pop("is_available", None)
        stock_number = data.pop("stock", None)
        name = data.pop("name", None)
        data['variants'] = [
            {
                "id": variant_id,
                "price": price,
                "variant_id": variant_id,
                "product_variant_discounts": product_variant_discounts,
                "is_available": is_available,
                "stock_number": stock_number,
                "name": name,
            }
        ]
        return data
