from django.core.cache import caches
from django.utils.functional import cached_property


class CacheMixin:
    cache_alis = "api-cache"

    @cached_property
    def cache(self):
        return caches[self.cache_alis]

    def set_cache(self, key, value):
        self.cache.set(key, value)

    def get_cache(self, key):
        return self.cache.get(key)

    def delete_cache(self, key):
        return self.cache.delete(key)

    def delete_many_key(self, keys):
        return self.cache.delete_many(keys)
