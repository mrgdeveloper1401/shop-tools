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


@admin.register(Category)
class CategoryAdmin(TreeAdmin):
    form = movenodeform_factory(Category)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    pass


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
