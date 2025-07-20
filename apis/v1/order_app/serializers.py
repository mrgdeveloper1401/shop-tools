from rest_framework import serializers

from account_app.models import User
from order_app.models import Order, OrderItem
from product_app.models import ProductVariant


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "id",
            "is_complete",
            "created_at"
        )
        read_only_fields = ("is_complete",)

    def create(self, validated_data):
        user_id = self.context["request"].user.id
        return Order.objects.create(
            user_id=user_id,
            **validated_data
        )


class AdminOrderSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.only("mobile_phone",),
    )

    class Meta:
        model = Order
        exclude = (
            "is_deleted",
            "deleted_at",
        )


class OrderItemSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(source="product.category_id")
    product_id = serializers.IntegerField(source="product_variant.product_id")

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product_variant_id",
            "category_id",
            "product_id",
            "quantity",
            "price",
            "created_at"
        )


class AdminOrderItemSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.only("id")
    )
    product_variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.only("id")
    )

    class Meta:
        model = OrderItem
        exclude = (
            "is_deleted",
            "deleted_at",
        )
