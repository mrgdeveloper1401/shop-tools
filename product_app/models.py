from django.db import models
from django.utils.text import slugify
from django_ckeditor_5.fields import CKEditor5Field
from treebeard.mp_tree import MP_Node
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _

from core_app.models import CreateMixin, UpdateMixin, SoftDeleteMixin, ActiveMixin


# Create your models here.
class Category(MP_Node, CreateMixin, UpdateMixin, ActiveMixin):
    category_name = models.CharField(max_length=255)
    category_slug = models.CharField(max_length=500, blank=True)
    category_image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="category_images",
        blank=True,
        null=True,
    )

    @cached_property
    def get_category_image_url(self):
        return self.category_image.get_image_url if self.category_image else None

    class Meta:
        ordering = ('id',)
        db_table = 'category'


class Tag(CreateMixin, UpdateMixin, SoftDeleteMixin, ActiveMixin):
    tag_name = models.CharField(max_length=255)

    class Meta:
        ordering = ('id',)
        db_table = 'tag'


class Attribute(CreateMixin, UpdateMixin, SoftDeleteMixin, ActiveMixin):
    attribute_name = models.CharField(max_length=255)

    class Meta:
        ordering = ('id',)
        db_table = 'product_attribute'


class AttributeValue(CreateMixin, UpdateMixin, SoftDeleteMixin, ActiveMixin):
    attribute = models.ForeignKey(
        Attribute,
        on_delete=models.PROTECT,
        related_name="attribute_values",
        # limit_choices_to={"is_active": True}
    )
    attribute_value = models.CharField(max_length=255)

    class Meta:
        ordering = ('id',)
        db_table = 'product_attribute_value'


class ProductImages(CreateMixin, UpdateMixin, SoftDeleteMixin, ActiveMixin):
    product = models.ForeignKey(
        "Product",
        on_delete=models.PROTECT,
        related_name="product_product_image",
        # limit_choices_to={"is_active": True}
    )
    variant = models.ForeignKey(
        "ProductVariant",
        null=True,
        blank=True,
        related_name="product_variant_images",
        on_delete=models.PROTECT
    )
    image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="image_product_image"
    )
    alt_text_image = models.CharField(max_length=255, blank=True, null=True)
    order = models.PositiveSmallIntegerField(default=0, db_default=0)

    class Meta:
        ordering = ('id',)
        db_table = "product_image"


class ProductBrand(CreateMixin, UpdateMixin, SoftDeleteMixin, ActiveMixin):
    brand_name = models.CharField(max_length=255)
    brand_image = models.ForeignKey(
        "core_app.Image",
        on_delete=models.PROTECT,
        related_name="product_brand_images",
        blank=True,
        null=True
    )

    @cached_property
    def brand_image_url(self):
        return self.brand_image.get_image_url if self.brand_image else None

    class Meta:
        ordering = ('id',)
        db_table = "product_brand"


class ProductVariantAttributeValues(CreateMixin, UpdateMixin, SoftDeleteMixin, ActiveMixin):
    product_variant = models.ForeignKey(
        "ProductVariant",
        on_delete=models.PROTECT,
        related_name="product_variant_attributes",
        # limit_choices_to={"is_active": True}
    )
    attribute = models.ForeignKey(
        "Attribute",
        on_delete=models.PROTECT,
        related_name="variant_attributes",
        # limit_choices_to={"is_active": True}
    )
    value = models.ForeignKey(AttributeValue, on_delete=models.PROTECT, related_name="variant_values")

    class Meta:
        ordering = ('id',)
        db_table = "product_variant_attribute_values"


class Product(CreateMixin, UpdateMixin, SoftDeleteMixin):
    # total_sale = models.PositiveIntegerField(default=0, db_default=0)
    product_brand = models.ForeignKey(
        ProductBrand,
        on_delete=models.PROTECT,
        related_name="product_brands",
        blank=True,
        null=True,
        # limit_choices_to={"is_active": True}
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        related_name="products",
        null=True,
    )
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name="product_tags"
    )
    product_name = models.CharField(max_length=400)
    product_slug = models.CharField(max_length=500, blank=True, null=True)
    description = CKEditor5Field('Text', config_name='extends')
    description_slug = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True, db_default=True)
    # sku = models.CharField(max_length=50, null=True) #
    # base_price = models.DecimalField(
    #     max_digits=12,
    #     decimal_places=3,
    #     null=True,
    #     blank=True
    # )
    # product_id_ba_salam = models.BigIntegerField(
    #     null=True,
    #     blank=True,
    #     help_text=_("BA Salam ID")
    # )
    # in_person_purchase = models.BooleanField(_("خرید به صورت حضوری"), default=False)

    def save(self, *args, **kwargs):
        self.product_slug = slugify(self.product_name, allow_unicode=True)
        # self.description_slug = slugify(self.description, allow_unicode=True)
        return super().save(*args, **kwargs)

    class Meta:
        ordering = ('id',)
        db_table = "product"


class ProductVariant(CreateMixin, UpdateMixin, SoftDeleteMixin):
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name="variants",
        # limit_choices_to={"is_active": True}
    )
    price = models.DecimalField(max_digits=12, decimal_places=3)
    name = models.CharField(max_length=255, db_index=True)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    stock_number = models.PositiveIntegerField(default=10)
    is_active = models.BooleanField(default=True, db_default=True)
    short_desc = models.CharField(max_length=400, blank=True, null=True)
    sku = models.CharField(max_length=50, null=True)
    product_id_ba_salam = models.BigIntegerField(
        null=True,
        blank=True,
        help_text=_("BA Salam ID")
    )
    in_person_purchase = models.BooleanField(_("خرید به صورت حضوری"), default=False)

    @cached_property
    def is_available(self):
        return False if self.stock_number == 0 else True

    class Meta:
        ordering = ('id',)
        db_table = "product_variant"


class ProductComment(MP_Node, CreateMixin, UpdateMixin, ActiveMixin):
    user = models.ForeignKey(
        "account_app.User",
        on_delete=models.DO_NOTHING,
        related_name="user_product_comments",
        # limit_choices_to={"is_active": True}
    )
    product = models.ForeignKey(
        "Product",
        on_delete=models.DO_NOTHING,
        related_name="product_product_comments",
        # limit_choices_to={"is_active": True}
    )
    comment_body = models.TextField()

    class Meta:
        ordering = ('id',)
        db_table = 'product_comment'


class FavoriteProduct(CreateMixin, UpdateMixin, SoftDeleteMixin):
    product = models.ForeignKey(
        "Product",
        on_delete=models.DO_NOTHING,
        related_name='product_favorite_product',
        limit_choices_to={"is_active": True}
    )
    user = models.ForeignKey(
        "account_app.User",
        on_delete=models.DO_NOTHING,
        related_name="user_favorite_product",
        limit_choices_to={"is_active": True}
    )
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ('-id',)
        db_table = "favorite_product"
