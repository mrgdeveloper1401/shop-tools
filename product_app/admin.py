from django.contrib import admin
from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory

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
        )

    def queryset(self, request, queryset):
        if self.value() == "has_sku":
            return queryset.filter(sku__isnull=False)
        elif self.value() == "no_sku":
            return queryset.filter(sku__isnull=True)
        return queryset


@admin.register(Category)
class CategoryAdmin(TreeAdmin):
    form = movenodeform_factory(Category)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_filter = (ProductSku, )
    list_display = (
        "product_name",
        "total_sale",
        "is_active"
    )


@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    pass


@admin.register(AttributeValue)
class ProductAttributeValueAdmin(admin.ModelAdmin):
    pass


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
    pass


@admin.register(ProductAttributeValues)
class ProductAttributeValuesAdmin(admin.ModelAdmin):
    pass
