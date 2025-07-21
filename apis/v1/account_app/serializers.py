from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers, exceptions

from account_app.models import User, Profile, PrivateNotification, UserAddress, State, City
from account_app.validators import MobileRegexValidator
from core.utils.jwt import get_tokens_for_user
from core_app.models import Image


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
    image = serializers.ImageField(required=False)

    class Meta:
        model = Profile
        fields = (
            "id",
            "first_name",
            "last_name",
            "profile_image",
            "image",
            "profile_image_url"
        )
        read_only_fields = ("profile_image",)

    def update(self, instance, validated_data):
        image = validated_data.pop("image", None)

        if image:
            img = Image.objects.create(
                image=image
            )
            instance.profile_image = img

        return super().update(instance, validated_data)


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

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "mobile_phone",
            'username',
            "email",
            "is_active",
            "is_staff"
        )
        read_only_fields = (
            "is_active",
            "mobile_phone"
        )


class UserPrivateNotification(serializers.ModelSerializer):
    class Meta:
        model = PrivateNotification
        fields = (
            "id",
            "title",
            "body",
            "created_at"
        )


class UserAddressSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.only("mobile_phone")
    )
    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.only("name")
    )
    state = serializers.PrimaryKeyRelatedField(
        queryset=State.objects.only("state_name")
    )

    class Meta:
        model = UserAddress
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )

    def get_fields(self):
        request = self.context.get("request")
        fields = super().get_fields()

        if request and not request.user.is_staff:
            fields.pop("user", None)

        return fields


class AdminUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "mobile_phone"
        )


class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = (
            "id",
            "state_name"
        )


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = (
            "id",
            "name"
        )


class LoginByPhonePasswordSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField()
