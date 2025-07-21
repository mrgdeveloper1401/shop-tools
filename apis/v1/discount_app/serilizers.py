from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from discount_app.models import Coupon, ProductDiscount
from product_app.models import ProductVariant


class AdminCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        exclude = (
            "deleted_at",
            "is_deleted"
        )


class AdminDiscountSerializer(serializers.ModelSerializer):
    product_variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.only('id'),
    )
    is_valid_discount = serializers.SerializerMethodField()

    class Meta:
        model = ProductDiscount
        exclude = (
            "deleted_at",
            "is_deleted"
        )

    @extend_schema_field(serializers.BooleanField())
    def get_is_valid_discount(self, obj):
        return obj.is_valid_discount
