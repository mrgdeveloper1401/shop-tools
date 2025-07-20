from rest_framework_nested import routers

from . import views

router = routers.SimpleRouter()

app_name = "v1_order_app"

router.register(r'orders', views.OrderViewSet, basename='orders')

order_router = routers.NestedSimpleRouter(router, "orders", lookup="order")
order_router.register("items", views.OrderItemViewSet, basename="order-items")

urlpatterns = [] + router.urls + order_router.urls
