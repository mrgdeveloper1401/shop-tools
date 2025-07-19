from django.db.models import Prefetch
from rest_framework import viewsets, permissions

from core.utils.custom_filters import AdminProductCategoryFilter, ProductBrandFilter, AdminProductImageFilter, \
    ProductAttributeFilter, ProductFilter
from core.utils.pagination import AdminTwentyPageNumberPagination, TwentyPageNumberPagination
from . import serializers
from product_app.models import Category, Product, ProductBrand, ProductImages, Tag, ProductVariant, ProductAttribute, \
    ProductAttributeValue, VariantAttribute


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
    """
    search_filter --> product_name \n
    pagination --> 20 item
    """
    pagination_class = TwentyPageNumberPagination
    filterset_class = ProductFilter

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
                ),
                Prefetch(
                    "product_product_image", queryset=ProductImages.objects.select_related("image").only(
                        "image__image",
                        "order",
                        "product_id"
                    )
                )
            )

        else:
            query = base_query.filter(is_active=True).prefetch_related(
                    Prefetch(
                        "product_product_image", queryset=ProductImages.objects.select_related("image").only(
                            "image__image",
                            "order",
                            "product_id"
                        ).filter(
                            is_active=True
                        )
                    )
                )

            if self.action == "list":
                return query.only(
                    "product_name",
                    # "price",
                    # "product_images"
                )
            else:
                return query.prefetch_related(
                    Prefetch(
                        "tags", queryset=Tag.objects.filter(is_active=True).only("tag_name")
                    ),
                ).select_related(
                    "product_brand"
                ).only(
                    "product_name",
                    "description",
                    "social_links",
                    "product_brand__brand_name",
                    "tags",
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
            return ProductBrand.objects.defer("is_deleted", "deleted_at", "created_at", "updated_at")
        else:
            return ProductBrand.objects.filter(is_active=True).only("brand_name",)


class ProductImageViewSet(viewsets.ModelViewSet):
    """
    this view can only user admin access \n
    filter query --> field(is_active)
    """
    serializer_class = serializers.AdminProductImageSerializer
    permission_classes = (permissions.IsAdminUser,)
    filterset_class = AdminProductImageFilter

    def get_queryset(self):
        return ProductImages.objects.filter(
            product_id=self.kwargs['product_pk']
        ).select_related(
            "image"
        ).only(
            "order",
            "is_active",
            "image__image"
        )


class ProductVariantViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminProductVariantSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        base_query = ProductVariant.objects.filter(product_id=self.kwargs['product_pk']).prefetch_related(
            Prefetch(
                "attributes", queryset=VariantAttribute.objects.select_related(
                    "attribute",
                    "value",
                ).only(
                    "attribute__attribute_name",
                    "value__attribute_value",
                    "variant_id"
                )
            )
        )

        # filter admin user
        if self.request.user.is_staff:
            return base_query.defer("is_deleted", "deleted_at", "created_at", "updated_at")
        pass


class ProductAttributeViewSet(viewsets.ModelViewSet):
    filterset_class = ProductAttributeFilter

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminProductAttributeSerializer
        pass

    def get_queryset(self):
        base_query = ProductAttribute.objects.defer(
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at"
        ).prefetch_related(
            Prefetch(
                "attribute_values", queryset=ProductAttributeValue.objects.only(
                    "attribute_value",
                )
            )
        )

        # filter staff user
        if self.request.user.is_staff:
            return base_query


class ProductAttributeValueViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminProductAttributeValueSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        base_query = ProductAttributeValue.objects.defer(
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at"
        )
        # filter staff user
        if self.request.user.is_staff:
            return base_query


class VariantAttributeViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminVariantAttributeSerializer

    def get_queryset(self):
        base_query = VariantAttribute.objects.filter(
            variant_id=self.kwargs['variant_pk']
        ).defer(
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at"
        )
        if self.request.user.is_staff:
            return base_query
