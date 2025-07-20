from django_filters import DateTimeFromToRangeFilter
from django_filters.rest_framework import FilterSet
from django_filters.widgets import RangeWidget

from account_app.models import User, UserAddress
from blog_app.models import CategoryBlog, TagBlog
from core_app.models import Image
from order_app.models import Order
from product_app.models import Category, ProductBrand, ProductImages, ProductAttribute, Product, Tag


class AdminUserInformationFilter(FilterSet):
    class Meta:
        model = User
        fields = (
            "mobile_phone",
            "is_active"
        )

    def filter_queryset(self, queryset):
        if self.request.user.is_staff:
            return super().filter_queryset(queryset)
        return queryset


class AdminUserAddressFilter(FilterSet):
    class Meta:
        model = UserAddress
        fields = (
            "postal_code",
        )

    def filter_queryset(self, queryset):
        if self.request.user.is_staff:
            return super().filter_queryset(queryset)
        return queryset


class UserMobilePhoneFilter(FilterSet):
    class Meta:
        model = User
        fields = (
            "mobile_phone",
        )


class ProductBrandFilter(FilterSet):
    class Meta:
        model = ProductBrand
        fields = {
            "brand_name": ['contains'],
            "is_active": ["exact"],
        }


class AdminCategoryBlogFilter(FilterSet):
    class Meta:
        model = CategoryBlog
        fields = {
            "category_name": ['contains'],
            "is_active": ['exact'],
        }

    def filter_queryset(self, queryset):
        if self.request.user.is_staff:
            return super().filter_queryset(queryset)
        return queryset


class AdminImageFilter(FilterSet):
    created_at = DateTimeFromToRangeFilter(
        field_name="created_at",
        widget=RangeWidget(attrs={'type': 'datetime-local'}),
    )

    class Meta:
        model = Image
        fields = (
            "created_at",
        )


class BlogTagFilter(FilterSet):
    class Meta:
        model = TagBlog
        fields = {
            "tag_name": ['contains'],
        }


class AdminProductCategoryFilter(FilterSet):
    class Meta:
        model = Category
        fields = {
            "category_name": ['contains'],
            "is_active": ['exact'],
        }

    def filter_queryset(self, queryset):
        if self.request.user.is_staff:
            return super().filter_queryset(queryset)
        return queryset


class AdminProductImageFilter(FilterSet):
    class Meta:
        model = ProductImages
        fields = ("is_active",)

    def filter_queryset(self, queryset):
        if self.request.user.is_staff:
            return super().filter_queryset(queryset)
        return queryset


class ProductAttributeFilter(FilterSet):
    class Meta:
        model = ProductAttribute
        fields = {
            "attribute_name": ['contains'],
            "is_active": ['exact'],
        }


class ProductFilter(FilterSet):
    class Meta:
        model = Product
        fields = {
            "product_name": ['contains'],
        }


class ProductHomePageFilter(FilterSet):
    class Meta:
        model = Product
        fields = {
            "product_name": ['contains']
        }


class ProductTagFilter(FilterSet):
    class Meta:
        model = Tag
        fields = {
            "tag_name": ['contains'],
            "is_active": ['exact'],
        }


class OrderFilter(FilterSet):
    class Meta:
        model = Order
        fields = {
            "is_complete": ['exact'],
        }
