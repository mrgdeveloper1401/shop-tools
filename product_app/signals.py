from django.db.models.signals import post_delete, post_save
from django.dispatch.dispatcher import receiver
from django.core.cache import cache
from .models import Product


@receiver([post_delete, post_save], sender=Product)
def delete_cache_key(sender, instance, created, **kwargs):
    cache.delete("seo_product_list_response")
