from functools import wraps

import httpx
from rest_framework import exceptions
from django.utils.translation import gettext_lazy as _


class PaymentBaseError(exceptions.APIException):
    """Base class for payment gateway exceptions"""
    status_code = 400
    default_detail = _("A request error occurred.")


class HttpConnectionError(PaymentBaseError):
    pass


class TimeOutError(PaymentBaseError):
    pass


class HTTPStatusError(PaymentBaseError):
    pass


class InvalidDataError(PaymentBaseError):
    pass


def http_error(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except httpx.ConnectError as ce:
            raise HttpConnectionError("connect error", ce)
        except httpx.TimeoutException as te:
            raise TimeOutError("timeout error", te)
        except httpx.HTTPStatusError as se:
            raise HTTPStatusError("status error", se)
        except ValueError as ve:
            raise InvalidDataError(ve)
        except Exception as e:
            raise InvalidDataError(e)
    return wrapper
