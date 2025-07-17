from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers, exceptions

from account_app.models import User, Profile, OtpService
from account_app.validators import MobileRegexValidator
from core.utils.jwt import get_tokens_for_user


class RequestPhoneSerializer(serializers.Serializer):
    mobile_phone = serializers.CharField(
        validators=(MobileRegexValidator,)
    )

    def validate(self, attrs):
        user = User.objects.filter(
            mobile_phone=attrs["mobile_phone"]
        ).only("id")

        if not user.exists():
            raise exceptions.NotFound()
        return attrs


class RequestPhoneVerifySerializer(serializers.Serializer):
    code = serializers.CharField()
    phone = serializers.CharField(
        validators=(MobileRegexValidator,)
    )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "mobile_phone",
            "email",
            "is_active",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("is_active",)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            "first_name",
            "last_name",
            "profile_image"
        )


class UserCreateSerializer(serializers.ModelSerializer):
    access_token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "mobile_phone",
            "password",
            "email",
            "username",
            "access_token"
        )
        extra_kwargs = {
            "password": {
                "write_only": True,
            }
        }

    @extend_schema_field(serializers.DictField())
    def get_access_token(self, obj):
        return get_tokens_for_user(obj)
