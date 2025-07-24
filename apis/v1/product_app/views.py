from django.db.models import Prefetch
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, generics, filters

from account_app.models import Profile
from core.utils.custom_filters import (
    AdminProductCategoryFilter,
    ProductBrandFilter,
    AdminProductImageFilter,
    AttributeFilter,
    ProductFilter,
    ProductHomePageFilter,
    ProductTagFilter
)
from core.utils.pagination import TwentyPageNumberPagination, FlexiblePagination
from core.utils.permissions import IsOwnerOrReadOnly
from discount_app.models import ProductDiscount
from . import serializers
from product_app.models import (
    Category,
    Product,
    ProductBrand,
    ProductImages,
    Tag,
    ProductVariant,
    Attribute,
    AttributeValue,
    ProductAttributeValues,
    ProductComment
)

class ProductCategoryViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item, only user admin have pagination \n
    filter query --> (category_name, is_active) --> only user admin have filter
    """
    filterset_class = AdminProductCategoryFilter
    pagination_class = FlexiblePagination

    def get_queryset(self):
        base_query = Category.objects.select_related("category_image")
        if not self.request.user.is_staff:
            return base_query.only("category_name", "category_image__image")
        else:
            return base_query.only(
                "category_image__image",
                "category_name",
                "path",
                "depth",
                "numchild",
                "is_active",
                "created_at",
                "updated_at",
                "category_slug"
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


class CreateAdminProductView(generics.CreateAPIView):
    serializer_class = serializers.ProductSerializer
    permission_classes = (permissions.IsAdminUser,)
    queryset = Product.objects.select_related(
            "product_brand"
        ).only(
            "tags__tag_name",
            "product_brand__brand_name",
            "category_id",
            "is_active",
            "product_slug",
            "description",
            # "social_links",
            "product_name",
            "description_slug",
            "sku"
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


class ProductViewSet(viewsets.ModelViewSet):
    """
    search_filter --> (product_name, sku) \n
    pagination --> 20 item
    """
    pagination_class = TwentyPageNumberPagination
    filterset_class = ProductFilter

    def get_serializer_class(self):
        if self.request.user.is_staff:
            if self.action == "list":
                return serializers.ProductSerializer
            else:
                return serializers.RetrieveAdminProductSerializer
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
            base_query = base_query.select_related(
                "product_brand",
                "category"
            ).only(
                "tags__tag_name",
                "product_brand__brand_name",
                "category__category_name",
                "is_active",
                "product_slug",
                "description",
                # "social_links",
                "product_name",
                "description_slug",
                "sku",
                "base_price"
            ).prefetch_related(
                    Prefetch(
                "product_product_image", queryset=ProductImages.objects.select_related("image").only(
                    "image__image",
                    # "image__alt_text",
                    "order",
                    "product_id"
                        )
                ),
                Prefetch(
                "tags", queryset=Tag.objects.only("tag_name")
                ),
                Prefetch(
                    "attributes", queryset=ProductAttributeValues.objects.select_related("attribute").only(
                        "attribute__attribute_name",
                        "product_id",
                        "value"
                    )
                ),
                Prefetch(
                    "variants", queryset=ProductVariant.objects.only(
                        "price",
                        "product_id",
                        "stock_number"
                    )
                )
            )
            # print(base_query)
            return base_query

            # if self.action == "list":
                # return base_query
            # else:
                # print(base_query)
                # print(self.action)
                # return base_query.prefetch_related(
                #     Prefetch(
                #         "tags", queryset=Tag.objects.only("tag_name")
                #     ),
                    # Prefetch(
                    #     "variants", queryset=ProductVariant.objects.only("product_id", "price").prefetch_related(
                    #         Prefetch(
                    #             "attributes", queryset=ProductAttributeValues.objects.select_related(
                    #                 "attribute", "value"
                    #             ).only(
                    #                 "variant_id",
                    #                 "attribute__attribute_name",
                    #                 "value__attribute_value"
                    #             )
                    #         )
                    #     )
                    # )
                # )

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
                    "base_price",
                    # "product_images"
                ).prefetch_related(
                    # Prefetch(
                    #     "product_discounts", queryset=ProductDiscount.objects.only(
                    #         "discount_type",
                    #         "amount",
                    #         "product_id"
                    #     ).valid_discount()
                    # )
                )
            else:
                return query.prefetch_related(
                    Prefetch(
                        "tags", queryset=Tag.objects.filter(is_active=True).only("tag_name")
                    ),
                    Prefetch(
                        "variants", queryset=ProductVariant.objects.filter(
                            is_active=True
                        ).only(
                            "price",
                            "product_id",
                            "stock_number",
                            "name"
                        ).prefetch_related(
                            Prefetch(
                                "product_variant_discounts", queryset=ProductDiscount.objects.only(
                                    "amount",
                                    "discount_type",
                                    "product_variant_id"
                                ).valid_discount()
                            )
                        )
                    ),
                    Prefetch(
                        "attributes", queryset=ProductAttributeValues.objects.select_related(
                            "attribute"
                        ).only(
                            "attribute__attribute_name",
                            "value",
                            "product_id"
                        )
                    )
                ).select_related(
                    "product_brand"
                ).only(
                    "base_price",
                    "product_name",
                    "description",
                    # "social_links",
                    "product_brand__brand_name",
                    "tags",
                    "product_slug",
                    "description_slug"
                )


class ProductBrandViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item for normal user and admin user \n
    filter query --> (category_name, is_active)
    """
    pagination_class = FlexiblePagination
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


