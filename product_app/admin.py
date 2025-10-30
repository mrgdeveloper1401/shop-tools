from django.contrib import admin
from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory
from django.utils.translation import gettext_lazy as _

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
    ProductAttributeValues
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


class ProductVariantPriceIsNull(admin.SimpleListFilter):
    title = "base_price",
    parameter_name = "is_null_base_price"

    def lookups(self, request, model_admin):
        return (
            ("is_null", "بدون قیمت"),
            ("not_null", "دارای قیمت")
        )

    def queryset(self, request, queryset):
        if self.value() == "is_null":
            return queryset.filter(price__isnull=True)
        elif self.value() == "not_null":
            return queryset.filter(price__isnull=False)
        else:
            return queryset


@admin.register(Category)
class CategoryAdmin(TreeAdmin):
    form = movenodeform_factory(Category)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    search_fields = ("product_name",)
    list_display = (
        "product_name",
        "id",
        "total_sale",
        "is_active",
        "base_price",
        "product_id_ba_salam",
        "created_at",
        "updated_at"
    )
    list_filter = ("is_active", ProductSku, ProductBasePriceIsNull)
    list_editable = ("is_active",)
    list_per_page = 30


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = (
        "attribute_name",
        "id",
        "is_active",
    )
    search_fields = ("attribute_name",)
    list_filter = ("is_active",)


@admin.register(AttributeValue)
class ProductAttributeValueAdmin(admin.ModelAdmin):
    list_display = (
        "attribute_value",
        "attribute_id",
        "is_active",
    )
    list_filter = ("is_active",)


@admin.register(FavoriteProduct)
class FavoriteProductAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductImages)
class ProductImagesAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductBrand)
class ProductAdminAdmin(admin.ModelAdmin):
    pass


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductComment)
class ProductCommentAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = (
        "product_id",
        "product_name",
        "id",
        "price",
        "old_price",
        "name",
        "stock_number",
        "is_active",
        "in_person_purchase"
    )
    list_editable = ("is_active", "price", "old_price", "stock_number", "in_person_purchase")
    search_fields = ("name",)
    search_help_text = _("برای جست و جو میتوانید از نام ورینت استفاده کنید")
    list_filter = ("is_active", ProductVariantPriceIsNull)

    def product_name(self, obj):
        return obj.product.product_name

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("product").only(
            "product__product_name",
            "price",
            "old_price",
            "name",
            "stock_number",
            "is_active",
            "in_person_purchase"
        )


@admin.register(ProductAttributeValues)
class ProductAttributeValuesAdmin(admin.ModelAdmin):
    pass
