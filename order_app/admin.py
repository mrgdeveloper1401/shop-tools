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
    ordering = ("-id",)
    list_per_page = 20
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
    raw_id_fields = ("profile", "address", "shipping")

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
    list_per_page = 20
    raw_id_fields = ("order", "product_variant")
    list_display_links = ("id", "order_id", "product_variant_id")
    search_fields = ("order__profile__user__mobile_phone",)
    search_help_text = _("برای جست و جو میتوانید از شماره موبایل پروفایل کاربر استفاده کنید")
    list_display = (
        "id",
        "order_id",
        "product_variant_id",
        "get_user_phone",
        "price",
        "quantity",
        "is_active",
        "created_at",
        "updated_at"
    )
    list_filter = ("is_active",)
    
    def get_user_phone(self, obj):
        return obj.order.profile.user.mobile_phone
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            return qs.select_related("order__profile__user").only(
                "product_variant_id",
                "order__profile__user__mobile_phone",
                "price",
                "quantity",
                "is_active",
                "created_at",
                "updated_at"
            )
        else:
            return qs.only(
                "order_id",
                "product_variant_id",
                "price",
                "quantity",
                "is_active",
                "created_at",
                "updated_at"
            )


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
    raw_id_fields = ("user", "order")
    list_display = (
        "order_id",
        "id",
        "user_id",
        "get_user_phone",
        "created_at",
        )
    formfield_overrides = {
        JSONField: {'widget': JSONEditorWidget},
    }
    search_fields = ("user__mobile_phone",)
    list_per_page = 20
    search_help_text = _("برای جست و جو میتوانید از شماره موبایل کاربر استفاده کنید")
    list_display_links = ("id", "user_id", "order_id")

    def get_user_phone(self, obj):
        return obj.user.mobile_phone

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
    list_display_links = ("payment_gateway_id", "id", "payment_gateway__user_id")
    raw_id_fields = ("payment_gateway",)
    list_display = (
        "payment_gateway_id",
        "payment_gateway__user_id",
        "payment_gateway__user__mobile_phone",
        "id",
        "created_at"    
        )
    formfield_overrides = {
        JSONField: {'widget': JSONEditorWidget},
    }
    search_fields = ("payment_gateway__user__mobile_phone",)
    search_help_text = _("برای سرچ میتوانید از شماره موبایل کاربر استفاد کنید")

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        if "changelist" in request.resolver_match.url_name:
            return qs.select_related("payment_gateway__user").only(
                "payment_gateway__user_id",
                "payment_gateway__user__mobile_phone",
                "created_at",
            )
        else:
            return qs.select_related("payment_gateway").only(
                "payment_gateway__user_id",
                "created_at",
                "result"
            )
