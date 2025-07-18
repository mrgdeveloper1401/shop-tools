from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from product_app.models import Category, Product, ProductBrand


class ProductCategorySerializer(serializers.ModelSerializer):
    parent = serializers.IntegerField(required=False)

    class Meta:
        model = Category
        fields = "__all__"
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


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = (
            "is_deleted",
            "deleted_at"
        )
        read_only_fields = (
            "category",
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
