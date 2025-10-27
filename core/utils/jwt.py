from decouple import config
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from asgiref.sync import sync_to_async
import jwt


PUBLIC_KEY = config('TOROB_PUBLIC_KEY', cast=str)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        # 'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

async def async_get_token_for_user(user):
    refresh = await sync_to_async(RefreshToken.for_user)(user)
    return {
        # 'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

def validate_token(token: str):
    # exp and aud fields are checked by PyJWT library.
    return jwt.decode(token, key=PUBLIC_KEY, algorithms=["EdDSA"], audience="[expected_aud_value]")
