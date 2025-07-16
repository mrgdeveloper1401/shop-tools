from rest_framework import serializers, exceptions

from account_app.models import User, Profile
from account_app.validators import MobileRegexValidator


class RequestPhoneSerializer(serializers.Serializer):
    mobile_phone = serializers.CharField(
        validators=(MobileRegexValidator,)
    )

    # def validate(self, attrs):
    #     if not User.objects.only("id").filter(mobile_phone=attrs["mobile_phone"], is_active=True).exists():
    #         raise exceptions.ValidationError({"message": "user dont exists"})
    #     else:
    #         otp = Otp.objects.filter(mobile_phone=attrs["mobile_phone"], expired_date__gt=timezone.now()).last()
    #         if otp:
    #             raise exceptions.ValidationError({"message": "otp already exists, please wait 2 minute"})
    #     return attrs


class RequestPhoneVerifySerializer(serializers.Serializer):
    code = serializers.CharField()


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
    class Meta:
        model = User
        fields = (
            "mobile_phone",
            "password",
            "email",
            "username",
        )
