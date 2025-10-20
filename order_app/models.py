import uuid
from decimal import Decimal
from rest_framework.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import F
from django.utils.functional import cached_property
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin
from discount_app.models import Coupon, ProductDiscount
from order_app.tasks import send_notification_order_complete
from product_app.models import ProductVariant


# Create your models here.
class Order(CreateMixin, UpdateMixin, SoftDeleteMixin):
    reserved_until = models.DateTimeField(null=True, blank=True)
    first_name = models.CharField(_("نام سفارش دهنده"), blank=True)
    is_reserved = models.BooleanField(default=False)
    last_name = models.CharField(_("نام خوانوادگی سفارش دهنده"), blank=True)
    phone = models.CharField(_("شماره تماس سفارش دهنده"), max_length=15, blank=True)
    description = models.CharField(max_length=500, blank=True, null=True)
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
    items_data = models.JSONField(blank=True, null=True)

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
    def sub_total_without_quantity(self):
        total = sum(
            item.price for item in self.order_items.filter(is_active=True).only(
                "order_id", "price"
            )
        )
        return total

    @property
    def shipping_cost(self):
        return self.shipping.price if self.shipping else None

    def reserved_stock(self, duration=10):
        self.reserve_stock = timezone.now() + timezone.timedelta(minutes=duration)
        self.is_reserved = True
        self.save()

        order_items = self.order_items.filter(is_active=True)
        for item in order_items:
            variant = item.product_variant
            if variant.stock_number >= item.quantity:
                variant.stock_number -= item.quantity
                variant.save()
            else:
                raise ValidationError(f"amount not enoght for {variant.name}")

    def release_stock(self, save=False):
        if self.is_reserved and self.status != 'paid':
            order_items = self.order_items.filter(is_active=True)
            for item in order_items:
                variant = item.product_variant
                variant.stock_number += item.quantity
                variant.save()
            
            # self.is_reserved = False
            # self.reserved_until = None
            # self.save()
        if save:
            self.save()

    def is_reservation_valid(self):
        return self.is_reserved and self.reserved_until and timezone.now() < self.reserved_until

    @classmethod
    def is_valid_coupon(self, code):
        coupon = Coupon.objects.filter(
            is_active=True,
            valid_from__lte=timezone.now(),
            valid_to__gte=timezone.now(),
            number_of_uses__lt=F("maximum_use"),
            code=code
        ).only("amount", "coupon_type")

        if not coupon:
            return False
        return coupon

    @cached_property
    def calc_price_preposition_wight(self):
        amount = 20_000
        return amount

    def total_price(self, variants, coupon_code=None):
        final_price = Decimal(0)
        for i in variants:
            have_discount = ProductDiscount.objects.filter(product_variant_id=i['product_variant_id']).valid_discount().only("id")
            get_price = ProductVariant.objects.filter(id=i['product_variant_id']).only("price")[0].price
            if have_discount:
                final_price += self._apply_product_discounts(get_price, have_discount)
                final_price *= i['quantity']
            else:
                final_price += i['quantity'] * get_price
        if coupon_code:
            final_price = self._apply_coupon_discount(final_price, coupon_code)

        final_price += self.shipping_cost
        final_price += self.calc_price_preposition_wight
        return final_price

    def _apply_product_discounts(self, amount, product_discounts):
        """اعمال تخفیف‌های محصول بر روی مبلغ"""
        discounted_amount = amount
        for discount in product_discounts:
            if discount.discount_type == "percent":
                discounted_amount -= (discounted_amount * int(discount.amount) / 100)
            else:
                discounted_amount -= int(discount.amount)
        return max(discounted_amount, 0)  # اطمینان از عدم منفی شدن مبلغ

    def _apply_coupon_discount(self, amount, valid_coupon):
        """اعمال کوپن تخفیف بر روی مبلغ"""
        coupon = valid_coupon[0]  # چون کوپن از قبل اعتبارسنجی شده
        if coupon.coupon_type == "percent":
            discounted_amount = amount - (amount * int(coupon.amount) / 100)
        else:
            discounted_amount = amount - int(coupon.amount)

        # افزایش تعداد استفاده از کوپن
        coupon.number_of_uses += 1
        coupon.save()

        return max(discounted_amount, 0)  # اطمینان از عدم منفی شد


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
    user = models.ForeignKey("account_app.User", on_delete=models.PROTECT, related_name="gateways", blank=True, null=True)
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
