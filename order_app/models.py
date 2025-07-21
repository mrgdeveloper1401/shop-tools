from django.core.validators import MinValueValidator
from django.db import models
from django.utils.functional import cached_property

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin


# Create your models here.
class Order(CreateMixin, UpdateMixin, SoftDeleteMixin):
    profile = models.ForeignKey(
        "account_app.Profile",
        on_delete=models.PROTECT,
        related_name="orders",
    )
    is_complete = models.BooleanField(default=False)

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
