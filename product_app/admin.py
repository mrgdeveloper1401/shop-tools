from django.contrib import admin
from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory
from django.utils.translation import gettext_lazy as _

from core_app.admin import CoreAdminMixin
from .models import (
    Category,
    Product,
    Attribute,
    AttributeValue,
    FavoriteProduct,
    ProductImages,
    ProductBrand,
    Tag,
    ProductComment,
    ProductVariant,
    ProductVariantAttributeValues
)


# custom filter
class ProductSku(admin.SimpleListFilter):
    title = 'SKU'
    parameter_name = 'sku'

    def lookups(self, request, model_admin):
        return (
            ("has_sku", "دارای SKU"),
            ("no_sku", "بدون SKU"),
            ('has_ba_salam', "درون با سلام"),
            ("not_in_ba_salam", "درون با سلام نیست")
        )

    def queryset(self, request, queryset):
        if self.value() == "has_sku":
            return queryset.filter(sku__isnull=False)
        elif self.value() == "no_sku":
            return queryset.filter(sku__isnull=True)
        elif self.value() == "has_ba_salam":
            return queryset.filter(product_id_ba_salam__isnull=False)
        elif self.value() == "not_in_ba_salam":
            return queryset.filter(product_id_ba_salam__isnull=True)
        return queryset


class ProductBasePriceIsNull(admin.SimpleListFilter):
    title = "base_price",
    parameter_name = "is_null_base_price"

    def lookups(self, request, model_admin):
        return (
            ("is_null", "بدون قیمت"),
            ("not_null", "دارای قیمت")
        )

    def queryset(self, request, queryset):
        if self.value() == "is_null":
            return queryset.filter(base_price__isnull=True)
        elif self.value() == "not_null":
            return queryset.filter(base_price__isnull=False)
        else:
            return queryset


# class ProductVariantPriceIsNull(admin.SimpleListFilter):
#     title = "base_price",
#     parameter_name = "is_null_base_price"
#
#     def lookups(self, request, model_admin):
#         return (
#             ("is_null", "بدون قیمت"),
#             ("not_null", "دارای قیمت")
#         )
#
#     def queryset(self, request, queryset):
#         if self.value() == "is_null":
#             return queryset.filter(price__isnull=True)
#         elif self.value() == "not_null":
#             return queryset.filter(price__isnull=False)
#         else:
#             return queryset


@admin.register(Category)
class CategoryAdmin(TreeAdmin, CoreAdminMixin):
    # form = movenodeform_factory(Category)
    list_display = ("id", "category_name", "category_slug", "category_image_id", "is_active", "created_at", "updated_at")
    list_display_links = ("id", "category_name")
    search_fields = ("category_name", "id")
    search_help_text = "برای جست و جو میتوانید از نام دسته بندی استفاده کنید"
    raw_id_fields = ("category_image",)


@admin.register(Product)
class ProductAdmin(CoreAdminMixin):
    list_display = ("id", "product_name", "category_id", "product_brand_id", "is_active", "created_at", "updated_at")
    search_fields = ("product_name", "id")
    search_help_text = "برای جست و جو میتوانید از نام محصول استفاده کنید"
    raw_id_fields = ("product_brand", "category")
    filter_horizontal = ("tags",)
    list_display_links = ("id", "product_name")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            return qs.only("product_name", "category_id", "product_brand_id", "is_active", "created_at", "updated_at")
        return qs


@admin.register(Attribute)
class AttributeAdmin(CoreAdminMixin):
    list_display = (
        "attribute_name",
        "id",
        "is_active",
        "created_at",
        "updated_at",
    )
    search_fields = ("attribute_name", "id")
    search_help_text = "برای جست و جو میتوانید از نام اتربیوت استفاده کنید"


@admin.register(AttributeValue)
class ProductAttributeValueAdmin(CoreAdminMixin):
    list_display = (
        "attribute_value",
        "attribute_id",
        "id",
        "is_active",
        "created_at",
        "updated_at",
    )
    search_fields = ("attribute_value", "id")
    search_help_text = "برای جست و جو میتوانید از نام اتریبیوت استفاده کنید  (attribute_value)"
    raw_id_fields = ("attribute",)


