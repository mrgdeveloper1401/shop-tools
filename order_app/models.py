from django.db import models

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin


# Create your models here.
class Order(CreateMixin, UpdateMixin, SoftDeleteMixin):
    user = models.ForeignKey(
        "account_app.User",
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
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ("-id",)
        db_table = "order_item"
