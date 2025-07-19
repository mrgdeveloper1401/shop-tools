from rest_framework_nested import routers
from django.urls import path, include

from . import views


app_name = "v1_auth"

router = routers.SimpleRouter()

router.register("create_user", views.UserCreateViewSet, basename="create_user")
router.register("user_information", views.UserInformationViewSet, basename="user_information")
router.register("profile", views.UserProfileViewSet, basename="profile")
router.register("private_notification", views.UserPrivateNotificationViewSet, basename="private_notification")
router.register("user_address", views.UserAddressViewSet, basename="user_address")
router.register("state", views.StateViewSet, basename="state")

state_router = routers.NestedSimpleRouter(router, "state", lookup="state")
state_router.register("city", views.CityViewSet, basename="city")

urlpatterns = [
    path("request-otp/", views.RequestOtpView.as_view(), name="request-otp"),
    path("verify-otp/", views.RequestPhoneVerifyOtpView.as_view(), name="verify_otp"),
    path("admin_user_list/", views.AdminUserListview.as_view(), name="admin_user_list"),
    path("", include(state_router.urls))
] + router.urls