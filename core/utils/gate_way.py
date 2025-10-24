import httpx
from decouple import config

from core.utils.exceptions import http_error


def http_header():
    header = {
        "Content-Type": "application/json",
    }
    return header

@http_error
def request_gate_way(amount, description, order_id, mobile):
    change_amount = amount * 10 # rial into Toma

    with httpx.Client() as client:
        response = client.post(
            url=config("ZIBAL_REQUEST_GATE_WAY", cast=str),
            headers=http_header(),
            json={
                "amount": int(change_amount),
                "merchant": config("ZIBAL_MERCHANT_API_KEY", cast=str),
                "description": description,
                "orderId": order_id,
                "mobile": mobile,
                "callbackUrl": config("ZIBAL_CALLBACK_URL", cast=str),
            },
        )
    return response.json()

@http_error
async def verify_payment(track_id):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            url=config("ZIBAL_VERIFY_URL", cast=str),
            json={
                "trackId": track_id,
                "merchant": config("ZIBAL_MERCHANT_API_KEY", cast=str),
            },
            headers=http_header(),
        )
    return response.json()
