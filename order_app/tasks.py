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


@shared_task()
def create_gateway_payment(order_id, json_data):
    from order_app.models import PaymentGateWay

    PaymentGateWay.objects.create(
        order_id=order_id,
        payment_gateway=json_data
    )


# @shared_task()
# def create_verify_payment(json_data, track_id):
#     from order_app.models import VerifyPaymentGateWay, PaymentGateWay
#
#     # filter query payment
#     payment = PaymentGateWay.objects.filter(payment_gateway__trackId=track_id).only("id", "order_id")
#
#     if payment:
#         VerifyPaymentGateWay.objects.create(
#             payment_gateway_id=payment[0].id,
#             result=json_data
#         )
