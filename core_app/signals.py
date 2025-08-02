from django.db.models.signals import post_save
from django.dispatch import receiver

from core.utils.ba_salam import upload_image_file
from .models import Image
from .tasks import create_image_auto_into_ba_salam

@receiver(post_save, sender=Image) #TODO, better performance update image_id_ba_salam
def create_ba_salam_id_after_upload(instance, created, **kwargs):
    if created and instance.image:
        with instance.image.open('rb') as image_file:
            file_content = image_file.read()
            res = upload_image_file(file_content, "product.photo")
            instance.image_id_ba_salam = res['id']
            instance.save()
            # create_image_auto_into_ba_salam.delay(file_content)
