from django.contrib import admin

from .models import (
    Order,
    OrderItem,
    ShippingCompany,
    ShippingMethod,
    PaymentGateWay,
    VerifyPaymentGateWay
)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "status",
        "profile_id",
        "is_complete",
        "address_id",
        "tracking_code",
        "created_at",
        "updated_at"
    )
    list_filter = ("is_complete",)
    


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order_id",
        "product_variant_id",
        "price",
        "quantity",
        "is_active",
        "created_at",
        "updated_at"
    )
    list_filter = ("is_active",)


@admin.register(ShippingCompany)
class ShippingCompanyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "is_active",
        "created_at"
    )
    list_filter = ("is_active",)


@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    list_display = (
        "company_id",
        "name",
        "shipping_type",
        "price",
        "estimated_days",
        "is_active"
    )
    list_filter = ("is_active",)


@admin.register(PaymentGateWay)
class PaymentGateWayAdmin(admin.ModelAdmin):
    list_display = (
        "order",
        "id",
        "created_at"    )


@admin.register(VerifyPaymentGateWay)
class ResultPaymentGateWayAdmin(admin.ModelAdmin):
    list_display = (
        "payment_gateway_id",
        "id",
        "created_at"    
        )
