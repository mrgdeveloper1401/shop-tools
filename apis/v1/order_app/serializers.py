from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from account_app.models import Profile, UserAddress
from account_app.validators import MobileRegexValidator
from core.utils.gate_way import request_gate_way
from discount_app.models import ProductDiscount
from order_app.models import Order, OrderItem, ShippingMethod, ShippingCompany, PaymentGateWay
from order_app.tasks import create_gateway_payment
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


class SimpleProfileOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            "first_name",
            "last_name",
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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['profile'] = SimpleProfileOrderSerializer(instance.profile, read_only=True).data
        return data


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
    variant_name = serializers.CharField(source="product_variant.name")
    product_name = serializers.CharField(source="product_variant.product.product_name")
    calc_price_quantity = serializers.SerializerMethodField()

    def get_calc_price_quantity(self, obj):
        return obj.price * obj.quantity

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
    coupon_code = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    payment_gateway = serializers.JSONField(read_only=True)

    mobile_phone = serializers.CharField(
        required=False,
        validators=(MobileRegexValidator,)
    )
    def validate(self, data):
        coupon_code = data.get("coupon_code", None)

        # check variant dose exits
        variant_ids = [item['product_variant_id'] for item in data['items']]

        # filter variants
        existing_variants = ProductVariant.objects.filter(id__in=variant_ids).only("id")

        # validate variants dose exits
        if len(existing_variants) != len(variant_ids):
            existing_ids = set(existing_variants.values_list('id', flat=True))
            missing_ids = set(variant_ids) - existing_ids
            raise serializers.ValidationError(
                f"Product variants with ids {missing_ids} do not exist"
            )

        if coupon_code:
            res = Order.is_valid_coupon(code=coupon_code)
            if not res:
                raise serializers.ValidationError(
                    {
                        "message": _("coupon code is invalid")
                    },
                )
            data['valid_coupon'] = res
        # data['existing_variants'] = existing_variants
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
        order = Order.objects.create(profile_id=profile.id, address_id=address_id, shipping=shipping)

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

        # get coupon in validated data
        coupon = validated_data.get("valid_coupon")

        # validate stock number
        variant_ids = [item['product_variant_id'] for item in validated_data['items']]
        validate_product_variant = ProductVariant.objects.filter(
            id__in=variant_ids,
            stock_number__gt=0
        ).only("id")
        if not validate_product_variant.exists():
            raise serializers.ValidationError(
                {
                    "message": _("product variant not available")
                }
            )

        # ورینت های معتبر
        variants = [i for i in validated_data['items']]
        # محاسبه قیمت نهایی
        calc_total_price = order.total_price(
            coupon_code=coupon,
            variants=variants
        )

        if calc_total_price == 0: # check final price is zero
            order.status = 'paid'
            order.is_complete = True
            order.save()
            json_data = {"message": "success", "result": 100}
            create_gateway_payment.delay(
                order_id=order.id,
                json_data=json_data
            )
            json_data['items'] = items
            json_data['shipping'] = shipping
            json_data['address_id'] = address_id
            return json_data
        else:
            payment_gateway = request_gate_way(
                amount=calc_total_price,
                description=validated_data.get("description", None),
                order_id=order.id,
                mobile=validated_data.get("mobile_phone", None)
            )
            create_gateway_payment.delay(order.id, payment_gateway)
        return {
            "items": items,
            "shipping": shipping,
            "address_id": address_id,
            "payment_gateway": payment_gateway,
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
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['company'] = SimpleUserShippingCompanySerializer(instance.company, read_only=True).data
        return data


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


class NestedOrderProfileUserSerializer(serializers.ModelSerializer):
    user_phone = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    # user_order_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = (
            "id",
            "first_name",
            "last_name",
            "user_phone",
            "created_at",
            "user_email",
            # "user_order_count",
        )

    # def get_user_order_count(self, obj):
    #     return obj.orders.count()

    def get_user_phone(self, obj):
        return obj.user.mobile_phone

    def get_user_email(self, obj):
        return obj.user.email


class ResultOrderCityStateNameSerializer(serializers.ModelSerializer):
    state_name = serializers.CharField(source="state.state_name")
    city = serializers.CharField(source="city.name")

    class Meta:
        model = UserAddress
        fields = (
            "id",
            "city",
            "state_name"
        )


class ResultOrderPaymentGatewaySerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentGateWay
        fields = (
            "payment_gateway",
        )


class ResultOrderSerializer(serializers.ModelSerializer):
    profile = NestedOrderProfileUserSerializer()
    address = ResultOrderCityStateNameSerializer()
    user_order_count = serializers.SerializerMethodField()
    payment_gateways = ResultOrderPaymentGatewaySerializer(many=True)
    # total_price = serializers.SerializerMethodField()

    @extend_schema_field(serializers.IntegerField())
    def get_user_order_count(self, obj):
        return obj.user_order_count

    # @extend_schema_field(serializers.DecimalField(decimal_places=3, max_digits=12))
    # def get_total_price(self, obj):
    #     return obj.total_price

    class Meta:
        model = Order
        fields = (
            "id",
            "profile",
            "address",
            "user_order_count",
            "is_complete",
            "shipping_id",
            "created_at",
            "updated_at",
            "status",
            "payment_gateways"
            # "total_price"
        )


# class AnalyticSaleSerializer(serializers.Serializer):
#     date = serializers.DateTimeField(source='date_group', required=False)
#     week = serializers.DateTimeField(source='week_group', required=False)
#     month = serializers.DateTimeField(source='month_group', required=False)
#     total_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
#     order_count = serializers.IntegerField()


class AnalyticSaleRangeSerializer(serializers.ModelSerializer):
    # order_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ("created_at", )

    # def get_order_count(self, obj):
    #     return obj.order_count
