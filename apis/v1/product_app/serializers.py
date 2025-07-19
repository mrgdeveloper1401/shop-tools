from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from core_app.models import Image
from product_app.models import Category, Product, ProductBrand, ProductImages, Tag, ProductVariant, ProductAttribute, \
    ProductAttributeValue, VariantAttribute


class ProductCategorySerializer(serializers.ModelSerializer):
    parent = serializers.IntegerField(required=False)

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
    class Meta:
        model = Category
        fields = (
            "id",
            "category_name",
        )


class SimpleProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBrand
        fields = ("brand_name",)


class SimpleProductTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("tag_name",)


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
        return data


class NestedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("get_image_url",)


class NestedProductImageSerializer(serializers.ModelSerializer):
    image = NestedImageSerializer()

    class Meta:
        model = ProductImages
        fields = (
            "image",
            "order"
        )


class UserListProductSerializer(serializers.ModelSerializer):
    product_images = NestedProductImageSerializer(
        many=True,
        source="product_product_image",
    )

    class Meta:
        model = Product
        fields = (
            "id",
            "product_name",
            "price",
            "product_images"
        )


class NestedProductTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ("tag_name",)


class UserRetrieveProductSerializer(serializers.ModelSerializer):
    product_images = NestedProductImageSerializer(
        many=True,
        source="product_product_image",
    )
    tags = NestedProductTagsSerializer(many=True)

    class Meta:
        model = Product
        fields = (
            "product_name",
            "description",
            "price",
            "social_links",
            "product_brand_id",
            "attributes_id",
            "tags",
            "product_images"
        )


class AdminProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBrand
        exclude = (
            "is_deleted",
            "deleted_at"
        )


class UserProductBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductBrand
        fields = ("brand_name", "id")


class AdminSimpleProductNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("product_name",)


class AdminSimpleProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('get_image_url',)


class AdminProductImageSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True).only("id")
    )
    image = serializers.PrimaryKeyRelatedField(
        queryset=Image.objects.only("id")
    )

    class Meta:
        model = ProductImages
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['product'] = AdminSimpleProductNameSerializer(instance.product).data
        data['image'] = AdminSimpleProductImageSerializer(instance.image).data
        return data


class NestedProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = (
            "attribute_name",
        )


class NestedProductAttributeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttributeValue
        fields = ("attribute_value",)


class NestedVariantAttributeSerializer(serializers.ModelSerializer):
    attribute = NestedProductAttributeSerializer()
    value = NestedProductAttributeValueSerializer()

    class Meta:
        model = VariantAttribute
        fields = (
            "attribute",
            "value"
        )


class AdminProductVariantSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.only("id")
    )
    attributes = NestedVariantAttributeSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )


class AdminProductAttributeSerializer(serializers.ModelSerializer):
    attribute_values = NestedProductAttributeValueSerializer(many=True, read_only=True)

    class Meta:
        model = ProductAttribute
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )


class AdminProductAttributeValueSerializer(serializers.ModelSerializer):
    attribute = serializers.PrimaryKeyRelatedField(
        queryset=ProductAttribute.objects.only('id'),
    )

    class Meta:
        model = ProductAttributeValue
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )


class AdminVariantAttributeSerializer(serializers.ModelSerializer):
    variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.only("id")
    )
    attribute = serializers.PrimaryKeyRelatedField(
        queryset=ProductAttribute.objects.only('id')
    )
    value = serializers.PrimaryKeyRelatedField(
        queryset=ProductAttributeValue.objects.only("id")
    )

    class Meta:
        model = VariantAttribute
        exclude = (
            "is_deleted",
            "deleted_at",
            "created_at",
            "updated_at",
        )
