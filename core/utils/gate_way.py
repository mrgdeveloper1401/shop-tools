import httpx
from decouple import config


def http_header():
    header = {
        "Content-Type": "application/json",
    }
    return header

def request_gate_way(amount, description, order_id, mobile):
    try:
        with httpx.Client() as client:
            response = client.post(
                url=config("ZIBAL_REQUEST_GATE_WAY", cast=str),
                headers=http_header(),
                json={
                    "amount": int(amount),
                    "merchant": config("ZIBAL_MERCHANT_API_KEY", cast=str),
                    "description": description,
                    "orderId": order_id,
                    "mobile": mobile,
                    "callbackUrl": config("ZIBAL_CALLBACK_URL", cast=str),
                },
            )
        return response.json()
    except httpx.ConnectError as ce:
        raise Exception("connection error: ", ce)
    except httpx.TimeoutException as te:
        raise Exception("timeout error: ", te)
    except httpx.HTTPStatusError as se:
        raise Exception("status error: ", se)
    except ValueError as ve:
        raise Exception("invalid json data", ve)
    except Exception as e:
        raise Exception("unknown error", e)
