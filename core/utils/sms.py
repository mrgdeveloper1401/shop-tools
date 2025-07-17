# import requests
# import asyncio

from decouple import config
import httpx

KV_BASE_URL = config('KV_BASE_URL', cast=str)
KV_API_KEY = config('KV_API_KEY', cast=str)
VERIFY_BASE_URL = KV_BASE_URL + KV_API_KEY + "/verify/lookup.json"
KV_PHONE = config('KV_PHONE', cast=str)
KV_PATTERN_NAME = config('KV_PATTERN_NAME', cast=str)

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
        except httpx.HTTPError as e:
            raise e

# def send_otp_sms(phone: str, otp: str):
#     params = {
#         "receptor": phone,
#         "token": otp,
#         "template": KV_PATTERN_NAME,
#         "type": "sms"
#     }
#     response = requests.get(VERIFY_BASE_URL, params=params)
#     return response.raise_for_status()

