import logging

from celery import shared_task
from celery.utils.log import get_task_logger
from account_app.models import User, PrivateNotification
from core.utils.sms import send_otp_for_request_forget_password, send_otp_sms


# celery logger
logger = get_task_logger(__name__)

# send otp code for login user
@shared_task(bind=True, max_retries=2, queue="otp_sms")
def send_otp_code_by_celery(self, phone: str, code: str):
    try:
        send_otp_sms(phone, code)
    except Exception as e:
        logging.error(f"failed to send otp to {phone}, Error: {e}")
        raise self.retry(exc=e, countdown=10)

# send otp for forget password
@shared_task(bind=True, max_retries=2, queue='otp_sms')
def send_otp_forget_password(self, phone: str, code: str):
    try:
        send_otp_for_request_forget_password(phone, code)
    except Exception as e:
        logger.error(f"failed to send otp forget_password to {phone}, error: {e}")
        raise self.retry(exc=e, countdown=10)

# send notification after create ticket
@shared_task(bind=True, max_retries=2, queue="notifications")
def send_notification_after_create_ticket(self, room_id):
    try:
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
    except Exception as e:
        logger.error(f'failed send notification, error: {e}')
        self.retry(exc=e)
