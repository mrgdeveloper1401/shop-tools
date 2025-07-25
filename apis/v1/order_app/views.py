from django.db.models import Count, Q
from rest_framework import viewsets, permissions, generics, mixins, views, exceptions
from django.utils.translation import gettext_lazy as _

from core.utils.custom_filters import OrderFilter, ResultOrderFilter
from core.utils.exceptions import PaymentBaseError
from core.utils.gate_way import verify_payment
from core.utils.pagination import TwentyPageNumberPagination
from order_app.models import Order, OrderItem, ShippingCompany, ShippingMethod, PaymentGateWay, VerifyPaymentGateWay
# from order_app.tasks import create_verify_payment
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
            return Order.objects.select_related(
                "profile"
            ).only(
                "profile__first_name",
                "profile__last_name",
                "created_at",
                "updated_at",
                "status",
                "is_complete",
                "tracking_code",
                "payment_date",
                "address_id",
                "shipping_id",
                "is_active"
            )
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


class ShippingViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.AdminShippingSerializer
    permission_classes = (permissions.IsAdminUser,)
    queryset = ShippingCompany.objects.defer("is_deleted", "deleted_at")

    # def get_serializer_class(self):
    #     if self.request.user.is_staff:
    #         return serializers.AdminShippingSerializer
    #     else:
    #         return serializers.UserShippingCompanySerializer

    # def get_queryset(self):
    #     if self.request.user.is_staff:
    #         return ShippingCompany.objects.defer("is_deleted", "deleted_at")
    #     else:
    #         return ShippingCompany.objects.filter(is_active=True).only(
    #             "name"
    #         )

    # def get_permissions(self):
    #     if self.action in ("update", "partial_update", "destroy", "create"):
    #         self.permission_classes = (permissions.IsAdminUser,)
    #     else:
    #         self.permission_classes = (permissions.IsAuthenticated,)
    #     return super().get_permissions()


class ShippingMethodViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminShippingMethodSerializer
        else:
            return serializers.UserShippingMethodSerializer

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy", "create"):
            self.permission_classes = (permissions.IsAdminUser,)
        else:
            self.permission_classes = (permissions.IsAuthenticated,)
        return super().get_permissions()

    def get_queryset(self):
        base_query = ShippingMethod.objects.select_related("company")

        if self.request.user.is_staff:
            return base_query.only(
                "company__name",
                "created_at",
                "updated_at",
                "shipping_type",
                "price",
                "name",
                "estimated_days",
                "is_active",
            )
        else:
            return base_query.filter(
                is_active=True,
                company__is_active=True
            ).only(
            "company__name",
            "price",
            "estimated_days",
            "name",
            "price",
            "shipping_type"
            )


class ResultOrderViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    """
    filter query --> is_complete --> true or false /n
    status --> pending, paid, processing, shipped, delivered, cancelled
    """
    serializer_class = serializers.ResultOrderSerializer
    permission_classes = (permissions.IsAdminUser,)
    pagination_class = TwentyPageNumberPagination
    filterset_class = ResultOrderFilter

    def get_queryset(self):
        return Order.objects.filter(
            is_active=True
        ).select_related(
            "profile__user",
            "address__city",
            "address__state"
        ).filter(
            is_active=True
        ).only(
            "profile__first_name",
            "profile__last_name",
            "profile__created_at",
            "profile__user__email",
            "profile__user__mobile_phone",
            "address__city__name",
            "address__state__state_name",
            "is_complete",
            "status"
        ).annotate(
            user_order_count=Count(
                "profile__orders",
                filter=Q(profile__orders__is_active=True),
                distinct=True
            ),
            # total_price=Sum(
            #     F("order_items__price") * F("order_items__quantity"), filter=Q(order_items__is_active=True)
            # ),
        )


class VerifyPaymentGatewayView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        status = request.query_params.get("status")
        track_id = int(request.query_params.get("trackId"))
        order_id = request.query_params.get("orderId")

        # send request into gateway
        verify_req = verify_payment(track_id)

        if verify_req:
            # create instance of model by celery
            # create_verify_payment.delay(verify, track_id)

            # filter query PaymentGateway
            payment = PaymentGateWay.objects.filter(payment_gateway__trackId=track_id).only("id", "order_id")

            if payment:
                # get obj payment
                get_payment = payment.last()

                # create instance of model VerifyPaymentGateWay
                verify = VerifyPaymentGateWay.objects.create(
                    payment_gateway_id=get_payment.id,
                    result=verify_req
                )

                verify_status = verify_req.get("status")

                if verify_status == 1:
                    # update payment after response successfully
                    Order.objects.filter(id=get_payment.id).update(
                        is_complete=True,
                        status="paid"
                    )
                else:
                    raise exceptions.ValidationError(
                        {
                            "message": _("Your payment encountered an error.")
                        }
                    )
            else:
                raise PaymentBaseError
