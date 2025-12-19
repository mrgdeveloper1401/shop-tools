from rest_framework_nested import routers
from django.urls import path, include

from . import views


app_name = "v1_auth"

router = routers.SimpleRouter()

router.register(
    "user_information", views.UserInformationViewSet, basename="user_information"
)
router.register("profile", views.UserProfileViewSet, basename="profile")
router.register(
    "private_notification",
    views.UserPrivateNotificationViewSet,
    basename="private_notification",
)
router.register("user_address", views.UserAddressViewSet, basename="user_address")
router.register("state", views.StateViewSet, basename="state")
router.register("ticket_room", views.TicketRoomViewSet, basename="ticket_room")

state_router = routers.NestedSimpleRouter(router, "state", lookup="state")
state_router.register("city", views.CityViewSet, basename="city")

ticket_room_router = routers.NestedSimpleRouter(router, "ticket_room", lookup="room")
ticket_room_router.register("ticket", views.TicketViewSet, basename="ticket")

urlpatterns = [
    path("get_ip_client/", views.GetIpClient.as_view(), name='get_ip_client'),
    path("create_user/", views.UserCreateView.as_view(), name='create_user'),
    path("request-otp/", views.AsyncRequestOtpView.as_view(), name="request-otp"),
    path(
        "verify-otp/", views.AsyncRequestPhoneVerifyOtpView.as_view(), name="verify_otp"
    ),
    path(
        "request-forget-password/",
        views.AsyncRequestForgetPasswordView.as_view(),
        name="request-forget-password",
    ),
    path(
        "confirm-forget-password/",
        views.AsyncForgetPasswordConfirmView.as_view(),
        name="forget-password-confirm",
    ),
    path(
        "admin_user_list/",
        views.AsyncAdminUserListview.as_view(),
        name="admin_user_list",
    ),
    path(
        "login_by_phone_password/",
        views.AsyncLoginByPhonePasswordView.as_view(),
        name="login_phone_password",
    ),
    path("", include(state_router.urls)),
    path(
        "admin_profile_list/",
        views.AdminListProfileView.as_view(),
        name="admin_profile_list",
    ),
    path("", include(ticket_room_router.urls)),
] + router.urls
