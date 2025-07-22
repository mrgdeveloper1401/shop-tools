import uuid

from django.core.validators import MinValueValidator
from django.db import models
from django.utils.functional import cached_property
from django.utils import timezone

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin


# Create your models here.
class Order(CreateMixin, UpdateMixin, SoftDeleteMixin):
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

    @cached_property
    def calc_price_quantity(self):
        return self.price * self.quantity

    class Meta:
        ordering = ("-id",)
        db_table = "order_item"