class AdminCreateProductImage(generics.CreateAPIView):
    serializer_class = serializers.AdminProductImageSerializer
    permission_classes = (permissions.IsAdminUser,)

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
            "image__image",
            "product_id"
        )


class ProductVariantViewSet(viewsets.ModelViewSet):
    """
    permission --> only admin user
    """
    serializer_class = serializers.AdminProductVariantSerializer
    permission_classes = (permissions.IsAdminUser,)

    # def get_serializer_class(self):
    #     if self.request.user.is_staff:
    #         return serializers.AdminProductVariantSerializer

    # def get_permissions(self):
    #     if self.action in ("create", "update", "partial_update", "destroy"):
    #         self.permission_classes = (permissions.IsAdminUser,)
    #     return super().get_permissions()

    def get_queryset(self):
         return ProductVariant.objects.select_related(
             "product"
         ).filter(product_id=self.kwargs['product_pk']).only(
             "product__product_name",
             "price",
             "stock_number",
             "is_active",
             "name"
         )

        # prefetch_related(
        #     Prefetch(
        #         "attributes", queryset=ProductAttributeValues.objects.select_related(
        #             "attribute",
        #             "value",
        #         ).only(
        #             "attribute__attribute_name",
        #             "value__attribute_value",
        #             "variant_id"
        #         )
        #     )
        # )

        # filter admin user
        # if self.request.user.is_staff:
        #     return base_query.defer("is_deleted", "deleted_at", "created_at", "updated_at")
        # pass


class AttributeViewSet(viewsets.ModelViewSet):
    filterset_class = AttributeFilter

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminAttributeSerializer
        pass

    def get_queryset(self):
        base_query = Attribute.objects.defer(
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at"
        )#.prefetch_related(
        #     Prefetch(
        #         "attribute_values", queryset=ProductAttributeValue.objects.only(
        #             "attribute_value",
        #         )
        #     )
        # )

        # filter staff user
        if self.request.user.is_staff:
            return base_query


class AttributeValueViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminAttributeValueSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        base_query = AttributeValue.objects.defer(
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at"
        )
        # filter staff user
        if self.request.user.is_staff:
            return base_query


