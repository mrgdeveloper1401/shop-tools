from django.contrib import admin

from .models import (
    Category,
    Product,
    ProductAttribute,
    ProductAttributeValue,
    FavoriteProduct,
    ProductImages,
    ProductBrand,
    Tag,
    ProductComment,
    ProductVariant,
    VariantAttribute
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    pass


@admin.register(ProductAttributeValue)
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


@admin.register(VariantAttribute)
class VariantAttributeAdmin(admin.ModelAdmin):
    pass
