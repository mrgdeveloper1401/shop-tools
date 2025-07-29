from celery import shared_task

from account_app.models import User, PrivateNotification
from core.utils.sms import send_otp_sms
import asyncio


@shared_task(max_retries=3)
def send_otp_code_by_celery(phone: str, code: str):
    asyncio.run(send_otp_sms(phone, code))


@shared_task()
def send_notification_after_create_ticket(room_id):
    users = User.objects.filter(
        is_active=True,
        is_staff=True
    ).only(
        "mobile_phone",
    )
    notification = [
        PrivateNotification(
            user_id=i.id,
            title="ticket",
            notif_type="ticket",
            body="یک تیکت ثبت شده هست",
            notifi_redirect_url=f'room_id:{room_id}'
        )
        for i in users
    ]

    if notification:
        PrivateNotification.objects.bulk_create(notification)
