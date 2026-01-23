from django.db.models.signals import post_save, post_delete
from django.dispatch.dispatcher import receiver

from apis.v1.utils.cache_mixin import CacheMixin
from .models import User, Profile, Ticket, State, City
from .tasks import send_notification_after_create_ticket


cache_instance = CacheMixin()

# create profile by signal
@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=Ticket)
def create_notification_ticket(sender, instance, created, **kwargs):
    if created and not instance.sender.is_staff:
        send_notification_after_create_ticket.delay(
            room_id=instance.room.id,
        )

# delete cache state
@receiver([post_save, post_delete], sender=State)
def clear_state_cache(sender, instance, **kwargs):
    cache_instance.delete_cache("state_list_api_cache")

# delete cache city
@receiver([post_save, post_delete], sender=City)
def clear_city_cache(sender, instance, **kwargs):
    keys = ("retrieve_city_api_cache", "city_list_api_cache")
    cache_instance.delete_many_key(keys=keys)

# delete cache user address
@receiver([post_save, post_delete], sender=City)
def clear_user_address_cache(sender, instance, **kwargs):
    cache_instance.delete_cache("user_address_cache")
