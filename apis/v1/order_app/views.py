from datetime import timedelta

import openpyxl
from django.db.models import Count, Q, Prefetch, Sum, F, DecimalField
from django.db.models.functions import TruncDate
from django.http import HttpResponse
from django.utils.dateparse import parse_date
from openpyxl.styles import Font
from rest_framework import viewsets, permissions, generics, mixins, views, exceptions, response, decorators
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from adrf.views import APIView as AsyncApiView
from asgiref.sync import sync_to_async
from django.shortcuts import aget_object_or_404

from core.utils.custom_filters import OrderFilter, ResultOrderFilter, AnalyticsFilter
from core.utils.exceptions import PaymentBaseError
from core.utils.gate_way import verify_payment
from core.utils.pagination import TwentyPageNumberPagination, FlexiblePagination
from order_app.models import Order, OrderItem, ShippingCompany, ShippingMethod, PaymentGateWay, VerifyPaymentGateWay
# from order_app.tasks import send_notification_to_user_after_complete_order
from account_app.models import PrivateNotification
from core.utils.permissions import AsyncIsAuthenticated
from core.utils.sms import send_verify_payment, cancel_verify_payment
from apis.v1.utils.custom_exception import (
    TooManyRequests, 
    PaymentTooManyRequests,
    AmountTooManyRequests,
    CartdIsInvalid,
    SwitchError,
    CartNotFound
)
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
                "items_data",
                "is_reserved",
                "reserved_until",
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
                "is_active",
                "first_name",
                "last_name",
                "phone",
                "description"
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
                "status",
                "first_name",
                "last_name",
                "phone",
                "description"
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
                "product_variant__name",
                "price",
                "created_at",
                "quantity",
                "product_variant_id",
                "product_variant__product_id",
                "product_variant__product__category_id",
                "product_variant__product__product_name"
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
            "address__state__name",
            "is_complete",
            "shipping_id",
            "created_at",
            "updated_at",
            "status",
            "first_name",
            "last_name",
            "phone",
            "description"
        ).annotate(
            user_order_count=Count(
                "profile__orders",
                filter=Q(profile__orders__is_active=True),
                distinct=True
            ),
        ).prefetch_related(
            Prefetch(
                "payment_gateways", queryset=PaymentGateWay.objects.only("order_id", "payment_gateway")
            )
        ).order_by("-id")


