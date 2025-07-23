import uuid

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.functional import cached_property
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin


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
        super().save(*args, **kwargs)

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
