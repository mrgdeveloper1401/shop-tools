from celery import shared_task

from core.utils.ba_salam import upload_image_file


@shared_task(queue="ba_salam")
def create_image_auto_into_ba_salam(image, image_id):
    from core_app.models import Image

    try:
        result = upload_image_file(image, "product.photo")
        Image.objects.filter(id=image_id).only("id").update(
            image_id_ba_salam=result.get('id')
        )
    except Exception as e:
        raise e
    else:
        return result
