from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin
from product_app.models import Product


class CouponEnums(models.TextChoices):
    percent = "percent"
    amount = "amount"


class Coupon(CreateMixin, UpdateMixin, SoftDeleteMixin):
    code = models.CharField(
        max_length=255,
        unique=True
    )
    number_of_days = models.PositiveIntegerField()
    for_first = models.BooleanField(default=False)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    coupon_type = models.CharField(
        choices=CouponEnums.choices,
        default=CouponEnums.percent,
    )
    amount = models.CharField(
        max_length=15
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "coupon"



class Discount(CreateMixin, UpdateMixin, SoftDeleteMixin):
    # Generic relation
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey('content_type', 'object_id')

    name = models.CharField(max_length=100)
    discount_type = models.CharField(
        choices=CouponEnums.choices,
        default=CouponEnums.percent,
    )
    amount = models.CharField(max_length=15)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "discount_content_type"


class ProductDiscount(CreateMixin, UpdateMixin, SoftDeleteMixin):
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING, related_name="discounts")
    discount_type = models.CharField(
        choices=CouponEnums.choices,
        default=CouponEnums.percent,
    )
    amount = models.CharField(max_length=15)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "product_discount"
