from rest_framework import routers

from . import views

app_name = 'v_discount_app'

router = routers.SimpleRouter()
router.register("coupon", views.CouponViewSet, basename="coupon")

urlpatterns = [

] + router.urls
