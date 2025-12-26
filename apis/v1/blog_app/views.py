from django.db.models import Prefetch
from rest_framework import viewsets, permissions, generics, mixins, response, views
from rest_framework.generics import get_object_or_404

from account_app.models import Profile
from core.utils.custom_filters import AdminCategoryBlogFilter, BlogTagFilter
from core.utils.pagination import TwentyPageNumberPagination
from . import serializers
from blog_app.models import CategoryBlog, PostBlog, TagBlog
from ..utils.cache_mixin import CacheMixin


class CategoryBlogViewSet(CacheMixin, viewsets.ModelViewSet):
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

    def list(self, request, *args, **kwargs):
        cache_key = "list_category_blog"
        get_cache = self.get_cache(cache_key)
        if get_cache:
            return response.Response(get_cache)
        else:
            qs = super().list(request, *args, **kwargs)
            self.set_cache(cache_key, qs.data)
            return qs

    def retrieve(self, request, *args, **kwargs):
        cache_key = "retrieve_category_blog"
        get_cache = self.get_cache(cache_key)
        if get_cache:
            return response.Response(get_cache)
        else:
            qs = super().retrieve(request, *args, **kwargs)
            self.set_cache(cache_key, qs.data)
            return qs


class PostBlogViewSet(viewsets.ModelViewSet):
    """
    permission(create, update, delete) --> admin user \n
    pagination --> 20 item
    """
    pagination_class = TwentyPageNumberPagination
    lookup_field = "post_slug"

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


class TagBlogViewSet(CacheMixin, viewsets.ModelViewSet):
    serializer_class = serializers.TagSerializer
    pagination_class = TwentyPageNumberPagination
    filterset_class = BlogTagFilter

    def list(self, request, *args, **kwargs):
        cache_key = "list_tag_blog"
        get_cache = self.get_cache(cache_key)
        if get_cache:
            return response.Response(get_cache)
        else:
            qs = super().list(request, *args, **kwargs)
            self.set_cache(cache_key, qs.data)
            return qs

    def retrieve(self, request, *args, **kwargs):
        cache_key = "retrieve_tag_blog"
        get_cache = self.get_cache(cache_key)
        if get_cache:
            return response.Response(get_cache)
        else:
            qs = super().retrieve(request, *args, **kwargs)
            self.set_cache(cache_key, qs.data)
            return qs

    def get_permissions(self):
        if self.action in ("create", "update", "partial_update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        query = TagBlog.objects

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


class BlogTagWithOutPaginationView(CacheMixin, generics.ListAPIView):
    queryset = TagBlog.objects.only("tag_name").filter(is_active=True)
    serializer_class = serializers.BlogTagWithOutPagination

    def list(self, request, *args, **kwargs):
        cache_key = "list_blog_tag_with_out_pagination"
        get_cache = self.get_cache(cache_key)
        if get_cache:
            return response.Response(get_cache)
        else:
            qs = super().list(request, *args, **kwargs)
            self.set_cache(cache_key, qs.data)
            return qs


class LatestTenPostBlogViewSet(CacheMixin, viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = serializers.ListPostBlogSerializer

    def list(self, request, *args, **kwargs):
        cache_key = "list_ten_post_blog"
        get_cache = self.get_cache(cache_key)
        if get_cache:
            return response.Response(get_cache)
        else:
            qs = super().list(request, *args, **kwargs)
            self.set_cache(cache_key, qs.data)
            return qs

    def get_queryset(self):
        query = PostBlog.objects.filter(
            is_active=True
        ).select_related(
            "category",
            "post_cover_image"
        ).prefetch_related(
            Prefetch(
                "author__profile", queryset=Profile.objects.only(
                    "first_name",
                    "last_name",
                    "user_id"
                )
            ),
            Prefetch(
                "tags", queryset=TagBlog.objects.only("tag_name").filter(is_active=True)
            )
        ).only(
            "category__category_name",
            "post_cover_image__image",
            "post_title",
            "post_introduction",
            "description_slug",
            "read_time",
            "likes",
            "post_slug",
            "created_at",
            "author"
        ).order_by("-id")[:10]
        return query


class SeoBlogViewSet(CacheMixin, viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = serializers.SeoBlogSerializer

    def list(self, request, *args, **kwargs):
        cache_key = "list_seo_blog"
        get_cache = self.get_cache(cache_key)
        if get_cache:
            return response.Response(get_cache)
        else:
            qs = super().list(request, *args, **kwargs)
            self.set_cache(cache_key, qs.data)
            return qs

    def get_queryset(self):
        return PostBlog.objects.filter(
            is_active=True
        ).only(
            "post_title",
            "post_slug",
            "created_at",
            "updated_at"
        )


class SeoPostDetailBlogViewSet(CacheMixin, views.APIView):
    serializer_class = serializers.SeoDetailBlogSerializer

    def get_queryset(self):
        return PostBlog.objects.select_related(
            "post_cover_image",
            "category"
        ).prefetch_related(
            Prefetch(
                "author__profile", queryset=Profile.objects.only("first_name", "last_name", "user_id")
            ),
            Prefetch(
                "tags", queryset=TagBlog.objects.filter(is_active=True).only("tag_name")
            )
        ).only(
            "category__category_name",
            "post_cover_image__image",
            "post_title",
            "post_slug",
            "post_body",
            "read_time",
            "likes",
            "is_active",
            "description_slug",
            "post_introduction",
            "created_at",
            "updated_at"
        ).filter(
            is_active=True
        )

    def get(self, request, *args, **kwargs):
        post_slug = kwargs['post_slug']
        cache_key = "seo_post_detail_blog"
        get_cache = self.get_cache(cache_key)

        if get_cache:
            return response.Response(get_cache)
        else:
            get_obj = get_object_or_404(self.get_queryset(), post_slug=post_slug, is_active=True)
            serializer = self.serializer_class(get_obj)
            self.set_cache(cache_key, serializer.data)
            return response.Response(serializer.data)
