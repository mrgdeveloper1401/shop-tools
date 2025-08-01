from celery import shared_task
from core.utils.ba_salam import upload_image_file


@shared_task
def create_image_auto_into_ba_salam(image):
    return upload_image_file(image, "product.photo")
