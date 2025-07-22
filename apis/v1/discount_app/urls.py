from rest_framework import routers
from rest_framework.urls import path

from . import views

app_name = 'v_discount_app'

router = routers.SimpleRouter()
router.register("coupon", views.CouponViewSet, basename="coupon")

urlpatterns = [
    path("valid_coupon/", views.ValidCouponCodeView.as_view(), name="valid_coupon"),
] + router.urls
