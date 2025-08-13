from django.db.models.signals import post_save
from django.dispatch import receiver
from order_app.models import Order

@receiver(post_save, sender=Order)
def update_product_sales(sender, instance, created, **kwargs):
    if instance.is_complete:
        items = instance.order_items.filter(is_active=True)

        if items.exists():
            for item in items:
                qy = item.quantity
                item.product_variant.product.total_sale += qy
                item.product_variant.product.save()
