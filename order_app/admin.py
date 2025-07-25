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
    pass


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    pass


@admin.register(ShippingCompany)
class ShippingCompanyAdmin(admin.ModelAdmin):
    pass


@admin.register(ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    pass


@admin.register(PaymentGateWay)
class PaymentGateWayAdmin(admin.ModelAdmin):
    pass


@admin.register(VerifyPaymentGateWay)
class ResultPaymentGateWayAdmin(admin.ModelAdmin):
    pass
