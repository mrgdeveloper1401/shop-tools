import asyncio
from celery import shared_task
from account_app.models import User, PrivateNotification
from core.utils.sms import send_verify_payment

@shared_task(queue="notifications")
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


@shared_task(queue="payment")
def create_gateway_payment(order_id, json_data, user_id):
    from order_app.models import PaymentGateWay

    PaymentGateWay.objects.create(
        order_id=order_id,
        user_id=user_id,
        payment_gateway=json_data
    )


@shared_task(queue="notifications")
def send_notification_to_user_after_complete_order(mobile_phone):
    user = User.objects.filter(mobile_phone=mobile_phone).only("mobile_phone").first()
    PrivateNotification.objects.create(
        user_id = user.id,
        title = "ثبت سفارش موفق",
        body = "کاربر محترم سفارش شما با موفقیت پرداخت و ثبت شده است",
        notif_type="accept_order"
    )


@shared_task(queue="payment")
def send_sms_after_complete_order(mobile_phone, tracking_code):
    user = User.objects.filter(mobile_phone=mobile_phone).only("mobile_phone").first()
    asyncio.run(send_verify_payment(mobile_phone, tracking_code))