# class AdminCreateProductAttributeView(generics.CreateAPIView):
#     serializer_class = serializers.AdminProductAttributeSerializer
#     permission_classes = (permissions.IsAdminUser,)
#     queryset = ProductAttributeValues.objects.defer(
#         "is_deleted",
#         "deleted_at",
#         "created_at",
#         "updated_at"
#     )


class ProductAttributesValuesViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminProductAttributeSerializer

    def get_queryset(self):
        base_query = ProductAttributeValues.objects.filter(
            product_id=self.kwargs['product_pk']
        ).defer(
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at"
        )
        if self.request.user.is_staff:
            return base_query


class ProductListHomePageView(generics.ListAPIView):
    """
    pagination --> 20 item \n
    filter query --> product_name, tag, min_price, max_price, category_name, price_range
    """
    ordering_fields = ("id", "variants__price")
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    queryset = Product.objects.filter(is_active=True).only(
        "product_name",
        "category_id",
        "product_name",
        "product_slug",
        "description_slug",
        "created_at",
        "updated_at",
        "base_price",
        "sku",
    ).prefetch_related(
        Prefetch(
            "product_product_image", queryset=ProductImages.objects.filter(
                is_active=True
            ).select_related(
                "image"
            ).only(
                "image__image",
                "order",
                "product_id",
                "alt_text_image"
            )
        ),
        Prefetch(
            "variants", queryset=ProductVariant.objects.filter(
                is_active=True
            ).only(
                "price",
                "product_id",
                "stock_number",
                "name"
            ).prefetch_related(
                Prefetch(
                    "product_variant_discounts", queryset=ProductDiscount.objects.only(
                        "amount",
                        "discount_type",
                        "product_variant_id"
                    ).valid_discount()
                )
            )
        ),
        # Prefetch(
        #     "product_discounts", queryset=ProductDiscount.objects.only(
        #         "product_id",
        #         "amount",
        #         "discount_type"
        #     ).valid_discount()
        # )
    )
    serializer_class = serializers.ProductListHomePageSerializer
    pagination_class = TwentyPageNumberPagination
    filterset_class = ProductHomePageFilter


class TagViewSet(viewsets.ModelViewSet):
    """
    filter query --> tag_name and is_active \n
    pagination --> 20 item \n
    permissions --> method post and put and patch and deleted only user admin
    """
    filterset_class = ProductTagFilter
    pagination_class = FlexiblePagination

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminTagSerializer
        else:
            return serializers.UserProductTagSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Tag.objects.only(
                "tag_name",
                "is_active",
                "created_at",
                'updated_at'
            )
        else:
            return Tag.objects.filter(is_active=True).only("tag_name",)

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()


class ProductCommentViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item
    """
    serializer_class = serializers.ProductCommentSerializer
    pagination_class = TwentyPageNumberPagination

    def get_queryset(self):
        return ProductComment.objects.filter(
            product_id=self.kwargs['product_pk'],
        ).select_related(
            "user",
        ).prefetch_related(
            Prefetch(
                "user__profile", queryset=Profile.objects.only("first_name", "last_name", "user_id")
            )
        ).only(
            "path",
            "numchild",
            "depth",
            "user__is_staff",
            "created_at",
            "updated_at",
            "product_id",
            "comment_body"
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['product_pk'] = self.kwargs['product_pk']
        return context

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly)
        return super().get_permissions()


class AdminCategoryNameView(generics.ListAPIView):
    queryset = Category.objects.only("category_name")
    serializer_class = serializers.AdminCategoryNameSerializer
    permission_classes = (permissions.IsAdminUser,)


class AdminTagNameView(generics.ListAPIView):
    queryset = Tag.objects.only("tag_name")
    serializer_class = serializers.AdminTagNameSerializer
    permission_classes = (permissions.IsAdminUser,)


class AdminBrandNameView(generics.ListAPIView):
    serializer_class = serializers.AdminBrandNameSerializer
    permission_classes = (permissions.IsAdminUser,)
    queryset = ProductBrand.objects.only("brand_name")
