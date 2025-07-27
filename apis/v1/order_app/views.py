from datetime import timedelta

from django.db.models import Count, Q, Prefetch, Sum, F, DecimalField
from django.db.models.functions import TruncMonth, TruncWeek, TruncDate
from django.utils.dateparse import parse_date
from rest_framework import viewsets, permissions, generics, mixins, views, exceptions, response, decorators
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from core.utils.custom_filters import OrderFilter, ResultOrderFilter, AnalyticsFilter
from core.utils.exceptions import PaymentBaseError
from core.utils.gate_way import verify_payment
from core.utils.pagination import TwentyPageNumberPagination, FlexiblePagination
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
            return base_query.select_related(
                "product_variant__product"
            ).only(
                "order_id",
                "product_variant__name",
                "product_variant__product__product_name",
                "created_at",
                "updated_at",
                "price",
                "quantity",
                "is_active"
            )
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
    status --> pending, paid, processing, shipped, delivered, cancelled \n
    pagination --> max data in page = 100 // default data in page --> 20 \n
    use pagination --> ?limit=20&offset=10
    """
    serializer_class = serializers.ResultOrderSerializer
    permission_classes = (permissions.IsAdminUser,)
    pagination_class = FlexiblePagination
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
            "shipping_id",
            "created_at",
            "updated_at",
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
        ).prefetch_related(
            Prefetch(
                "payment_gateways", queryset=PaymentGateWay.objects.only("order_id", "payment_gateway")
            )
        ).order_by("-id")


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
                    return verify_req
                else:
                    raise exceptions.ValidationError(
                        {
                            "message": _("Your payment encountered an error.")
                        }
                    )
            else:
                raise PaymentBaseError


# class AnalyticsViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
#     """
#     permission --> is admin user \n
#     filter query --> ?type=(day, week, month)
#     """
#     serializer_class = serializers.AnalyticSaleSerializer
#     permission_classes = (permissions.IsAdminUser,)
#
#     def get_queryset(self):
#         base_query = Order.objects.filter(is_active=True)
#
#         qu_params = self.request.query_params.get("type", None)
#         today = timezone.now().date()
#
#         if qu_params == "day":
#             return base_query.filter(
#                 created_at__date=today
#             ).annotate(
#                 date_group=TruncDate('created_at')
#             ).values('date_group').annotate(
#                 total_sales=Sum(F('order_items__price') * F('order_items__quantity')),
#                 order_count=Count('id')
#             ).order_by('date_group')
#
#         elif qu_params == "week":
#             one_week_ago = today - timedelta(days=7)
#             return base_query.filter(
#                 created_at__date__gte=one_week_ago,
#                 created_at__date__lte=today
#             ).annotate(
#                 week_group=TruncWeek('created_at')
#             ).values('week_group').annotate(
#                 total_sales=Sum(F('order_items__price') * F('order_items__quantity')),
#                 order_count=Count('id')
#             ).order_by('week_group')
#
#         elif qu_params == "month":
#             one_month_ago = today - timedelta(days=30)
#             return base_query.filter(
#                 created_at__date__gte=one_month_ago,
#                 created_at__date__lte=today
#             ).annotate(
#                 month_group=TruncMonth('created_at')
#             ).values('month_group').annotate(
#                 total_sales=Sum(F('order_items__price') * F('order_items__quantity')),
#                 order_count=Count('id')
#             ).order_by('month_group')
#
#         raise exceptions.NotFound()


class AnalyticsViewSet(viewsets.ViewSet):
    """
    filter query --> ?start_date=2025-07-25&end_date=2025-07-26 \n
    permission --> is_admin_user
    """
    permission_classes = (permissions.IsAdminUser,)
    filterset_class = AnalyticsFilter

    @decorators.action(detail=False, methods=["get"], url_path="sale-summary")
    def sale_summary(self, request):
        # اعمال فیلتر دستی بر اساس GET پارامترها
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        orders = Order.objects.filter(is_active=True, is_complete=True, status="paid")

        if start_date:
            orders = orders.filter(created_at__gte=start_date)
        if end_date:
            orders = orders.filter(created_at__lte=end_date)

        order_items = OrderItem.objects.filter(
            order__in=orders,
            is_active=True
        )
        summary = order_items.aggregate(
            total_quantity=Count("quantity"),
            total_amount=Sum(F("price") * F("quantity"), output_field=DecimalField())
        )

        return response.Response({
            "total_quantity": summary["total_quantity"] or 0,
            "total_amount": summary["total_amount"] or 0
        })


    @decorators.action(detail=False, methods=["get"], url_path="daily-sale-summary")
    def daily_sale_summary(self, request):
        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")

        # تبدیل string به date
        try:
            start_date = parse_date(start_date_str)
            end_date = parse_date(end_date_str)
            if not start_date or not end_date or start_date > end_date:
                return response.Response({"detail": "تاریخ‌ها معتبر نیستند."}, status=400)
        except Exception:
            return response.Response({"detail": "فرمت تاریخ باید yyyy-mm-dd باشد."}, status=400)

        # کوئری آیتم‌ها
        order_items = OrderItem.objects.filter(
            is_active=True,
            order__is_active=True,
            order__is_complete=True,
            order__status="paid",
            order__created_at__date__gte=start_date,
            order__created_at__date__lte=end_date
        )

        # فروش به تفکیک روز
        sales_by_day = order_items.annotate(
            sale_date=TruncDate("order__created_at")
        ).values("sale_date").annotate(
            total_quantity=Sum("quantity"),
            total_amount=Sum(F("price") * F("quantity"), output_field=DecimalField())
        )

        # تبدیل به دیکشنری برای lookup سریع
        sales_map = {sale["sale_date"]: sale for sale in sales_by_day}

        # ساخت لیست نهایی با همه تاریخ‌ها حتی تاریخ‌هایی که داده ندارند
        results = []
        current_date = start_date
        while current_date <= end_date:
            sale = sales_map.get(current_date)
            if sale:
                results.append({
                    "sale_date": current_date,
                    "total_quantity": sale["total_quantity"],
                    "total_amount": sale["total_amount"],
                })
            else:
                results.append({
                    "sale_date": current_date,
                    "total_quantity": 0,
                    "total_amount": 0,
                })
            current_date += timedelta(days=1)

        return response.Response(results)