class VerifyPaymentGatewayView(AsyncApiView):
    """
    example --> ?success=1&status=2&trackId=4281457157&orderId=121
    """
    permission_classes = (AsyncIsAuthenticated,)

    async def send_sms(phone):
        ...

    async def check_order(self, order_id: int, request, gateway_result):
        try:
            order = await Order.objects.only("id").aget(
                id=order_id,
                # profile__user_id=request.user.id, # TODO, uncomment
                status__in=("processing", "pending")
            )
            return order
        except Order.DoesNotExist:
            output = {
                "order": f"order id {order_id} not found",
                "gateway_result": gateway_result
                }
            raise exceptions.NotFound(output)

    async def check_payment(self, track_id: int, request, result_payment):
        try:
            payment = await PaymentGateWay.objects.only("payment_gateway").aget(
                payment_gateway__trackId=int(track_id),
                user_id=request.user.id
            )
            return payment
        except PaymentGateWay.DoesNotExist:
            raise exceptions.NotFound({
                "status": False,
                "result_payment": result_payment,
                "message": f"Payment with track id {track_id} not found"
            })

    async def func_verify_payment(self, payment_id, result_payment, order_id, request):
        await VerifyPaymentGateWay.objects.acreate(
            payment_gateway_id=payment_id,
            result=result_payment
        )
        updated = await Order.objects.filter(
            id=int(order_id),
            profile__user_id=request.user.id
        ).aupdate(
            is_complete=True,
            status="paid",
            payment_date=timezone.now()
        )

        if updated == 0:
            raise exceptions.NotFound("order not found")
        return True

    async def get(self, request, *args, **kwargs):
        # import ipdb
        # ipdb.set_trace()
        status = request.query_params.get("status", None)
        track_id = request.query_params.get("trackId", None)
        order_id = request.query_params.get("orderId", None)

        if not status:
            raise exceptions.ValidationError(
                {
                    "status": False,
                    "message": "status params is required"
                },
                code="required"
            )

        if not track_id:
            raise exceptions.ValidationError(
                {
                    "status": False,
                    "message": "trackId is required"
                },
                code="required"
            )

        if not order_id:
            raise exceptions.ValidationError(
                {
                    "status": False,
                    "message": "orderId is required"
                }
            )

        # send request into gateway
        verify_req = await verify_payment(int(track_id))
        status_verify_req = verify_req.get('status', None)
        result_verify_req = verify_req.get('result', None)

        # result_verify_req = 201
        # verify_req = {"rest": "test"}
        # status_verify_req = 1

        # accept
        if status_verify_req == 1:
            # filter query PaymentGateway
            get_payment = await self.check_payment(track_id, request, result_verify_req)
    
            await VerifyPaymentGateWay.objects.acreate(
                payment_gateway_id=get_payment.id,
                # payment_gateway_id = 1,
                result=verify_req
                )
            updated = await Order.objects.filter(
                id=int(order_id),
                profile__user=request.user
            ).aupdate(
                is_complete=True,
                status="paid",
                payment_date=timezone.now()
            )

            if updated == 0:
                raise exceptions.NotFound("order not found")
            
            # get tracking code
            order = await Order.objects.only("tracking_code").aget(id=int(order_id))
            tracking_code = order.tracking_code

            # create notification for user
            await PrivateNotification.objects.acreate(
                user_id = request.user.id,
                title = "ثبت سفارش موفق",
                body = "کاربر محترم سفارش شما با موفقیت پرداخت و ثبت شده است",
                notif_type="accept_order"
            )

            # send_notification_to_user_after_complete_order.delay(request.user.mobile_phone)
            await send_verify_payment(request.user.mobile_phone, tracking_code)
            return response.Response(verify_req)
            # send_sms_after_complete_order.delay(request.user.mobile_phone, get_order_traccking_code)

        # check result 201
        if int(result_verify_req) == 201:
            order = await self.check_order(int(order_id), request, result_verify_req)
            payment = await self.check_payment(int(track_id), request, result_verify_req)
            func_verify_payment = await self.func_verify_payment(payment.id, verify_req, order, request)
            return response.Response(verify_req)

        # not accept
        elif status_verify_req == -1:
            # update order
            updated = await Order.objects.filter(
                id=int(order_id),
                profile__user_id=request.user.id
            ).aupdate(
                status="processing"
            )
            if updated == 0:
                raise exceptions.NotFound("order not found")
            return response.Response(
                {
                    "message": "process payment"
                }
            )

        # internal error
        elif status_verify_req == -2:
            # update order
            updated = await Order.objects.filter(
                id=int(order_id),
                profile__user_id=request.user.id
            ).aupdate(
                status="fail"
            )
            if updated == 0:
                raise exceptions.NotFound("order not found")
            return response.Response(
                {
                    "message": "gateway internal error"
                }
            )

        # cancel by user
        elif status_verify_req == 3:
            # update order
            updated = await Order.objects.filter(
                id=int(order_id),
                profile__user_id=request.user.id
            ).aupdate(
                status="fail_by_user"
            )
            if updated == 0:
                raise exceptions.NotFound("order not found")
            # send sms
            order = await Order.objects.only("tracking_code").aget(
                id=int(order_id),
                profile__user_id=request.user.id
            )
            await cancel_verify_payment(request.user.mobile_phone, order.tracking_code)
            return response.Response(
                {
                    "message": "cancel by user"
                }
            )
        
        # to many request
        elif status_verify_req == 7:
            raise TooManyRequests()

        # payment to many request
        elif status_verify_req == 8:
            raise PaymentTooManyRequests()

        # amount to many request
        elif status_verify_req == 9:
            raise AmountTooManyRequests()
        
        # issuer not valid
        elif status_verify_req == 10:
            raise CartdIsInvalid()

        # switch error
        elif status_verify_req == 11:
            raise SwitchError()
        
        # cat is not access
        elif status_verify_req == 12:
            raise CartNotFound()
        
        # elif status_verify_req == 2:
        #     ...

        else:
            raise exceptions.NotAcceptable()

        return response.Response(verify_req)


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
    @decorators.action(detail=False, methods=["get"], url_path="daily-sale-summary-export")
    def export_daily_sale_summary(self, request):
        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")

        try:
            start_date = parse_date(start_date_str)
            end_date = parse_date(end_date_str)
            if not start_date or not end_date or start_date > end_date:
                return response.Response({"detail": "تاریخ‌ها معتبر نیستند."}, status=400)
        except Exception:
            return response.Response({"detail": "فرمت تاریخ باید yyyy-mm-dd باشد."}, status=400)

        order_items = OrderItem.objects.filter(
            is_active=True,
            order__is_active=True,
            order__is_complete=True,
            order__status="paid",
            order__created_at__date__gte=start_date,
            order__created_at__date__lte=end_date
        )

        sales_by_day = order_items.annotate(
            sale_date=TruncDate("order__created_at")
        ).values("sale_date").annotate(
            total_quantity=Sum("quantity"),
            total_amount=Sum(F("price") * F("quantity"), output_field=DecimalField())
        )

        sales_map = {sale["sale_date"]: sale for sale in sales_by_day}

        # ساخت داده‌های خروجی
        results = []
        current_date = start_date
        while current_date <= end_date:
            sale = sales_map.get(current_date)
            results.append({
                "sale_date": current_date.strftime("%Y-%m-%d"),
                "total_quantity": sale["total_quantity"] if sale else 0,
                "total_amount": float(sale["total_amount"]) if sale else 0.0,
            })
            current_date += timedelta(days=1)

        # ایجاد فایل اکسل
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Daily Sales"

        # عنوان ستون‌ها
        ws.append(["Sale Date", "Total Quantity", "Total Amount"])
        for cell in ws[1]:
            cell.font = Font(bold=True)

        # داده‌ها
        for row in results:
            ws.append([row["sale_date"], row["total_quantity"], row["total_amount"]])

        # خروجی به صورت فایل
        response_excel = HttpResponse(
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response_excel[
            "Content-Disposition"] = f'attachment; filename="daily_sales_{start_date_str}_to_{end_date_str}.xlsx"'
        wb.save(response_excel)

        return response_excel
