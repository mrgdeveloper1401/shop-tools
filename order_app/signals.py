from django.db.models.signals import post_save
from django.dispatch import receiver
from order_app.models import OrderItem

@receiver(post_save, sender=OrderItem)
def update_product_sales(sender, instance, created, **kwargs):
    if instance.order.is_complete:
        product = instance.product_variant.product
        product.total_sold += instance.quantity
        product.save()
