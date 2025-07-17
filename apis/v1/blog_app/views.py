from rest_framework import viewsets, permissions

from . import serializers
from blog_app.models import CategoryBlog


class CategoryBlogViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CategoryBlogSerializer

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        query = CategoryBlog.objects.only(
            "category_name",
            "category_slug",
            "is_active",
            "description_slug",
            "path",
            "depth",
            "numchild"
        )
        if not self.request.user.is_staff:
            query = query.filter(is_active=True)
        return query
