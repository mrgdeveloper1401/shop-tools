from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers, exceptions
from django.utils.translation import gettext_lazy as _
from rest_framework.generics import get_object_or_404
from asgiref.sync import sync_to_async
from adrf.serializers import Serializer, ModelSerializer
from account_app.models import User, Profile, PrivateNotification, UserAddress, State, City, TicketRoom, Ticket
from account_app.validators import MobileRegexValidator
from core.utils.jwt import get_tokens_for_user
from core.utils.validators import PhoneNumberValidator
from core_app.models import Image


class AsyncRequestPhoneSerializer(Serializer):
    mobile_phone = serializers.CharField(
        validators=(MobileRegexValidator(),)
    )


class AsyncRequestPhoneVerifySerializer(Serializer):
    code = serializers.CharField()
    phone = serializers.CharField(
        validators=(MobileRegexValidator(),)
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

    def validate_mobile_phone(self, value):
        validator = PhoneNumberValidator()
        validator(value)
        return value

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
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.only("mobile_phone")
    )

    class Meta:
        model = PrivateNotification
        fields = (
            "id",
            "title",
            "body",
            "created_at",
            "notif_type",
            "user",
            "is_read",
            "is_active",
            "notifi_redirect_url"
        )

    def get_fields(self):
        field = super().get_fields()
        user_admin = self.context['request'].user.is_staff

        if not user_admin:
            field.pop("user", None)
            field.pop("is_read", None)
            field.pop("is_active", None)
            field.pop("notifi_redirect_url", None)

        return field


class UserAddressSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.only("mobile_phone"),
        required=False
    )
    city = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.only("name")
    )
    state = serializers.PrimaryKeyRelatedField(
        queryset=State.objects.only("name")
    )
    city_name = serializers.CharField(source="city.name", read_only=True)

    class Meta:
        model = UserAddress
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        user = self.context['request'].user
        get_user_data = validated_data.get("user", None)

        if user.is_staff is False:
            return UserAddress.objects.create(user_id=user.id, **validated_data)
        if user.is_staff and get_user_data is None:
            return UserAddress.objects.create(user_id=user.id, **validated_data)
        return super().create(validated_data)

    def get_fields(self):
        request = self.context.get("request")
        fields = super().get_fields()

        if request and not request.user.is_staff:
            fields.pop("user", None)

        return fields


class AsyncAdminUserListSerializer(ModelSerializer):
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
            "name"
        )


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = (
            "id",
            "name",
            "state_id"
        )


class AsyncLoginByPhonePasswordSerializer(Serializer):
    phone = serializers.CharField(validators=(MobileRegexValidator(),))
    password = serializers.CharField()


class AdminProfileListSerializer(serializers.ModelSerializer):
    user_phone = serializers.CharField(source="user.mobile_phone")

    class Meta:
        model = Profile
        fields = (
            "id",
            "first_name",
            "last_name",
            "user_phone"
        )


class ForgetPasswordSerializer(Serializer):
    mobile_phone = serializers.CharField(validators=(MobileRegexValidator(),))


class AsyncForgetPasswordChangeSerializer(Serializer):
    otp = serializers.CharField()
    password = serializers.CharField()
    confirm_password = serializers.CharField()
    mobile_phone = serializers.CharField(validators=(MobileRegexValidator(),))

    # check password
    def validate(self, data):
        password = data['password']
        confirm_password = data['confirm_password']

        if password != confirm_password:
            raise serializers.ValidationError(
                {"password": "password must be same"}
            )

        return data


class TicketRoomSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.only("mobile_phone").filter(is_active=True)
    )

    class Meta:
        model = TicketRoom
        exclude = (
            "is_deleted",
            "deleted_at",
        )

    def get_fields(self):
        fields = super().get_fields()

        user = self.context['request'].user
        if not user.is_staff:
            fields.pop("user", None)
            fields.pop("is_active", None)
        return fields

    def create(self, validated_data):
        user = self.context['request'].user

        if not user.is_staff:
            self.instance = TicketRoom.objects.create(
                user_id=user.id,
                **validated_data
            )
        else:
            self.instance = TicketRoom.objects.create(**validated_data)

        return self.instance


class TicketSerializer(serializers.ModelSerializer):
    parent = serializers.IntegerField(required=False)
    sender_is_staff = serializers.SerializerMethodField()
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        exclude = (
            "is_deleted",
            "deleted_at"
        )
        read_only_fields = (
            "depth",
            "path",
            "numchild",
            "room",
            "sender"
        )

    @extend_schema_field(serializers.BooleanField())
    def get_sender_is_staff(self, obj):
        return obj.sender.is_staff

    def get_sender_name(self, obj):
        return obj.sender.full_name

    def get_fields(self):
        fields = super().get_fields()

        user = self.context['request'].user

        if not user.is_staff:
            fields.pop("is_active", None)
        return fields

    def create(self, validated_data):
        room_id = self.context['room_pk']
        parent = validated_data.pop("parent", None)
        user_id = self.context['request'].user.id

        if not parent:
            self.instance = Ticket.add_root(
                room_id=int(room_id),
                sender_id=user_id,
                **validated_data
            )
        else:
            ticket = get_object_or_404(Ticket, id=parent, is_active=True)
            self.instance = ticket.add_child(
                room_id=int(room_id),
                sender_id=user_id,
                **validated_data
            )

        return self.instance

    def validate(self, attrs):
        user = self.context['request'].user

        if not user.is_staff:
            room = TicketRoom.objects.filter(
                user_id=user.id,
                id=int(self.context['room_pk']),
            ).only("id")

            if not room.exists():
                raise exceptions.NotFound()

        return attrs
