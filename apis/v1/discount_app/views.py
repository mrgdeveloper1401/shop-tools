from rest_framework import viewsets, permissions

from core.utils.custom_filters import AdminCouponFilter
from core.utils.pagination import TwentyPageNumberPagination
from . import serilizers
from discount_app.models import Coupon


class CouponViewSet(viewsets.ModelViewSet):
    serializer_class = serilizers.AdminCouponSerializer
    permission_classes = (permissions.IsAdminUser,)
    queryset = Coupon.objects.defer("deleted_at", "is_deleted")
    filterset_class = AdminCouponFilter
    pagination_class = TwentyPageNumberPagination