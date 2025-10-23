import asyncio
import logging
import os
import subprocess
from uuid import uuid4
from decouple import config
from celery import shared_task
from django.conf import settings
from django.utils import timezone
from django.core.management import call_command
from account_app.models import User, PrivateNotification
from core.utils.sms import send_otp_sms
from core.utils.backup_arvancloud import Bucket


# @shared_task(max_retries=3, queue="otp_sms")
# def send_otp_code_by_celery(phone: str, code: str):
#     asyncio.run(send_otp_sms(phone, code))


@shared_task(max_retries=3, queue="notifications")
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


@shared_task(queue="backup_db")
def create_backup():
    from dotenv import load_dotenv
    load_dotenv()

    now = timezone.now().strftime("%Y/%m/%d/%H")
    file_name = f"backup/{now}/{uuid4().hex}.sql"
    file_path = f"/tmp/{file_name}"

    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    db_name = settings.DATABASES['default']['NAME']
    db_user = settings.DATABASES['default']['USER']
    db_password = settings.DATABASES['default']['PASSWORD']
    db_host = settings.DATABASES['default']['HOST']
    db_port = settings.DATABASES['default']['PORT']

    dump_command = [
        "pg_dump",
        "-h", db_host,
        "-p", str(db_port),
        "-U", db_user,
        "-F", "c",
        "-f", file_path,
        db_name,
    ]

    env = os.environ.copy()
    env["PGPASSWORD"] = db_password

    result = subprocess.run(dump_command, env=env, capture_output=True, text=True)

    if result.returncode != 0:
        print("STDERR:", result.stderr)
        raise Exception(f"Backup failed: {result.stderr}")

    try:
        bucket = Bucket()
        bucket.create_object_for_backup_as_multi_part(file_path=file_path, file_name=file_name)
        logging.info(f"Backup {file_name} uploaded successfully!")
    except Exception as e:
        logging.error(e)
    finally:
        os.remove(file_path)
