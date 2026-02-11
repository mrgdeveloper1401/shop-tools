from django.db.models import Prefetch, Subquery, OuterRef
from rest_framework import generics

from core.utils.pagination import TwentyPageNumberPagination
from discount_app.models import ProductDiscount
from product_app.models import ProductVariant, ProductImages
from .serializers import ProductListHomePageSerializer


class ProductListHomePageView(generics.ListAPIView):
    serializer_class = ProductListHomePageSerializer
    pagination_class = TwentyPageNumberPagination

    def get_queryset(self):
        # fields
        product_image_fields = (
            "image__image",
            "order",
            "alt_text_image",
            "product_id",
        )
        product_discount_field = (
            "id",
            "product_variant_id",
            "amount",
            "discount_type",
        )
        product_variant_fields = (
            "product__category__id",
            # "product__category_name",
            "product__product_slug",
            "product__description_slug",
            "product__product_name",
            "name",
            "price",
            "stock_number",
            "created_at",
            "updated_at",
        )

        # last discount
        latest_discount_subquery = ProductDiscount.objects.filter(
            id__in=ProductDiscount.objects.filter(
                product_variant=OuterRef("product_variant")
            ).valid_discount().order_by("-id").values_list("id", flat=True)
        ).only(*product_discount_field)

        return ProductVariant.objects.filter(
            is_active=True
        ).select_related(
            "product__category"
        ).prefetch_related(
            Prefetch(
                "product__product_product_image", queryset=ProductImages.objects.filter(
                    is_active=True
                ).select_related("image").only(*product_image_fields)
            ),
            Prefetch(
                "product_variant_discounts",
                queryset=latest_discount_subquery,
                to_attr="discounts",
            )
        ).only(*product_variant_fields)
