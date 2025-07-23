from celery import shared_task

from account_app.models import User, PrivateNotification

@shared_task()
def send_notification_order_complete():
    user_admin_list = User.objects.filter(is_staff=True, is_active=True).only("mobile_phone")
    lst = [
        PrivateNotification(
            user_id=i.id,
            body="ادمین گرامی یک سفارش ثبت و پرداخت شده هست",
            title="سفارش موفق"
        )
        for i in user_admin_list
    ]
    if lst:
        PrivateNotification.objects.bulk_create(lst)
