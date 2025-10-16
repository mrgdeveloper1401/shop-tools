from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from .models import PostBlog
from django.core.cache import cache


@receiver([post_save, post_delete], sender=PostBlog)
def clear_seo_blog_cache(sender, **kwargs):
    cache.delete('seo_blog_list_response')
