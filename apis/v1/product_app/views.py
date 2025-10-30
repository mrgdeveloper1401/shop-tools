from django.db.models import Prefetch, Min, Max, OuterRef, Subquery
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, generics, filters, mixins
from django.core.cache import cache

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
    pagination_class = TwentyPageNumberPagination

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
    # TODO, better performance create product
    """
    search_filter --> (product_name, sku) \n
    pagination --> 20 item
    """
    pagination_class = TwentyPageNumberPagination
    filterset_class = ProductFilter
    ordering_fields = ("total_sale",)
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)

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
        base_query = Product.objects.filter(category_id=self.kwargs["category_pk"]).prefetch_related(
            Prefetch(
                "variants__product_variant_discounts", queryset=ProductDiscount.objects.select_related(
                    "product_variant__product"
                ).only(
                    "amount",
                    "discount_type",
                    "product_variant_id",
                    "product_variant__product_id",
                    "product_variant__stock_number",
                    "product_variant__name",
                    "product_variant__price",
                )
            )
        )

        if self.request.user.is_staff:
            base_query = base_query.select_related(
                "product_brand",
                "category"
            ).only(
                "total_sale",
                "product_id_ba_salam",
                "tags__tag_name",
                "product_brand__brand_name",
                "category__category_name",
                "is_active",
                "product_slug",
                "description",
                "product_name",
                "description_slug",
                "sku",
                "base_price",
                "updated_at",
                "in_person_purchase"
            ).prefetch_related(
                    Prefetch(
                "product_product_image", queryset=ProductImages.objects.select_related("image").only(
                        "image__image",
                        "image__image_id_ba_salam",
                        "alt_text_image",
                        "order",
                        "product_id",
                        "updated_at"
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
                )
            )
            return base_query

        else:
            query = base_query.filter(is_active=True).prefetch_related(
                    Prefetch(
                        "product_product_image", queryset=ProductImages.objects.select_related("image").only(
                            "image__image",
                            "order",
                            "product_id",
                            "alt_text_image",
                            "image__image_id_ba_salam",
                            "updated_at"
                        ).filter(
                            is_active=True
                        )
                    )
                )

            if self.action == "list":
                return query.only(
                    "updated_at",
                    "product_name",
                    "base_price",
                    "description_slug",
                    "product_slug",
                    "category_id",
                    "in_person_purchase"
                )
            else:
                return query.prefetch_related(
                    Prefetch(
                        "tags", queryset=Tag.objects.filter(is_active=True).only("tag_name")
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
                    "product_brand__brand_name",
                    "tags",
                    "product_slug",
                    "description_slug",
                    "sku",
                    "updated_at",
                    "in_person_purchase"
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
        base_query = ProductBrand.objects.select_related("brand_image")

        if self.request.user.is_staff:
            return base_query.only(
                "brand_image__image",
                "brand_name",
                "is_active"
            )
        else:
            return base_query.filter(
                is_active=True
            ).only(
                "brand_name", "brand_image__image"
            )


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
            "image__image_id_ba_salam",
            "image__wp_image_url",
            "product_id"
        )


class ProductVariantViewSet(viewsets.ModelViewSet):
    """
    permission --> only admin user
    """
    serializer_class = serializers.AdminProductVariantSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
         return ProductVariant.objects.select_related(
             "product"
         ).filter(product_id=self.kwargs['product_pk']).only(
             "product__product_name",
             "price",
             "stock_number",
             "is_active",
             "name",
             "old_price",
             "short_desc",
             "subtitle",
            #  "in_person_purchase"
         )


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


class ProductAttributesValuesViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ProductAttributeSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        return ProductAttributeValues.objects.filter(
            product_id=self.kwargs['product_pk']
        ).select_related(
                "attribute"
            ).only(
                "attribute__attribute_name",
                "value",
                "product_id"
        )




class ProductListHomePageView(generics.ListAPIView):
    """
    pagination --> 20 item \n
    filter query --> product_name, tag, min_price, max_price, category_name, price_range
    """
    ordering_fields = ("id", "total_sale")
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
        "product_brand__brand_name",
        "total_sale",
        "in_person_purchase"
    ).select_related(
        "product_brand"
    ).prefetch_related(
        Prefetch(
            "product_product_image", queryset=ProductImages.objects.filter(
                is_active=True
            ).select_related(
                "image"
            ).only(
                "image__image",
                "image__wp_image_url",
                "image__image_id_ba_salam",
                "order",
                "product_id",
                "alt_text_image",
                "updated_at"
            )
        ),
        Prefetch(
            "variants", queryset=ProductVariant.objects.filter(
                is_active=True
            ).only(
                "price",
                "product_id",
                "stock_number",
                "name",
                # "in_person_purchase"
            )
        ),
        Prefetch(
            "variants__product_variant_discounts", queryset=ProductDiscount.objects.only(
                "amount",
                "discount_type",
                "product_variant_id"
            ).valid_discount()
        )
    )
    pagination_class = TwentyPageNumberPagination
    filterset_class = ProductHomePageFilter

    def get_serializer_class(self):
        if self.request.user.is_staff:
            return serializers.AdminProductListHomePageSerializer
        else:
            return serializers.ProductListHomePageSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        # Subquery برای گرفتن قیمت اولین variant فعال هر محصول
        first_variant_price = ProductVariant.objects.filter(
            product_id=OuterRef('pk'),
            is_active=True
        ).order_by('id').values('price')[:1]  # مرتب کردن بر اساس ID (می‌توانید به price تغییر دهید)

        # اضافه کردن annotation به کوئری اصلی
        queryset = queryset.annotate(
            first_variant_price=Subquery(first_variant_price)
        )

        # اگر پارامتر ordering وجود داشت، از آن استفاده می‌کنیم
        ordering = self.request.query_params.get('ordering', '')
        if ordering == 'first_variant_price':
            queryset = queryset.order_by('first_variant_price')
        elif ordering == '-first_variant_price':
            queryset = queryset.order_by('-first_variant_price')

        return queryset


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
        ).order_by("-id")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['product_pk'] = self.kwargs['product_pk']
        context['category_pk'] = self.kwargs['category_pk']
        return context

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAuthenticated, IsOwnerOrReadOnly)
        return super().get_permissions()


class CategoryNameView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True).select_related(
        "category_image"
    ).only(
        "category_image__image",
        "category_name"
    )
    serializer_class = serializers.ListCategoryNameSerializer


class AdminTagNameView(generics.ListAPIView):
    queryset = Tag.objects.filter(is_active=True).only("tag_name")
    serializer_class = serializers.AdminTagNameSerializer


class BrandNameView(generics.ListAPIView):
    serializer_class = serializers.ListBrandNameSerializer
    queryset = ProductBrand.objects.filter(is_active=True).select_related(
        "brand_image"
    ).only(
        "brand_image__image",
        "brand_name"
    )


class SeoProductViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = serializers.SeoProductSerializer

    def get_queryset(self):
        query = Product.objects.filter(
            is_active=True
        ).only(
            "product_name",
            "product_slug",
            "created_at",
            "updated_at",
            "category_id"
        )
        cache_key = "seo_product_list_response"
        cache_response = cache.get(cache_key)
        if cache_response:
            return cache_response
        else:
            cache_response = cache.set(cache_key, query, 60 * 60 * 24)
            return query
