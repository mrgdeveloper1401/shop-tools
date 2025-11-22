from django.contrib import admin
from django.db.models import JSONField
from django_json_widget.widgets import JSONEditorWidget
from daterangefilter.filters import DateRangeFilter
from django.utils.translation import gettext_lazy as _
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
    list_max_show_all = 20
    list_display = (
        "id",
        "status",
        "is_reserved",
        "profile_id",
        "is_complete",
        "address_id",
        "tracking_code",
        "created_at",
        "updated_at"
    )
    search_fields = ("profile__user__mobile_phone",)
    search_help_text = _("برای جست و جو میتوانید از شماره موبایل پروفایل کاربر استفاده کنید")
    list_filter = (
        "is_complete",
        "is_reserved",
        "status",
        ("created_at", DateRangeFilter)
        )
    formfield_overrides = {
        JSONField: {'widget': JSONEditorWidget},
    }
    list_display_links = ("id", "status")

    def get_queryset(self, request):
        qs = super().get_queryset(request).select_related("profile__user")
        if "changelist" in request.resolver_match.url_name:
            return qs.only(
                "status",
                "is_reserved",
                "is_complete",
                "address_id",
                "tracking_code",
                "created_at",
                "updated_at",
                "profile__user__mobile_phone",
            )
        else:
            return qs.only(
                "status",
                "is_reserved",
                "is_complete",
                "address_id",
                "tracking_code",
                "created_at",
                "updated_at",
                "profile__user__mobile_phone",
                # in detail
                "shipping_id",
                "first_name",
                "last_name",
                "phone",
                "payment_date",
                "reserved_until",
                "is_active",
                "items_data",
                "description"
            )

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
