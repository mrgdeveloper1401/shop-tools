from django.core.cache import cache
from rest_framework import viewsets, mixins, views, response, status, exceptions, permissions, generics

from account_app.models import User, OtpService, Profile, PrivateNotification, UserAddress, State, City
from account_app.tasks import send_otp_code_by_celery
from core.utils.jwt import get_tokens_for_user
from core.utils.pagination import  AdminTwentyPageNumberPagination
from core.utils.custom_filters import AdminUserInformationFilter, AdminUserAddressFilter, UserMobilePhoneFilter
from core.utils.permissions import NotAuthenticated
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
        ).only('id', "is_active", "is_staff")

        # check user
        if not user.exists():
            raise exceptions.NotFound()

        # get user
        get_user = user.first()

        # generate token
        token = get_tokens_for_user(get_user)

        # return token
        return response.Response(
            data={
                "token": token,
                "is_staff": get_user.is_staff
            }
        )


class UserInformationViewSet(viewsets.ModelViewSet):
    """
    permission (create and delete) --> user must be admin \n
    pagination --> only user admin have pagination --> 20 item \n
    for filter query must admin user (is_active, mobile_phone)
    """
    serializer_class = serializers.UserInformationSerializer
    pagination_class = AdminTwentyPageNumberPagination
    filterset_class = AdminUserInformationFilter

    def get_permissions(self):
        if self.action in ("create", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        else:
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()

    def get_queryset(self):
        query = User.objects.only(
            "mobile_phone",
            'username',
            "email",
            "is_active",
            "is_staff"
        )

        if not self.request.user.is_staff:
            query = query.filter(id=self.request.user.id)

        return query


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    permission (create and delete) --> user must be admin \n
    pagination --> 20 item , only user admin have pagination
    """
    serializer_class = serializers.UserProfileSerializer
    pagination_class = AdminTwentyPageNumberPagination

    def get_permissions(self):
        if self.action in ("create", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        else:
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()

    def get_queryset(self):
        query = Profile.objects.select_related("profile_image").only(
            "first_name",
            "last_name",
            "profile_image__image",
        )
        if not self.request.user.is_staff:
            query = query.filter(user_id=self.request.user.id)
        return query


class UserPrivateNotificationViewSet(viewsets.ModelViewSet):
    """
    permission (create and delete and update) --> user must be admin \n
    pagination --> 20 item , only user admin have pagination
    """
    serializer_class = serializers.UserPrivateNotification
    pagination_class = AdminTwentyPageNumberPagination

    def get_permissions(self):
        if self.action in ("create", "destroy", "update", "partial_update"):
            self.permission_classes = (permissions.IsAdminUser,)
        else:
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()

    def get_queryset(self):
        query = PrivateNotification.objects.only(
            "title",
            "body",
            "created_at"
        )
        if not self.request.user.is_staff:
            query = query.filter(user_id=self.request.user.id)
        return query


class UserAddressViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item , only user admin have pagination \n
    filter query --> postal cdde, only admin user can use filter query
    """
    serializer_class = serializers.UserAddressSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = AdminTwentyPageNumberPagination
    filterset_class = AdminUserAddressFilter

    def get_queryset(self):
        query = UserAddress.objects.defer(
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at"
        )
        if not self.request.user.is_staff:
            query = query.filter(user_id=self.request.user.id)
        return query


class AdminUserListview(generics.ListAPIView):
    """
    you can show list user \n
    permission --> admin user \n
    filter query --> mobile_phone
    """
    serializer_class = serializers.AdminUserListSerializer
    permission_classes = (permissions.IsAdminUser,)
    filterset_class = UserMobilePhoneFilter

    def get_queryset(self):
        return User.objects.only(
            "mobile_phone"
        ).filter(
            is_active=True
        )


class StateViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin
):
    serializer_class = serializers.StateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return State.objects.only(
            "state_name"
        )


class CityViewSet(
    viewsets.GenericViewSet,
    mixins.ListModelMixin,
):
    serializer_class = serializers.CitySerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return City.objects.filter(
            state_id=self.kwargs['state_pk']
        ).only(
            "name"
        )
