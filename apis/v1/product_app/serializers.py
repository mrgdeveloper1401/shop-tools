from rest_framework import serializers
from rest_framework.generics import get_object_or_404
from drf_spectacular.utils import extend_schema_field

from product_app.tasks import create_comment_notification_admin
from core_app.models import Image
from discount_app.models import ProductDiscount
from product_app.models import (
    Category,
    Product,
    ProductBrand,
    ProductImages,
    Tag,
    ProductVariant,
    Attribute,
    AttributeValue,
    ProductAttributeValues,
    ProductComment
)


class ProductCategorySerializer(serializers.ModelSerializer):
    parent = serializers.IntegerField(required=False)
    category_url = serializers.SerializerMethodField()
    category_image = serializers.PrimaryKeyRelatedField(
        queryset=Image.objects.only("id", "image"),
        required=False
    )

    def get_category_url(self, obj):
        return obj.category_image.get_image_url if obj.category_image else None

    class Meta:
        model = Category
        exclude = (
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "path",
            "depth",
            "numchild"
        )

    def create(self, validated_data):
        parent = validated_data.pop("parent", None)

        if parent is None:
            return Category.add_root(**validated_data)
        else:
            category = get_object_or_404(Category, pk=parent)
            return category.add_child(**validated_data)


class UserProductCategorySerializer(serializers.ModelSerializer):
    category_url = serializers.CharField(source="category.image.get_image_url", read_only=True)

    class Meta:
        model = Category
        fields = (
            "id",
            "category_name",
            "category_url"
        )


class SimpleProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBrand
        fields = ("brand_name", "id")


class SimpleProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("tag_name", "id")


class AdminSimpleProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('get_image_url', "image_id_ba_salam")


class NestedProductImageSerializer(serializers.ModelSerializer):
    image = AdminSimpleProductImageSerializer(read_only=True)

    class Meta:
        model = ProductImages
        fields = (
            "image",
            "order",
            "alt_text_image"
        )


class SimpleProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "category_name",
        )


class NestedProductDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDiscount
        fields = ("amount", "discount_type")


class NestedProductVariantPriceStockSerializer(serializers.ModelSerializer):
    product_variant_discounts = NestedProductDiscountSerializer(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ("price", "stock_number", "name", "product_variant_discounts")


class ProductSerializer(serializers.ModelSerializer):
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.only("id"),
        many=True
    )
    product_brand = serializers.PrimaryKeyRelatedField(
        queryset=ProductBrand.objects.only("id"),
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.only("id"),
    )
    product_product_image = NestedProductImageSerializer(many=True, read_only=True)
    variants = NestedProductVariantPriceStockSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['product_brand'] = SimpleProductBrandSerializer(instance.product_brand).data
        data['tags'] = SimpleProductTagSerializer(instance.tags.all(), many=True).data
        data['category'] = SimpleProductCategorySerializer(instance.category).data
        return data


class NestedProductVariantPriceAttributeSerializer(serializers.ModelSerializer):
    # attributes = NestedVariantAttributeSerializer(many=True)
    variant_id = serializers.IntegerField(source="id")
    product_variant_discounts = NestedProductDiscountSerializer(many=True)

    class Meta:
        model = ProductVariant
        fields = ("price", "variant_id", "product_variant_discounts", "is_available", "stock_number", "name")


class NestedProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = (
            "attribute_name",
        )


class NestedAttributeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeValue
        fields = ("attribute_value",)


class NestedVariantAttributeSerializer(serializers.ModelSerializer):
    attribute = NestedProductAttributeSerializer()
    value = NestedAttributeValueSerializer()

    class Meta:
        model = ProductAttributeValues
        fields = (
            "attribute",
            "value"
        )


class NestedProductVariantAttributeSerializer(serializers.ModelSerializer):
    attributes = NestedVariantAttributeSerializer(many=True)
    variant_id = serializers.IntegerField(source="id")

    class Meta:
        model = ProductVariant
        fields = ("price", "variant_id", "attributes")


class NestedProductAttributeValuesSerializer(serializers.ModelSerializer):
    attribute_name = serializers.CharField(source="attribute.attribute_name")

    class Meta:
        model = ProductAttributeValues
        fields = (
            "attribute_name",
            "value"
        )


class RetrieveAdminProductSerializer(ProductSerializer):
    # variants = NestedProductVariantAttributeSerializer(many=True, read_only=True)
    attributes = NestedProductAttributeValuesSerializer(many=True, read_only=True)


class NestedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("get_image_url",)


class SimpleUserProductVariantDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDiscount
        fields = (
            "amount",
        )


class SimpleUserProductVariantNameSerializer(serializers.ModelSerializer):
    product_variant_discounts = SimpleUserProductVariantDiscountSerializer(many=True)

    class Meta:
        model = ProductVariant
        fields = ("name", "price", "product_variant_discounts")


class UserListProductSerializer(serializers.ModelSerializer):
    product_product_image = NestedProductImageSerializer(many=True)
    # product_discounts = NestedProductDiscount(many=True)
    variants = SimpleUserProductVariantNameSerializer(many=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "product_name",
            "product_product_image",
            "base_price",
            "variants",
            "product_slug",
            "description_slug",
            "category_id"
            # "product_discounts",
        )


class NestedProductTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("tag_name", "id")


class UserRetrieveProductSerializer(serializers.ModelSerializer):
    tags = NestedProductTagsSerializer(many=True)
    product_brand = SimpleProductBrandSerializer()
    product_product_image = NestedProductImageSerializer(many=True)
    attributes = NestedProductAttributeValuesSerializer(many=True, read_only=True)
    variants = NestedProductVariantPriceAttributeSerializer(many=True)

    class Meta:
        model = Product
        fields = (
            "base_price",
            "product_name",
            "description",
            # "social_links",
            "product_brand",
            "tags",
            "product_product_image",
            "attributes",
            "variants",
            "product_slug",
            "description_slug",
            "sku"
        )


