from django.db.models.signals import post_delete, post_save
from django.dispatch.dispatcher import receiver
from django.core.cache import cache, caches

from apis.v1.utils.cache_mixin import CacheMixin
from . import models


cache_instance = CacheMixin()


@receiver([post_delete, post_save], sender=models.Tag)
def clean_cache_list_admin_tag_name(sender, **kwargs):
    key = "list_admin_tag_name"
    cache_instance.delete_many_key(key)

    # delete pattern with by module django core
    api_cache = caches['api-cache']
    api_cache.delete_pattern("*product_tags_cache_view*")

@receiver([post_delete, post_save], sender=models.Category)
def clean_cache_list_index_category_name(sender, **kwargs):
    key = "list_index_category_name_key"
    cache_instance.delete_many_key(key)

    # delete pattern with by module django core
    api_cache = caches['api-cache']
    api_cache.delete_pattern("*product_list_category_cache*")

@receiver([post_delete, post_save], sender=models.ProductBrand)
def clear_cache_list_index_brand_name(sender, **kwargs):
    keys = "list_index_brand_name"
    cache_instance.delete_many_key(keys)

    # delete pattern with by module django core
    api_cache = caches['api-cache']
    api_cache.delete_pattern("*list_product_brand_view*")

@receiver([post_save, post_delete], sender=models.Product)
def clear_cache_list_seo_product_name(sender, **kwargs):
    key = "list_seo_product_name"
    cache_instance.delete_cache(key)

@receiver([post_save, post_delete], sender=models.Attribute)
def clear_cache_list_attribute_name(sender, **kwargs):
    key = "product_attribute_cache"
    cache_instance.delete_cache(key)
