from rest_framework import routers
from django.urls import path

from . import views


app_name = "v1_auth"

router = routers.SimpleRouter()

router.register("create_user", views.UserCreateViewSet, basename="create_user")

urlpatterns = [
    path("request-otp/", views.RequestOtpView.as_view(), name="request-otp"),
    path("verify-otp/", views.RequestPhoneVerifyOtpView.as_view(), name="verify_otp"),
] + router.urls