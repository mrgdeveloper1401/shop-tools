from django.db import models
from treebeard.mp_tree import MP_Node

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin


# Create your models here.
class Category(MP_Node, CreateMixin, UpdateMixin):
    is_active = models.BooleanField(default=True)
    category_name = models.CharField(max_length=255, db_index=True)
    category_slug = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ('-id',)
        db_table = 'category'


class Tag(CreateMixin, UpdateMixin, SoftDeleteMixin):
    tag_name = models.CharField(max_length=255, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('-id',)
        db_table = 'tag'


class ProductAttribute(CreateMixin, UpdateMixin, SoftDeleteMixin):
    attribute_name = models.CharField(max_length=255, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('-id',)
        db_table = 'product_attribute'


class ProductAttributeValue(CreateMixin, UpdateMixin, SoftDeleteMixin):
    attribute = models.ForeignKey(
        ProductAttribute,
        on_delete=models.PROTECT,
        related_name="attribute_values")
    attribute_value = models.CharField(max_length=255, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('-id',)
        db_table = 'product_attribute_value'


class ProductImages(CreateMixin, UpdateMixin, SoftDeleteMixin):
    product = models.ForeignKey(
        "Product",
        on_delete=models.PROTECT,
        related_name="product_product_image"
    )
    variant = models.ForeignKey(
        "ProductVariant",
        on_delete=models.SET_NULL,
        related_name="variant_images",
        null=True,
        blank=True
    )
    image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="image_product_image"
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ('order', '-id')
        db_table = "product_image"


class ProductBrand(CreateMixin, UpdateMixin, SoftDeleteMixin):
    brand_name = models.CharField(max_length=255, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('-id',)
        db_table = "product_brand"


class Product(CreateMixin, UpdateMixin, SoftDeleteMixin):
    product_brand = models.ForeignKey(
        ProductBrand,
        on_delete=models.PROTECT,
        related_name="product_brands"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="tags"
    )
    product_name = models.CharField(
        max_length=400,
        db_index=True
    )
    product_slug = models.CharField(max_length=500, blank=True)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    social_links = models.JSONField(
        blank=True,
        null=True,
    )
    base_price = models.DecimalField(
        max_digits=12,
        decimal_places=3,
        null=True,
        blank=True
    )

    class Meta:
        ordering = ('-id',)
        db_table = "product"


class ProductVariant(CreateMixin, UpdateMixin, SoftDeleteMixin):
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="variants"
    )
    sku = models.CharField(max_length=50, unique=True)
    barcode = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=12, decimal_places=3)
    stock_number = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    weight = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        null=True,
        blank=True
    )
    dimensions = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    class Meta:
        ordering = ('-id',)
        db_table = "product_variant"


class VariantAttribute(models.Model):
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        related_name="attributes"
    )
    attribute = models.ForeignKey(
        ProductAttribute,
        on_delete=models.PROTECT,
        related_name="variant_attributes"
    )
    value = models.ForeignKey(
        ProductAttributeValue,
        on_delete=models.PROTECT,
        related_name="variant_attribute_values"
    )

    class Meta:
        db_table = "variant_attribute"
        unique_together = ('variant', 'attribute')


class ProductComment(MP_Node, CreateMixin, UpdateMixin):
    user = models.ForeignKey(
        "account_app.User",
        on_delete=models.DO_NOTHING,
        related_name="user_product_comments",
    )
    product = models.ForeignKey(
        "Product",
        on_delete=models.DO_NOTHING,
        related_name="product_product_comments",
    )
    comment_body = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('-id',)
        db_table = 'product_comment'


class FavoriteProduct(CreateMixin, UpdateMixin, SoftDeleteMixin):
    product = models.ForeignKey(
        Product,
        on_delete=models.DO_NOTHING,
        related_name='product_favorite_product'
    )
    user = models.ForeignKey(
        "account_app.User",
        on_delete=models.DO_NOTHING,
        related_name="user_favorite_product"
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('-id',)
        db_table = "favorite_product"
