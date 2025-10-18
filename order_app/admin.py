from django.contrib import admin
from django.db.models import JSONField
from django_json_widget.widgets import JSONEditorWidget
from daterangefilter.filters import DateRangeFilter
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
    list_filter = (
        "is_complete",
        ("created_at", DateRangeFilter)
        )
    formfield_overrides = {
        JSONField: {'widget': JSONEditorWidget},
    }


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
        "id",
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
        "order_id",
        "id",
        "user_id",
        "user",
        "created_at",
        )
    formfield_overrides = {
        JSONField: {'widget': JSONEditorWidget},
    }
    search_fields = ("user__mobile_phone",)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("user").only(
            "order_id",
            "id",
            "user__mobile_phone",
            "created_at",
            "payment_gateway"
        )

@admin.register(VerifyPaymentGateWay)
class ResultPaymentGateWayAdmin(admin.ModelAdmin):
    list_display = (
        "payment_gateway_id",
        "id",
        "created_at"    
        )
    formfield_overrides = {
        JSONField: {'widget': JSONEditorWidget},
    }
