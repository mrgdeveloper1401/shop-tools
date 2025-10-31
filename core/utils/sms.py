from decouple import config
import httpx
from core.utils.custom_exception import HttpxCustomApiException


KV_BASE_URL = config('KV_BASE_URL', cast=str)
KV_API_KEY = config('KV_API_KEY', cast=str)
VERIFY_BASE_URL = KV_BASE_URL + KV_API_KEY + "/verify/lookup.json"
KV_PHONE = config('KV_PHONE', cast=str)
KV_PATTERN_NAME = config('KV_PATTERN_NAME', cast=str)
KV_PAYMENT_PATTERN_NAME = config("KV_PAYMENT_PATTERN_NAME", cast=str)
KV_CANCEL_PAYMENT_PATTERN_NAME = config("KV_CANCEL_PAYMENT_PATTERN_NAME", cast=str)
KV_REQUEST_FORGE_PASSWORD = config("KV_REQUEST_FORGE_PASSWORD", cast=str)


async def send_otp_sms(phone: str, otp: str):
    params = {
        "receptor": phone,
        "token": otp,
        "template": KV_PATTERN_NAME,
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                url=VERIFY_BASE_URL,
                params=params,
                timeout=10.0
            )
            return response.raise_for_status()
        except Exception as e:
            raise HttpxCustomApiException(e)


async def send_verify_payment(phone: str, tracking_code: str):
    params = {
        "receptor": phone,
        "token": tracking_code,
        "template": KV_PAYMENT_PATTERN_NAME
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                url=VERIFY_BASE_URL,
                params=params,
                timeout=10.0
            )
            return response.raise_for_status()
        except Exception as e:
            raise HttpxCustomApiException(e)

async def cancel_verify_payment(phone: str, tracking_code: str):
    params = {
        "receptor": phone,
        "token": tracking_code,
        "template": KV_CANCEL_PAYMENT_PATTERN_NAME
    }
    async with httpx.AsyncClient() as client:
        try:
            resonse = await client.get(
                url=VERIFY_BASE_URL,
                params=params,
                timeout=10.0
            )
            return resonse.raise_for_status()
        except Exception as e:
            raise HttpxCustomApiException(e)

async def send_otp_for_request_forget_password(phone, code):
    params = {
        "receptor": phone,
        "token": code,
        "template": KV_REQUEST_FORGE_PASSWORD
    }
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                url=VERIFY_BASE_URL,
                params=params,
                timeout=10.0
            )
            return response.raise_for_status()
        except Exception as e:
            raise HttpxCustomApiException(e)
