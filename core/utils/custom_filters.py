from django.utils import timezone
from django_filters import DateTimeFromToRangeFilter, DateFilter
from django_filters.rest_framework import FilterSet, NumberFilter, RangeFilter, BooleanFilter
from django_filters.widgets import RangeWidget

from account_app.models import User, UserAddress, PrivateNotification
from blog_app.models import CategoryBlog, TagBlog
from core_app.models import Image
from discount_app.models import Coupon
from order_app.models import Order
from product_app.models import Category, ProductBrand, ProductImages, Attribute, Product, Tag


class AdminUserInformationFilter(FilterSet):
    class Meta:
        model = User
        fields = {
            "mobile_phone": ["contains",],
            "is_active": ['exact',],
        }

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


class AttributeFilter(FilterSet):
    class Meta:
        model = Attribute
        fields = {
            "attribute_name": ['contains'],
            "is_active": ['exact'],
        }


class ProductFilter(FilterSet):
    class Meta:
        model = Product
        fields = {
            "product_name": ['contains'],
            "sku": ['contains'],
            "is_active": ['exact']
        }


class ProductHomePageFilter(FilterSet):
    more_price = NumberFilter(method='more_price_filter')
    min_price = NumberFilter(method="min_price_filter")
    price = RangeFilter(field_name='variants__price', label='Price range')
    has_discount = BooleanFilter(method='filter_has_discount', label="Has discount")

    class Meta:
        model = Product
        fields = {
            "product_name": ['contains'],
            "category__category_name": ['contains'],
            "tags__tag_name": ['contains'],
        }

    def more_price_filter(self, queryset, name, value):
        return queryset.filter(
            variants__price__gte=value,
            variants__is_active=True
        ).distinct()

    def min_price_filter(self, queryset, name, value):
        return queryset.filter(
            variants__price__lte=value,
            variants__is_active=True
        ).distinct()

    def filter_has_discount(self, queryset, name, value):
        if value:
            return queryset.filter(
                variants__product_variant_discounts__is_active=True,
                variants__product_variant_discounts__start_date__lte=timezone.now(),
                variants__product_variant_discounts__end_date__gte=timezone.now()
            ).distinct()
        return queryset

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
            "is_active": ['exact'],
            "status": ['iexact'],
        }


class AdminCouponFilter(FilterSet):
    class Meta:
        model = Coupon
        fields = {
            "code": ['contains'],
            "is_active": ['exact']
        }


class ResultOrderFilter(FilterSet):
    start_date_created_at = DateFilter(lookup_expr="gte", field_name="created_at")
    end_date_created_at = DateFilter(lookup_expr="lte", field_name="created_at")

    class Meta:
        model = Order
        fields = {
            "profile__user__mobile_phone": ['contains'],
            "is_complete": ['exact'],
            "status": ['exact']
        }


class PrivateNotificationFilter(FilterSet):
    class Meta:
        model = PrivateNotification
        fields = {
            "notif_type": ['iexact'],
            "is_read": ['exact']
        }
