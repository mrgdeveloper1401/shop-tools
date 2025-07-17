from rest_framework import routers
from django.urls import path

from . import views


app_name = "v1_auth"

router = routers.SimpleRouter()

router.register("create_user", views.UserCreateViewSet, basename="create_user")
router.register("user_information", views.UserInformationViewSet, basename="user_information")
router.register("profile", views.UserProfileViewSet, basename="profile")
router.register("private_notification", views.UserPrivateNotificationViewSet, basename="private_notification")

urlpatterns = [
    path("request-otp/", views.RequestOtpView.as_view(), name="request-otp"),
    path("verify-otp/", views.RequestPhoneVerifyOtpView.as_view(), name="verify_otp"),
] + router.urls