from django_filters.rest_framework import FilterSet

from product_app.models import ProductVariant


class UserProductVariantsFilter(FilterSet):
    class Meta:
        model = ProductVariant
        fields = {
            "name": ("icontains",)
        }
