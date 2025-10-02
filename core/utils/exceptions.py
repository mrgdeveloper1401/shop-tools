from functools import wraps

import httpx
from rest_framework import exceptions
from django.utils.translation import gettext_lazy as _


class PaymentBaseError(exceptions.APIException):
    """Base class for payment gateway exceptions"""
    status_code = 400
    default_detail = _("A request error occurred.")


class HttpConnectionError(exceptions.APIException):
    pass


class TimeOutError(exceptions.APIException):
    pass


class HTTPStatusError(exceptions.APIException):
    pass


class InvalidDataError(exceptions.APIException):
    pass


def http_error(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except httpx.ConnectError as ce:
            raise HttpConnectionError(detail=str(ce))
        except httpx.TimeoutException as te:
            raise TimeOutError(detail=str(te))
        except Exception as e:
            raise InvalidDataError(detail=str(e))
    return wrapper
