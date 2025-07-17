# import asyncio

from django.core.cache import cache
from rest_framework import viewsets, mixins, views, response, status, exceptions, permissions

from account_app.models import User, OtpService, Profile, PrivateNotification
from account_app.tasks import send_otp_code_by_celery
from core.utils.jwt import get_tokens_for_user
from core.utils.permissions import NotAuthenticated
from core.utils.sms import send_otp_sms
from . import serializers


class UserCreateViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin):
    """mobile phone and password is required"""

    queryset = User.objects.only("id")
    serializer_class = serializers.UserCreateSerializer
    permission_classes = (NotAuthenticated,)


class RequestOtpView(views.APIView):
    serializer_class = serializers.RequestPhoneSerializer
    permission_classes = (NotAuthenticated,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        # get user ip address
        ip_addr = request.META.get("REMOTE_ADDR", "X-FORWARDED-FOR")
        # get phone
        phone = serializer.validated_data["mobile_phone"]

        # create otp code
        otp = OtpService.generate_otp()

        # send otp code by celery
        send_otp_code_by_celery.delay(phone, otp)
        # asyncio.run(send_otp_sms(phone, otp))

        # create redis key
        redis_key = f'{ip_addr}-{phone}-{otp}'

        # set key
        OtpService.store_otp(
            key=redis_key,
            otp=otp,
        )
        # return response
        return response.Response(
            data={
                "message": "OTP sent successfully",
            },
            status=status.HTTP_201_CREATED,
        )


class RequestPhoneVerifyOtpView(views.APIView):
    serializer_class = serializers.RequestPhoneVerifySerializer
    permission_classes = (NotAuthenticated,)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        # get ip address and phone
        ip_addr = request.META.get("REMOTE_ADDR", "X-FORWARDED-FOR")
        phone = serializer.validated_data["phone"]
        code = serializer.validated_data.get("code")

        # pattern redis-key
        redis_key = f'{ip_addr}-{phone}-{code}'

        # validate otp
        get_otp = cache.get(redis_key)

        # check otp
        if not get_otp:
            raise exceptions.NotFound()

        # create token
        user = User.objects.filter(
            mobile_phone=phone,
        ).only('id', "is_active")

        # check user
        if not user.exists():
            raise exceptions.NotFound()

        token = get_tokens_for_user(user.first())

        # return token
        return response.Response(token)


class UserInformationViewSet(
    viewsets.GenericViewSet,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
):
    serializer_class = serializers.UserInformationSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id).only(
            "mobile_phone",
            'username',
            "email",
            "is_active",
        )


class UserProfileViewSet(
    viewsets.GenericViewSet,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
):
    serializer_class = serializers.UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Profile.objects.filter(user_id=self.request.user.id).select_related(
            "profile_image"
        ).only(
            "first_name",
            "last_name",
            "profile_image__image",
        )


class UserPrivateNotificationViewSet(
    viewsets.GenericViewSet,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
):
    serializer_class = serializers.UserPrivateNotification
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return PrivateNotification.objects.filter(
            user_id=self.request.user.id,
        ).only(
            "title",
            "body",
            "created_at"
        )
