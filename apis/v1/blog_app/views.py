from django.db.models import Prefetch
from rest_framework import viewsets, permissions, generics

from account_app.models import Profile
from core.utils.custom_filters import AdminCategoryBlogFilter, BlogTagFilter
from core.utils.pagination import TwentyPageNumberPagination
from . import serializers
from blog_app.models import CategoryBlog, PostBlog, TagBlog


class CategoryBlogViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CategoryBlogSerializer
    filterset_class = AdminCategoryBlogFilter

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


class PostBlogViewSet(viewsets.ModelViewSet):
    """
    permission(create, update, delete) --> admin user \n
    pagination --> 20 item
    """
    pagination_class = TwentyPageNumberPagination

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.ListPostBlogSerializer
        else:
            return serializers.PostblogSerializer

    def get_queryset(self):
        query = PostBlog.objects.select_related(
            "post_cover_image",
            "category"
        ).filter(
            category_id=self.kwargs.get("category_blog_pk")
        ).prefetch_related(
            Prefetch(
                "author__profile", queryset=Profile.objects.select_related("user").only(
                    "first_name",
                    "last_name",
                    "user_id"
                )
            )
        )

        if not self.request.user.is_staff:
            query = query.filter(is_active=True)

        if self.action == "list":
            query = query.only(
                "created_at",
                "post_cover_image__image",
                "author",
                "post_introduction",
                "post_slug",
                "description_slug",
                "post_title",
                "category__category_name"
            )
        else:
            query = query.only(
                "created_at",
                "post_cover_image__image",
                "author",
                "category_id",
                "tags",
                "updated_at",
                "post_title",
                "post_slug",
                "post_body",
                "read_time",
                "likes",
                "is_active",
                "description_slug",
                "post_introduction"
            ).prefetch_related(
                Prefetch(
                    "tags", queryset=TagBlog.objects.only("tag_name")
                )
            )
        return query


class TagBlogViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.TagSerializer
    pagination_class = TwentyPageNumberPagination
    filterset_class = BlogTagFilter

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        query = TagBlog.objects.only("tag_name")

        if not self.request.user.is_staff:
            query = query.only(
                "tag_name"
            ).filter(
                is_active=True,
            )
        query = query.only(
            "tag_name",
            "is_active"
        )
        return query


class BlogTagWithOutPaginationView(generics.ListAPIView):
    queryset = TagBlog.objects.only("tag_name").filter(is_active=True)
    serializer_class = serializers.BlogTagWithOutPagination


class LatestTenPostBlogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.ListPostBlogSerializer

    def get_queryset(self):
        query = PostBlog.objects.only(
            "created_at",
            "post_cover_image__image",
            "author",
            "post_introduction",
            "post_slug",
            "description_slug"
        ).filter(
            is_active=True
        ).order_by("-id")[:3]
        return query
