from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from account_app.models import User
from blog_app.models import CategoryBlog, PostBlog, TagBlog, CommentBlog
from core_app.models import Image


class CategoryBlogSerializer(serializers.ModelSerializer):
    parent = serializers.IntegerField(required=False)

    class Meta:
        model = CategoryBlog
        fields = (
            "id",
            "category_name",
            "parent",
            "category_slug",
            "is_active",
            "description_slug",
            "path",
            "depth",
            "numchild"
        )
        read_only_fields = (
            "path",
            "depth",
            "numchild"
        )

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")

        if request and not request.user.is_staff:
            fields.pop("category_slug", None)
            fields.pop("is_active", None)
            fields.pop("description_slug", None)
        return fields

    def create(self, validated_data):
        parent = validated_data.pop("parent", None)

        if parent is None:
            return CategoryBlog.add_root(**validated_data)
        else:
            category = get_object_or_404(CategoryBlog, pk=parent)
            return category.add_child(**validated_data)


class ListPostBlogSerializer(serializers.ModelSerializer):
    post_cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = PostBlog
        fields = (
            "id",
            "author",
            "post_cover_image_url",
            "created_at",
        )

    def get_post_cover_image_url(self, obj):
        return obj.post_cover_image.image.url if obj.post_cover_image else None


class PostblogSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=CategoryBlog.objects.only("id").filter(is_active=True)
    )
    author = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.only("mobile_phone").filter(is_active=True),
        many=True,
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=TagBlog.objects.only("id").filter(is_active=True),
        many=True
    )
    post_cover_image = serializers.PrimaryKeyRelatedField(
        queryset=Image.objects.only("id")
    )

    class Meta:
        model = PostBlog
        exclude = (
            "is_deleted",
            "deleted_at",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")

        if request and not request.user.is_staff:
            data.pop("is_active", None)
            data.pop("post_slug", None)
            data.pop("description_slug", None)
        return data


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagBlog
        fields = (
            "id",
            "tag_name",
            "is_active",
        )

    def get_fields(self):
        field = super().get_fields()
        request = self.context.get("request")

        if request and not request.user.is_staff:
            field.pop("is_active", None)

        return field
