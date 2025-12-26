from django.db.models.signals import post_delete, post_save
from django.dispatch.dispatcher import receiver

from apis.v1.utils.cache_mixin import CacheMixin
from . import models


cache_instance = CacheMixin()

@receiver([post_delete, post_save], sender=models.Tag)
def clean_cache_list_admin_tag_name(sender, **kwargs):
    key = "list_admin_tag_name"
    cache_instance.delete_cache(key)


@receiver([post_delete, post_save], sender=models.Category)
def clean_cache_list_index_category_name(sender, **kwargs):
    key = "list_index_category_name_key"
    cache_instance.delete_cache(key)


@receiver([post_delete, post_save], sender=models.ProductBrand)
def clear_cache_list_index_brand_name(sender, **kwargs):
    key = "list_index_brand_name"
    cache_instance.delete_cache(key)


@receiver([post_save, post_delete], sender=models.Product)
def clear_cache_list_seo_product_name(sender, **kwargs):
    key = "list_seo_product_name"
    cache_instance.delete_cache(key)
