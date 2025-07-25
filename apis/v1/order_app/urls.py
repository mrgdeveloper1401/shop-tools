from rest_framework_nested import routers
from django.urls import path

from . import views

router = routers.SimpleRouter()

app_name = "v1_order_app"

router.register(r'orders', views.OrderViewSet, basename='orders')
router.register("shipping_company", views.ShippingViewSet, basename="shipping_company")
router.register("shipping_method", views.ShippingMethodViewSet, basename="shipping_method")
router.register("result_order", views.ResultOrderViewSet, basename="result_order")

order_router = routers.NestedSimpleRouter(router, "orders", lookup="order")
order_router.register("items", views.OrderItemViewSet, basename="order-items")

urlpatterns = [
    path("create_order/", views.CreateOrderView.as_view(), name="create_order"),
    path('verify_payment/', views.VerifyPaymentGatewayView.as_view(), name="verify_payment"),
] + router.urls + order_router.urls