class AdminProductBrandSerializer(serializers.ModelSerializer):
    brand_image = serializers.PrimaryKeyRelatedField(
        queryset=Image.objects.only("id"),
        required=False
    )

    class Meta:
        model = ProductBrand
        fields = (
            "id",
            "brand_image",
            "brand_image_url",
            "brand_name",
            "is_active",
        )


class UserProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBrand
        fields = ("brand_name", "id", "brand_image_url")


class AdminSimpleProductNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("product_name", "id")


class AdminProductImageSerializer(serializers.ModelSerializer):
    # product = serializers.PrimaryKeyRelatedField(
    #     queryset=Product.objects.filter(is_active=True).only("id")
    # )
    image = serializers.PrimaryKeyRelatedField(
        queryset=Image.objects.only("id")
    )
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.only("id",)
    )

    class Meta:
        model = ProductImages
        fields = (
            "id",
            "product",
            "image",
            "order",
            "is_active",
            "alt_text_image"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['image'] = AdminSimpleProductImageSerializer(instance.image, read_only=True).data
        return data

    # def create(self, validated_data):
    #     image = validated_data.pop("image", None)
    #     alt_image = validated_data.pop("alt_image", None)
    #
    #     if image or alt_image:
    #         img = Image.objects.create(
    #             image=image,
    #             alt_text=alt_image
    #         )
    #         product_image = ProductImages.objects.create(
    #             image_id=img.id,
    #             **validated_data
    #         )
    #         return product_image
    #     else:
    #         raise exceptions.ValidationError(
    #             {
    #                 "message": _("you must set image and alt_text image")
    #             }
    #         )


class AdminProductVariantSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.only("id")
    )
    # attributes = NestedVariantAttributeSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['product'] = AdminSimpleProductNameSerializer(instance.product, read_only=True).data
        return data


class SimpleAttribute(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = ("id", "attribute_name")


class AdminProductAttributeSerializer(serializers.ModelSerializer):
    # attribute_values = NestedProductAttributeValueSerializer(many=True, read_only=True)
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.only("id")
    )
    attribute = serializers.PrimaryKeyRelatedField(
        queryset=Attribute.objects.only("id")
    )
    # value = serializers.PrimaryKeyRelatedField(
    #     queryset=AttributeValue.objects.only("id")
    # )

    class Meta:
        model = ProductAttributeValues
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['attribute'] = SimpleAttribute(instance=instance.attribute, read_only=True).data
        return data


class AdminAttributeValueSerializer(serializers.ModelSerializer):
    attribute = serializers.PrimaryKeyRelatedField(
        queryset=Attribute.objects.only('id'),
    )

    class Meta:
        model = AttributeValue
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )


class AdminProducttAttributeSerializer(serializers.ModelSerializer):
    variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.only("id")
    )
    attribute = serializers.PrimaryKeyRelatedField(
        queryset=Attribute.objects.only('id')
    )
    value = serializers.PrimaryKeyRelatedField(
        queryset=AttributeValue.objects.only("id")
    )

    class Meta:
        model = ProductAttributeValues
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )


class ProductListHomePageSerializer(serializers.ModelSerializer):
    product_product_image = NestedProductImageSerializer(many=True)
    variants = NestedProductVariantPriceAttributeSerializer(many=True)
    product_brand_name = serializers.CharField(source="product_brand.brand_name", allow_null=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "category_id",
            "product_name",
            "product_product_image",
            "variants",
            "product_slug",
            "description_slug",
            "created_at",
            "updated_at",
            "base_price",
            "sku",
            "product_brand_name"
            # "product_discounts"
        )


class AdminTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            "id",
            "tag_name",
            "is_active",
            "created_at",
            "updated_at",
        )


class UserProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            "tag_name",
        )


class ProductCommentSerializer(serializers.ModelSerializer):
    parent = serializers.IntegerField(required=False)
    user_is_staff = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    def get_user_name(self, obj):
        return obj.user.full_name

    class Meta:
        model = ProductComment
        fields = (
            "id",
            "parent",
            "product_id",
            # "user_id",
            "user_name",
            "user_is_staff",
            "path",
            "numchild",
            "depth",
            "created_at",
            "updated_at",
            "comment_body"
        )
        read_only_fields = (
            "path",
            "numchild",
            "depth"
        )

    def create(self, validated_data):
        parent = validated_data.pop("parent", None)
        user_id = self.context['request'].user.id
        product_pk = self.context['product_pk']
        category_pk = self.context['category_pk']

        self.instance = None
        if parent is None:
            self.instance = ProductComment.add_root(**validated_data, user_id=user_id, product_id=product_pk)
        else:
            comment = get_object_or_404(ProductComment, pk=parent)
            self.instance = comment.add_child(**validated_data, user_id=user_id, product_id=product_pk)
        create_comment_notification_admin.delay(
            category_id= category_pk,
            product_id= product_pk,
            comment_id= self.instance.id,
        )
        return self.instance

    @extend_schema_field(serializers.BooleanField())
    def get_user_is_staff(self, obj):
        return obj.user.is_staff


class AdminAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = (
            "id",
            "attribute_name"
        )

class ListCategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "id",
            "category_name",
            "get_category_image_url"
        )


class AdminTagNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            "id",
            "tag_name"
        )


class ListBrandNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBrand
        fields = (
            "id",
            "brand_name",
            "brand_image_url"
        )
