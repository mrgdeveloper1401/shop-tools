from functools import wraps

import httpx
from rest_framework import exceptions
from django.utils.translation import gettext_lazy as _


class PaymentBaseError(exceptions.APIException):
    """Base class for payment gateway exceptions"""
    status_code = 400
    default_detail = _("A request error occurred.")


def http_error(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except httpx.ConnectError as ce:
            raise Exception(f"Connection Error: {ce}")
        except httpx.TimeoutException as te:
            raise Exception(f"Timeout Error: {te}")
        except httpx.HTTPStatusError as he:
            raise Exception(f"HTTP Status Error: {he}")
        except Exception as e:
            raise Exception(f"General Error: {e}")
    return wrapper
