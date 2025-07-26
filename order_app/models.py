import uuid
from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import F
from django.utils.functional import cached_property
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin
from discount_app.models import Coupon
from order_app.tasks import send_notification_order_complete


# Create your models here.
class Order(CreateMixin, UpdateMixin, SoftDeleteMixin):
    STATUS_CHOICES = [
        ('pending', 'در انتظار پرداخت'),
        ('paid', 'پرداخت شده'),
        ('processing', 'در حال پردازش'),
        ('shipped', 'ارسال شده'),
        ('delivered', 'تحویل داده شده'),
        ('cancelled', 'لغو شده'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    profile = models.ForeignKey(
        "account_app.Profile",
        on_delete=models.PROTECT,
        related_name="orders",
    )
    is_complete = models.BooleanField(default=False)
    address = models.ForeignKey(
        "account_app.UserAddress",
        related_name="order_address",
        on_delete=models.PROTECT,
        blank=True,
        null=True
    )
    tracking_code = models.CharField(max_length=50, unique=True, null=True, blank=True)
    payment_date = models.DateTimeField(null=True, blank=True)
    shipping = models.ForeignKey(
        "ShippingMethod",
        on_delete=models.PROTECT,
        related_name="order_shipping_methods",
        blank=True, # TODO, when clean migration we remove field blank and null
        null=True
    )
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.tracking_code:
            uid = uuid.uuid4().hex[:10]
            self.tracking_code = f"gs-{str(timezone.now().date())}-{uid}"
        if self.is_complete:
            send_notification_order_complete.delay()
        super().save(*args, **kwargs)

    @property
    def sub_total(self):
        total = sum(
            item.calc_price_quantity for item in self.order_items.filter(is_active=True).only(
                "order_id", "price", "quantity"
            )
        )
        return total

    @property
    def shipping_cost(self):
        return self.shipping.price if self.shipping else None

    # @property
    # def tax_amount(self):
    #     amount = (self.sub_total * Decimal("0.09")) + self.sub_total + self.shipping_cost
    #     return amount

    @classmethod
    def is_valid_coupon(self, code):
        coupon = Coupon.objects.filter(
            is_active=True,
            valid_from__lte=timezone.now(),
            valid_to__gte=timezone.now(),
            number_of_uses__lt=F("maximum_use"),
            code=code
        ).only("id", "amount", "coupon_type")

        if not coupon:
            return False
        return coupon

    # @property
    # def calc_price_coupon(self, valid_coupon, price):
    #     get_valid_coupon = valid_coupon[0]
    #     coupon_price = 0
    #     if get_valid_coupon.coupon_type == "percent":
    #         coupon_price = price - (price * get_valid_coupon.amount / 100)
    #     else:
    #         coupon_price = price - get_valid_coupon.amount
    #     return coupon_price

    def total_price(self, valid_coupon=None, product_discounts=None):
        final_price_sub_total =  self.sub_total
        final_price_sub_total = int(final_price_sub_total) # convert decimal to int
        if valid_coupon:
            get_valid_coupon = valid_coupon[0]
            if get_valid_coupon.coupon_type == "percent":
                final_price_sub_total = final_price_sub_total - (final_price_sub_total * int(get_valid_coupon.amount) / 100)
            else:
                final_price_sub_total = final_price_sub_total - int(get_valid_coupon.amount)
            get_valid_coupon.number_of_uses += 1
            get_valid_coupon.save()

        # check product variant coupon
        if product_discounts:
            for i in product_discounts:
                if i.discount_type == "percent":
                    final_price_sub_total = final_price_sub_total - (final_price_sub_total * int(i.amount) / 100)
                else:
                    final_price_sub_total = final_price_sub_total - int(i.amount)
        final_price = final_price_sub_total + int(self.shipping_cost)
        return final_price

    class Meta:
        ordering = ("-id",)
        db_table = "order"


class OrderItem(CreateMixin, UpdateMixin, SoftDeleteMixin):
    order = models.ForeignKey(
        "Order",
        on_delete=models.PROTECT,
        related_name="order_items",
    )
    product_variant = models.ForeignKey(
        "product_app.ProductVariant",
        on_delete=models.PROTECT,
        related_name="product_variant_order_items",
    )
    price = models.DecimalField(max_digits=12, decimal_places=3)
    quantity = models.PositiveIntegerField(
        default=1,
        validators=(MinValueValidator(1),),
    )
    is_active = models.BooleanField(default=True)

    @cached_property
    def calc_price_quantity(self):
        return self.price * self.quantity

    class Meta:
        ordering = ("-id",)
        db_table = "order_item"


class ShippingCompany(CreateMixin, UpdateMixin, SoftDeleteMixin):
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("-id",)
        db_table = "shipping_company"


class ShippingMethod(CreateMixin, UpdateMixin, SoftDeleteMixin):
    class ShippingType(models.TextChoices):
        STANDARD = "standard", _("پست معمولی")
        EXPRESS = "express", _("پست پیشتاز")
        FREE = "free", _("ارسال رایگان")

    company = models.ForeignKey(
        ShippingCompany,
        on_delete=models.CASCADE,
        related_name="methods",
        verbose_name=_("شرکت ارسال‌کننده")
    )
    name = models.CharField(_("نام روش ارسال"), max_length=100)
    shipping_type = models.CharField(
        _("نوع ارسال"),
        max_length=20,
        choices=ShippingType.choices,
        default=ShippingType.STANDARD
    )
    price = models.DecimalField(
        _("هزینه ارسال"),
        max_digits=10,
        decimal_places=2
    )
    estimated_days = models.PositiveIntegerField(_("تعداد روزهای تخمینی تحویل"))
    is_active = models.BooleanField(_("فعال"), default=True)

    class Meta:
        db_table = "shipping_method"
        ordering = ("-id",)


class PaymentGateWay(CreateMixin, SoftDeleteMixin):
    order = models.ForeignKey(
        Order,
        on_delete=models.PROTECT,
        related_name="payment_gateways",
    )
    payment_gateway = models.JSONField()

    class Meta:
        db_table = "payment_gateway"


class VerifyPaymentGateWay(CreateMixin, UpdateMixin, SoftDeleteMixin):
    payment_gateway = models.ForeignKey(
        PaymentGateWay,
        on_delete=models.PROTECT,
        related_name="result_payment_gateways",
    )
    result = models.JSONField()

    class Meta:
        db_table = "result_payment_gateway"
