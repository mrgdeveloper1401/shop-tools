from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils import timezone
from django.utils.functional import cached_property

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin
from . import managers
from product_app.models import ProductVariant, Product


class CouponEnums(models.TextChoices):
    percent = "percent"
    amount = "amount"


class Coupon(CreateMixin, UpdateMixin, SoftDeleteMixin):
    code = models.CharField(
        max_length=255,
        unique=True
    )

    # number_of_days = models.PositiveIntegerField()
    maximum_use = models.PositiveIntegerField(default=1)
    number_of_uses = models.PositiveIntegerField(default=1)
    for_first = models.BooleanField(default=False)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    coupon_type = models.CharField(
        choices=CouponEnums.choices,
        default=CouponEnums.percent,
        max_length=7,
    )
    amount = models.CharField(
        max_length=15
    )
    is_active = models.BooleanField(default=True)

    # objects = models.Manager()
    # valid_coupon = managers.ValidCouponManager()

    class Meta:
        ordering = ("-id",)
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
        max_length=7
    )
    amount = models.CharField(max_length=15)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "discount_content_type"


class ProductDiscount(CreateMixin, UpdateMixin):
    product_variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.DO_NOTHING,
        related_name="product_variant_discounts",
        null=True
    )
    # product = models.ForeignKey(
    #     Product,
    #     on_delete=models.PROTECT,
    #     related_name="product_discounts",
    #     blank=True,
    #     null=True,
    # )
    discount_type = models.CharField(
        choices=CouponEnums.choices,
        default=CouponEnums.percent,
        max_length=7
    )
    amount = models.CharField(max_length=15)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    @cached_property
    def is_valid_discount(self):
        if self.product_variant_id:
            if self.is_active and (self.start_date <= timezone.now() <= self.end_date):
                return True
            return False

    objects = managers.ProductDiscountManager()
    # valid_discount = ProductDiscountManager()

    class Meta:
        ordering = ('-id',)
        db_table = "product_discount"
