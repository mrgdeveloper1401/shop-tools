from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from blog_app.models import CategoryBlog, PostBlog, TagBlog, CommentBlog


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
