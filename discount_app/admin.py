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
    pass
