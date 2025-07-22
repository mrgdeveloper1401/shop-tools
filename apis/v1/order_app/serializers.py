from rest_framework import serializers

from account_app.models import Profile, UserAddress
from order_app.models import Order, OrderItem, ShippingMethod, ShippingCompany
from product_app.models import ProductVariant


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "id",
            "is_complete",
            "created_at",
            "tracking_code",
            "payment_date",
            "address_id",
            "status"
        )
        read_only_fields = ("is_complete", "tracking_code", "address_id")

    def create(self, validated_data):
        # get user id by context request
        user_id = self.context["request"].user.id

        # get profile
        profile_id = Profile.objects.filter(user_id=user_id).only("id").first()

        # create order
        return Order.objects.create(
            profile_id=profile_id,
            **validated_data
        )


class AdminOrderSerializer(serializers.ModelSerializer):
    profile = serializers.PrimaryKeyRelatedField(
        queryset=Profile.objects.only("id",),
    )
    address = serializers.PrimaryKeyRelatedField(
        queryset=UserAddress.objects.only("id",),
    )
    shipping = serializers.PrimaryKeyRelatedField(
        queryset=ShippingMethod.objects.only("id",),
    )

    class Meta:
        model = Order
        exclude = (
            "is_deleted",
            "deleted_at",
        )


class OrderItemSerializer(serializers.ModelSerializer):
    category_id = serializers.IntegerField(source="product_variant.product.category_id")
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
            "calc_price_quantity",
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


class NestedCartItemSerializer(serializers.Serializer):
    product_variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CreateOrderSerializer(serializers.Serializer):
    items = NestedCartItemSerializer(many=True)
    address_id = serializers.IntegerField()
    shipping = serializers.PrimaryKeyRelatedField(
        queryset=ShippingMethod.objects.only("id",),
    )

    def validate(self, data):
        # check variant dose exits
        variant_ids = [item['product_variant_id'] for item in data['items']]
        existing_variants = ProductVariant.objects.filter(id__in=variant_ids).only("id")

        if len(existing_variants) != len(variant_ids):
            existing_ids = set(existing_variants.values_list('id', flat=True))
            missing_ids = set(variant_ids) - existing_ids
            raise serializers.ValidationError(
                f"Product variants with ids {missing_ids} do not exist"
            )

        return data

    def create(self, validated_data):
        # create order
        profile = Profile.objects.filter(
            user_id=self.context["request"].user.id
        ).only("id").first()

        # get address id
        address_id = validated_data.pop("address_id", None)
        # get shipping
        shipping = validated_data.pop("shipping", None)
        # create order
        order = Order.objects.create(profile_id=profile.id, address_id=address_id, shipping_id=shipping)

        # create order item
        order_items = []
        for item in validated_data['items']:
            variant = ProductVariant.objects.filter(id=item['product_variant_id']).only('id', "price").first()
            order_items.append(
                OrderItem(
                    order_id=order.id,
                    product_variant_id=variant.id,
                    price=variant.price,
                    quantity=item['quantity']
                )
            )

        items = OrderItem.objects.bulk_create(order_items)
        return {
            "items": items,
        }


class AdminShippingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingCompany
        exclude = (
            "is_deleted",
            "deleted_at"
        )


class SimpleUserShippingCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingCompany
        fields = (
            "id",
            "name",
        )


class AdminShippingMethodSerializer(serializers.ModelSerializer):
    company = serializers.PrimaryKeyRelatedField(
        queryset=ShippingCompany.objects.only("id", "name")
    )

    class Meta:
        model = ShippingMethod
        exclude = (
            "is_deleted",
            "deleted_at"
        )

class UserShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = (
            "id",
            "company",
            "price",
            "estimated_days",
            "name",
            "price",
            "shipping_type"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['company'] = SimpleUserShippingCompanySerializer(instance.company).data
        return data
