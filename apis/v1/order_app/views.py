from rest_framework import viewsets, permissions, generics

from core.utils.custom_filters import OrderFilter
from core.utils.pagination import TwentyPageNumberPagination
from order_app.models import Order, OrderItem
from . import serializers


class OrderViewSet(viewsets.ModelViewSet):
    """
    filter query --> field (is_complete, is_active, status) \n
    status --> pending, paid, processing, shipped, delivered, cancelled
    pagination --> 20 item
    """
    pagination_class = TwentyPageNumberPagination
    filterset_class = OrderFilter

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.defer("is_deleted", "deleted_at")
        else:
            return Order.objects.filter(
                profile__user_id=self.request.user.id,
                is_active=True
            ).only(
                "is_complete",
                "created_at",
                "tracking_code",
                "payment_date",
                "address_id",
                "status"
            )

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminOrderSerializer
        else:
            return serializers.OrderSerializer

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy", "create"):
            self.permission_classes = (permissions.IsAdminUser,)
        else:
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()


class OrderItemViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy", "create"):
            self.permission_classes = (permissions.IsAdminUser,)
        else:
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminOrderItemSerializer
        else:
            return serializers.OrderItemSerializer

    def get_queryset(self):
        base_query = OrderItem.objects.filter(
            order_id=self.kwargs['order_pk']
        )

        if self.request.user.is_staff:
            return base_query.defer("is_deleted", "deleted_at")
        else:
            return base_query.filter(
                order__profile__user_id=self.request.user.id,
                order__is_active=True
            ).select_related(
                "product_variant__product",
                "order"
            ).only(
                "order__is_active",
                "price",
                "created_at",
                "quantity",
                "product_variant_id",
                "product_variant__product_id",
                "product_variant__product__category_id",
            )


class CreateOrderView(generics.CreateAPIView):
    queryset = None
    serializer_class = serializers.CreateOrderSerializer
    permission_classes = (permissions.IsAuthenticated,)
