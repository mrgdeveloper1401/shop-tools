from rest_framework import viewsets, permissions

from core.utils.custom_filters import AdminProductCategoryFilter, ProductBrandFilter
from core.utils.pagination import AdminTwentyPageNumberPagination, TwentyPageNumberPagination
from . import serializers
from product_app.models import Category, Product, ProductBrand


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


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ProductSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        query = Product.objects.filter(category_id=self.kwargs["category_pk"])

        if not self.request.user.is_staff:
            query = query.filter(is_active=True).defer(
                "is_deleted",
                "deleted_at",
                "is_active",
                "created_at",
                "updated_at",
            )

        return query


class ProductBrandViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item for normal user and admin user \n
    filter query --> (category_name, is_active)
    """
    pagination_class = TwentyPageNumberPagination
    filterset_class = ProductBrandFilter

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminProductBrandSerializer
        else:
            return serializers.UserProductBrandSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return ProductBrand.objects.defer("is_deleted", "deleted_at")
        else:
            return ProductBrand.objects.filter(is_active=True).only("brand_name",)
