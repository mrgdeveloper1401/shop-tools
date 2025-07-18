from django.db.models import Prefetch
from rest_framework import viewsets, permissions

from core.utils.custom_filters import AdminProductCategoryFilter, ProductBrandFilter, AdminProductImageFilter
from core.utils.pagination import AdminTwentyPageNumberPagination, TwentyPageNumberPagination
from . import serializers
from product_app.models import Category, Product, ProductBrand, ProductImages, Tag


class ProductCategoryViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item, only user admin have pagination \n
    filter query --> (category_name, is_active) --> only user admin have filter
    """
    filterset_class = AdminProductCategoryFilter
    pagination_class = AdminTwentyPageNumberPagination

    def get_queryset(self):
        if not self.request.user.is_staff:
            return Category.objects.filter(is_active=True).only("category_name",)
        else:
            return Category.objects.defer(
                "updated_at",
                "created_at"
            )

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
    pagination_class = TwentyPageNumberPagination

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.ProductSerializer
        else:
            if self.action == "list":
                return serializers.UserListProductSerializer
            else:
                return serializers.UserRetrieveProductSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        base_query = Product.objects.filter(category_id=self.kwargs["category_pk"])

        if self.request.user.is_staff:
            return Product.objects.select_related(
                "product_brand"
            ).only(
                "tags__tag_name",
                "product_brand__brand_name",
                "category_id",
                "is_active",
                "product_slug",
                "description",
                "social_links",
                "product_name"
            ).prefetch_related(
                Prefetch(
                    "tags", queryset=Tag.objects.only("tag_name")
                )
            )

        else:
            query = base_query.filter(is_active=True).prefetch_related(
                    Prefetch(
                        "product_product_image", queryset=ProductImages.objects.filter(
                            is_active=True
                        ).select_related("image").only(
                            "order",
                            "image__image",
                            "product_id"
                        )
                    ),
                    Prefetch(
                        "tags", queryset=Tag.objects.filter(is_active=True).only("tag_name")
                    )
                )

            if self.action == "list":
                return query.only(
                    "product_name",
                    "price",
                    "product_images"
                )
            else:
                return query.only(
                    "product_name",
                    "description",
                    "price",
                    "social_links",
                    "product_brand_id",
                    "attributes_id",
                    "tags",
                    "product_images"
                )


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


class ProductImageViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.AdminProductImageSerializer
    permission_classes = (permissions.IsAdminUser,)
    queryset = ProductImages.objects.select_related(
        "product",
        "image"
    ).only(
        "product__product_name",
        "image_id",
        "order",
        "is_active",
        "image__image"
    )
    filterset_class = AdminProductImageFilter
