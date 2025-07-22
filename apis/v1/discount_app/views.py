from django.db.models import F
from rest_framework import viewsets, permissions, views, response, status
from django.utils import timezone

from core.utils.custom_filters import AdminCouponFilter
from core.utils.pagination import TwentyPageNumberPagination
from . import serilizers
from discount_app.models import Coupon, ProductDiscount


class CouponViewSet(viewsets.ModelViewSet):
    serializer_class = serilizers.AdminCouponSerializer
    permission_classes = (permissions.IsAdminUser,)
    queryset = Coupon.objects.defer("deleted_at", "is_deleted")
    filterset_class = AdminCouponFilter
    pagination_class = TwentyPageNumberPagination


class DiscountViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item \n
    permission --> only user_admin access these view
    """
    serializer_class = serilizers.AdminDiscountSerializer
    permission_classes = (permissions.IsAdminUser,)
    pagination_class = TwentyPageNumberPagination

    def get_queryset(self):
        return ProductDiscount.objects.defer("deleted_at", "is_deleted").filter(
            product_variant_id=self.kwargs["variant_pk"],
        )

    # def get_serializer_context(self):
    #     context = super().get_serializer_context()
    #     context['product_pk'] = self.kwargs['product_pk']
    #     context['variant_pk'] = self.kwargs['variant_pk']
    #     return context


class ValidCouponCodeView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        code = request.GET.get("code", None)

        if code:
            coupon = Coupon.objects.filter(
                code=code,
                is_active=True,
                valid_from__lte=timezone.now(),
                valid_to__gte=timezone.now(),
                number_of_uses__lt=F("maximum_use")
            ).only("id")
            if coupon:
                return response.Response(
                    {
                        "data": "ok"
                    }
                )
            else:
                return response.Response(
                    {
                        "data": "invalid"
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
        return response.Response()
