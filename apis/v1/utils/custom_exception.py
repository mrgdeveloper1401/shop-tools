from rest_framework import status
from rest_framework.exceptions import APIException


class TooManyRequests(APIException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = 'تعداد درخواست‌ها بیش از حد مجاز می‌باشد'
    default_code = "too_many_requests"


class PaymentTooManyRequests(APIException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = 'تعداد پرداخت های اینترنتی بیش از حد مجاز می‌باشد'
    default_code = "payment_too_many_requests"


class AmountTooManyRequests(APIException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_detail = 'مبلغ پرداخت اینترنتی بیش از حد مجاز می‌باشد'
    default_code = "amount_too_many_requests"


class CartdIsInvalid(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "صادر کننده کارت نامعتبر میباشد"
    default_code = "cart_invalid"


class SwitchError(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "خطای سوییچ"
    default_code = "switch_error"


class CartNotFound(APIException):
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = "کارت قابل دسترسی نمی‌باشد"
    default_code = "cart_not_found"

