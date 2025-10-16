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
            fields.pop("is_active", None)
            fields.pop("path", None)
            fields.pop("numchild", None)
            fields.pop("depth", None)
        return fields

    def create(self, validated_data):
        parent = validated_data.pop("parent", None)

        if parent is None:
            return CategoryBlog.add_root(**validated_data)
        else:
            category = get_object_or_404(CategoryBlog, pk=parent)
            return category.add_child(**validated_data)


class SimpleCategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryBlog
        fields = (
            "id",
            "category_name",
        )


class SimpleAuthorNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "full_name"
        )


class SimplePostCoverImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("id", "image")


class ListPostBlogSerializer(serializers.ModelSerializer):
    author = SimpleAuthorNameSerializer(many=True)
    post_cover_image = SimplePostCoverImageSerializer()

    class Meta:
        model = PostBlog
        fields = (
            "id",
            "author",
            "post_cover_image",
            "created_at",
            "post_introduction",
            "post_slug",
            "description_slug",
            "post_title",
            "category",
            "read_time",
            "likes",
            "tags"
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['category'] = SimpleCategoryNameSerializer(instance.category, read_only=True).data
        data['tags'] = SimpleBlogTagSerializer(instance.tags, many=True).data
        data['author'] = SimpleAuthorNameSerializer(instance.author, read_only=True, many=True).data
        return data


class SimpleBlogTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagBlog
        fields = (
            "id",
            "tag_name"
        )


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

        data['category'] = SimpleCategoryNameSerializer(instance.category, read_only=True).data
        data['author'] = SimpleAuthorNameSerializer(instance.author, read_only=True, many=True).data
        data['tags'] = SimpleBlogTagSerializer(instance.tags, many=True, read_only=True).data
        data['post_cover_image_url'] = SimplePostCoverImageSerializer(instance.post_cover_image, read_only=True).data
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


class BlogTagWithOutPagination(serializers.ModelSerializer):
    class Meta:
        model = TagBlog
        fields = (
            "id",
            "tag_name",
        )


class SeoBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostBlog
        fields = (
            "post_title",
            "post_slug",
            "created_at",
            "updated_at"
        )


class SeoPostBlogAuthorSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "get_full_name"
        )

    def get_full_name(self, obj):
        return obj.full_name


class SeoPostTagBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TagBlog
        fields = (
            "tag_name",
        )


class SeoPostDetailAuthroSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "full_name"
        )

    def get_full_name(self, obj):
        return obj.full_name


class SeoDetailBlogSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.category_name")
    post_cover_image = serializers.CharField(source="post_cover_image.image.url")
    tags = SeoPostTagBlogSerializer(many=True)
    author = SeoPostDetailAuthroSerializer(many=True)

    class Meta:
        model = PostBlog
        fields = (
            "id",
            "tags",
            "category_id",
            "category_name",
            "created_at",
            "updated_at",
            "post_introduction",
            "post_title",
            "post_slug",
            "post_body",
            # "read_count",
            "read_time",
            "post_cover_image",
            "likes",
            "is_active",
            "description_slug",
            "author"
        )