@admin.register(FavoriteProduct)
class FavoriteProductAdmin(CoreAdminMixin):
    list_display = ("id", "user_id", "get_user_phone", "product_id", "is_active", "created_at", "updated_at")
    raw_id_fields = ("user", "product")
    search_fields = ("user__mobile_phone", "id")
    list_display_links = ("id", "user_id", "product_id", "get_user_phone")
    search_help_text = "برای جست و جو میتوانید از شماره تلفن کاربر استفاده کنید"
    list_select_related = ("user",)

    def get_user_phone(self, obj):
        return obj.user.mobile_phone

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            return qs.only("user__mobile_phone", "product_id", "is_active", "created_at", "updated_at")
        return qs


@admin.register(ProductImages)
class ProductImagesAdmin(CoreAdminMixin):
    list_display = ("id", "product_id", "variant_id", "image_id", "is_active", "created_at", "updated_at")
    list_display_links = ("id", "product_id", "variant_id", "image_id")
    raw_id_fields = ("product", "variant", "image")
    search_fields = ("id", "product_id", "variant_id")


@admin.register(ProductBrand)
class ProductAdminAdmin(CoreAdminMixin):
    list_display = ("id", "brand_name", "brand_image_id", "is_active", "created_at", "updated_at")
    raw_id_fields = ("brand_image",)
    list_display_links = ("id", "brand_image_id", "brand_name")
    search_fields = ("brand_image_id", "brand_name", "id")
    search_help_text = "برای جست و جو متوانید از نام برند استفاده کنید"


@admin.register(Tag)
class TagAdmin(CoreAdminMixin):
    list_display = ("id", "tag_name", "is_active", "created_at", "updated_at")
    search_fields = ("tag_name", "id")
    search_help_text = "برای جست و جو میتوانید از نام تگ استفاده کنید"
    list_display_links = ("tag_name", "id")


@admin.register(ProductComment)
class ProductCommentAdmin(TreeAdmin, CoreAdminMixin):
    list_display = ("id", "product_id", "get_user_phone", "user_id", "is_active", "created_at", "updated_at")
    form = movenodeform_factory(ProductComment)
    raw_id_fields = ("product", "user")
    list_display_links = ("id", "product_id", "user_id")
    list_select_related = ("user",)

    def get_user_phone(self, obj):
        return obj.user.mobile_phone

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            return qs.only("user__mobile_phone", "product_id", "is_active", "created_at", "updated_at", "path", "depth", "numchild")
        return qs


@admin.register(ProductVariant)
class ProductVariantAdmin(CoreAdminMixin):
    list_display = (
        "product_id",
        "name",
        "product_name",
        "id",
        "price",
        "stock_number",
        "in_person_purchase",
        "is_active",
        "created_at",
        "updated_at",
    )
    list_editable = ("is_active", "price", "stock_number", "in_person_purchase")
    search_fields = ("name", "id")
    search_help_text = _("برای جست و جو میتوانید از نام ورینت استفاده کنید")
    list_filter = ("is_active", "created_at", "updated_at")
    list_select_related = ("product",)
    list_display_links = ("id", "name", "product_name")
    actions = (
        "disable_is_active",
        "enable_is_active",
        "disable_in_person_purchase",
        "enable_in_person_purchase",
    )
    def product_name(self, obj):
        return obj.product.product_name

    @admin.action(description="disable fields in_person_purchase")
    def disable_in_person_purchase(self, request, queryset):
        queryset.update(in_person_purchase=False)

    @admin.action(description="enable fields in_person_purchase")
    def enable_in_person_purchase(self, request, queryset):
        queryset.update(in_person_purchase=True)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            fields = ("product__product_name", "price", "stock_number", "in_person_purchase", "is_active", "created_at", "updated_at", "name")
            return qs.only(*fields)
        return qs


@admin.register(ProductVariantAttributeValues)
class ProductVariantAttributeValuesAdmin(CoreAdminMixin):
    list_display = ("id", "attribute_name", "value_name", "variant_name", "product_variant_id", "is_active", "created_at", "updated_at")
    raw_id_fields = ("attribute", "product_variant", "value")
    list_select_related = ("attribute", "product_variant", "value")
    search_fields = ("id", "attribute__attribute_name", "value__attribute_value")
    search_help_text = "برای جست و جو میتوانید از نام اتریبیوت یا مقدار ان استفاده کنید(attribute_name, value_name)"
    list_display_links = ("id", "attribute_name", "value_name")

    def attribute_name(self, obj):
        return obj.attribute.attribute_name

    def variant_name(self, obj):
        return obj.product_variant.name

    def value_name(self, obj):
        return obj.value.attribute_value

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            fields = ("product_variant__name", "attribute__attribute_name", "value__attribute_value", "is_active", "created_at", "updated_at")
            return qs.only(*fields)
        return qs
