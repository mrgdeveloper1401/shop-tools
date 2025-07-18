from rest_framework import viewsets, permissions

from core.utils.custom_filters import AdminProductCategoryFilter
from core.utils.pagination import AdminTwentyPageNumberPagination
from . import serializers
from product_app.models import Category


class ProductCategoryViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item, only user admin have pagination \n
    filter query --> (category_name, is_active) --> only user admin have filter
    """
    filterset_class = AdminProductCategoryFilter
    pagination_class = AdminTwentyPageNumberPagination

    def get_queryset(self):
        query = Category.objects.all()

        if not self.request.user.is_staff:
            query = query.filter(is_active=True).only(
                "category_name",
            )

        return query

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_serializer_class(self):
        if not self.request.user.is_staff:
            return serializers.UserProductCategorySerializer
        else:
            return serializers.ProductCategorySerializer
