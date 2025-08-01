from django.db import models
from django.utils.functional import cached_property
from django.utils.text import slugify
from treebeard.mp_tree import MP_Node
from django.utils.functional import cached_property

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin


# Create your models here.
class Category(MP_Node, CreateMixin, UpdateMixin):
    is_active = models.BooleanField(default=True)
    category_name = models.CharField(max_length=255, db_index=True)
    category_slug = models.CharField(max_length=500, blank=True)
    category_image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="category_images",
        blank=True, #TODO, when clean migration we remove field blank and null
        null=True,
    )

    @cached_property
    def get_category_image_url(self):
        return self.category_image.get_image_url if self.category_image else None

    class Meta:
        ordering = ('-id',)
        db_table = 'category'


class Tag(CreateMixin, UpdateMixin, SoftDeleteMixin):
    tag_name = models.CharField(max_length=255, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('-id',)
        db_table = 'tag'


class Attribute(CreateMixin, UpdateMixin, SoftDeleteMixin):
    attribute_name = models.CharField(max_length=255, db_index=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('-id',)
        db_table = 'product_attribute'


class AttributeValue(CreateMixin, UpdateMixin, SoftDeleteMixin):
    attribute = models.ForeignKey(
        Attribute,
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
    image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="image_product_image"
    )
    alt_text_image = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ('-id',)
        db_table = "product_image"


class ProductBrand(CreateMixin, UpdateMixin, SoftDeleteMixin):
    brand_name = models.CharField(max_length=255, db_index=True)
    brand_image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="product_brand_images",
        blank=True,
        null=True
    )
    is_active = models.BooleanField(default=True)

    @cached_property
    def brand_image_url(self):
        return self.brand_image.get_image_url if self.brand_image else None

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
        related_name="product_tags"
    )
    product_name = models.CharField(
        max_length=400,
        db_index=True
    )
    product_slug = models.CharField(max_length=500, blank=True)
    description = models.TextField()
    description_slug = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    # social_links = models.JSONField(
    #     blank=True,
    #     null=True,
    #     help_text=_("you can defined social link by json")
    # )
    sku = models.CharField(max_length=50, db_index=True)
    base_price = models.DecimalField(
        max_digits=12,
        decimal_places=3,
        null=True,
        blank=True
    )

    def save(self, *args, **kwargs):
        self.product_slug = slugify(self.product_name, allow_unicode=True)
        self.description_slug = slugify(self.description, allow_unicode=True)
        return super().save(*args, **kwargs)

    class Meta:
        ordering = ('-id',)
        db_table = "product"


class ProductVariant(CreateMixin, UpdateMixin, SoftDeleteMixin):
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="variants"
    )
    # barcode = models.CharField(max_length=100, unique=True)
    price = models.DecimalField(max_digits=12, decimal_places=3)
    name = models.CharField(max_length=255, db_index=True, blank=True, null=True) # TODO when clean migration, remove field blank and null
    stock_number = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    # weight = models.DecimalField(
    #     max_digits=10,
    #     decimal_places=3,
    #     null=True,
    #     blank=True
    # )
    # dimensions = models.CharField(
    #     max_length=100,
    #     null=True,
    #     blank=True
    # )

    @cached_property
    def is_available(self):
        return False if self.stock_number == 0 else True

    class Meta:
        ordering = ('-id',)
        db_table = "product_variant"


class ProductAttributeValues(CreateMixin, UpdateMixin, SoftDeleteMixin):
    product = models.ForeignKey(
        "Product",
        on_delete=models.PROTECT,
        related_name="attributes",
    )
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.PROTECT,
        related_name="variant_attributes"
    )
    value = models.CharField(max_length=255)

    class Meta:
        db_table = "product_attribute_values"
        # unique_together = ('product', 'attribute')


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
