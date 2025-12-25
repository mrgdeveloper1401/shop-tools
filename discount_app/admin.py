from django.contrib import admin

from .models import Coupon, Discount, ProductDiscount


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    pass


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    pass


class ProductDiscountSimpleFilter(admin.SimpleListFilter):
    title = "valid_discount"
    parameter_name = "is_valid_discount"

    def lookups(self, request, model_admin):
        return (
            ("valid", "valid"),
        )

    def queryset(self, request, queryset):
        qs = queryset
        if self.value() == "valid":
            return qs.valid_discount()
        else:
            return qs


@admin.register(ProductDiscount)
class ProductDiscountAdmin(admin.ModelAdmin):
    list_display = ("id", "product_variant_id", "get_variant_name", "discount_type", "product_variant__product_id", "is_valid_discount")
    raw_id_fields = ("product_variant",)
    search_fields = ("product_variant__name",)
    search_help_text = "برای جست و جو میتوانید از نام محصول استفاده کنید"
    list_per_page = 20
    list_filter = ("discount_type", ProductDiscountSimpleFilter)
    list_display_links = ("id", "product_variant_id")

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "product_variant"
        ).only(
            "product_variant__name",
            "product_variant__product_id",
            "discount_type",
            "amount",
            "start_date",
            "end_date",
            "is_active"
        )

    def get_variant_name(self, obj):
        return obj.product_variant.name
