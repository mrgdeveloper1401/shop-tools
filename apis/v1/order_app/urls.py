from rest_framework_nested import routers
from django.urls import path

from . import views

router = routers.SimpleRouter()

app_name = "v1_order_app"

router.register(r'orders', views.OrderViewSet, basename='orders')
router.register("shipping_company", views.ShippingViewSet, basename="shipping_company")

order_router = routers.NestedSimpleRouter(router, "orders", lookup="order")
order_router.register("items", views.OrderItemViewSet, basename="order-items")

urlpatterns = [
    path("create_order/", views.CreateOrderView.as_view(), name="create_order"),
] + router.urls + order_router.urls
