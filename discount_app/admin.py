from django.contrib import admin

from .models import Coupon, Discount, ProductDiscount


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    pass


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductDiscount)
class ProductDiscountAdmin(admin.ModelAdmin):
    list_display = ("id", "product_variant_id", "product_variant__product_id", "is_valid_discount")

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            "product_variant__product"
        ).only(
            "product_variant_id",
            "product_variant__product__is_active",
            "discount_type",
            "amount",
            "start_date",
            "end_date",
            "is_active"
        )
