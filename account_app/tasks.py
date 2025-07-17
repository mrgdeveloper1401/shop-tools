from celery import shared_task
from core.utils.sms import send_otp_sms
import asyncio


@shared_task(max_retries=3)
def send_otp_code_by_celery(phone: str, code: str):
    asyncio.run(send_otp_sms(phone, code))


# @shared_task(max_retries=3)
# def pow_number(x, y):
#     return x * y
