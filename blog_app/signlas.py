from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete

from apis.v1.utils.cache_mixin import CacheMixin
from . import models

cache_instance = CacheMixin()

@receiver([post_save, post_delete], sender=models.CategoryBlog)
def clear_category_blog_cache(sender, **kwargs):
    keys = ('category_blog', "retrieve_category_blog")
    cache_instance.delete_many_key(keys)

@receiver([post_save, post_delete], sender=models.TagBlog)
def clear_tag_blog_cache(sender, **kwargs):
    keys = ("list_tag_blog", "retrieve_tag_blog", "list_blog_tag_with_out_pagination")
    cache_instance.delete_many_key(keys)

@receiver([post_save, post_delete], sender=models.PostBlog)
def clean_latest_ten_post_blog_cache(sender, **kwargs):
    keys = ("list_ten_post_blog", "list_seo_blog", "seo_post_detail_blog")
    cache_instance.delete_many_key(keys)
