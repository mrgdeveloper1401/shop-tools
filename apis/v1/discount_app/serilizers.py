from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from discount_app.models import Coupon, ProductDiscount
from product_app.models import ProductVariant, Product


class AdminCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        exclude = (
            "deleted_at",
            "is_deleted"
        )


class AdminDiscountSerializer(serializers.ModelSerializer):
    product_variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.only('id')
    )
    is_valid_discount = serializers.SerializerMethodField()
    # product = serializers.PrimaryKeyRelatedField(
    #     queryset=Product.objects.only('id'),
    #     required=False
    # )

    class Meta:
        model = ProductDiscount
        fields = "__all__"

    @extend_schema_field(serializers.BooleanField())
    def get_is_valid_discount(self, obj):
        return obj.is_valid_discount

    def validate(self, attrs):
        product_variant = attrs.get('product_variant')
        product = attrs.get("product")
        # product_pk = self.context.get('product_pk')
        # product_variant_pk = self.context.get('product_variant_pk')

        if product and product_variant:
            raise serializers.ValidationError(
                {
                    "message": _("you can only set discount in product or product_variant")
                }
            )
        if product and self.instance is None and ProductDiscount.objects.filter(product_id=product).only("id").valid_discount():
           raise serializers.ValidationError(
               {
                   "message": _(f"product id:{product} have valid discount")
               }
           )
        if product_variant and self.instance is None and ProductDiscount.objects.filter(product_variant_id=product_variant).only("id").valid_discount():
            raise serializers.ValidationError(
                {
                    "message": _(f"product_variant_id:{product_variant} have valid discount")
                }
            )
        return attrs
