from celery import shared_task

from account_app.models import User, PrivateNotification


@shared_task
def create_comment_notification_admin(category_id, product_id, comment_id):
    admin_user = User.objects.filter(is_staff=True, is_active=True).only("mobile_phone")
    lst = [
        PrivateNotification(
            user_id=i.id,
            title="نظر کاربر",
            notif_type="product_comment_user",
            body="یک کامنت دریافت کردید",
            notifi_redirect_url=f"category_id:{category_id}/product_id:{product_id}/comment_id:{comment_id}"
        )
        for i in admin_user
    ]

    if lst:
        PrivateNotification.objects.bulk_create(lst)
