from django.db.models import OuterRef, Exists
from django_filters.rest_framework import FilterSet, BooleanFilter, NumberFilter

from discount_app.models import ProductDiscount
from product_app.models import ProductVariant


class ProductVariantFilter(FilterSet):
    has_discount = BooleanFilter(method='filter_has_discount', label="has_discount")
    category_id = NumberFilter(method='filter_category_id', label="category_id")
    brand_id = NumberFilter(method='filter_brand_id', label="brand_id")
    null_sku = BooleanFilter(method='filter_null_sku', label="null_sku")

    class Meta:
        model = ProductVariant
        fields = {
            "name": ("icontains",),
            "id": ("exact",)
        }

    def filter_null_sku(self, queryset, name, value):
        if value:
            return queryset.filter(sku__isnull=True)
        else:
            return queryset.filter(sku__isnull=False)

    def filter_has_discount(self, queryset, name, value):
        if value is None:
            return queryset
        else:
            active_discount = ProductDiscount.objects.filter(
                product_variant=OuterRef("pk"),
            ).valid_discount()

            if value is True:
                return queryset.filter(Exists(active_discount))
            else:
                return queryset.filter(~Exists(active_discount))

    def filter_category_id(self, queryset, name, value):
        if value is None:
            return queryset
        else:
            return queryset.filter(product__category_id=int(value))

    def filter_brand_id(self, queryset, name, value):
        if value is None:
            return queryset
        else:
            return queryset.filter(product__product_brand=int(value))
