from django.db.models.signals import post_save
from django.dispatch.dispatcher import receiver

from .models import User, Profile, Ticket
from .tasks import send_notification_after_create_ticket


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
