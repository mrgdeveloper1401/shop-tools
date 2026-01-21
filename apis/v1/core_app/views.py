from django.db.models import Prefetch
from rest_framework import viewsets, permissions, response

from core.utils.custom_filters import AdminImageFilter
from core.utils.pagination import TwentyPageNumberPagination
from . import serializers
from core_app.models import PublicNotification, Image, MainSite, Carousel, SitemapEntry
from ..utils.cache_mixin import CacheMixin


class PublicNotificationViewSet(CacheMixin, viewsets.ModelViewSet):
    serializer_class = serializers.PublicNotificationSerializer
    queryset = PublicNotification.objects.filter(is_active=True).only(
        "title",
        "body",
        "created_at",
    )

    def get_permissions(self):
        if self.action in ("create", "partial_update", "update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        public_notify_cache = self.get_cache("public_notification")

        if public_notify_cache:
            return response.Response(public_notify_cache)
        else:
            data = super().list(request, *args, **kwargs)
            self.set_cache("public_notification", data.data)
            return data


class AdminImageViewSet(viewsets.ModelViewSet):
    """
    pagination --> 20 item
    """
    serializer_class = serializers.AdminImageSerializer
    permission_classes = (permissions.IsAdminUser,)
    pagination_class = TwentyPageNumberPagination
    filterset_class = AdminImageFilter
    queryset = Image.objects.defer(
        "is_deleted",
        "deleted_at",
    )


class MainSiteViewSet(CacheMixin, viewsets.ModelViewSet):
    serializer_class = serializers.MainSiteSerializer

    def list(self, request, *args, **kwargs):
        main_site_cache = self.get_cache("main_site")
        if main_site_cache:
            return response.Response(main_site_cache)
        else:
            data = super().list(request, *args, **kwargs)
            self.set_cache("main_site", data.data)
            return data

    def get_permissions(self):
        if self.action in ("create", "partial_update", "update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def get_queryset(self):
        base_query = MainSite.objects.prefetch_related(
            Prefetch(
                "images", queryset=Image.objects.only("image",)
            )
        )

        if self.request.user.is_staff:
            return base_query.defer(
                "is_deleted",
                "deleted_at",
                "created_at",
                "updated_at"
            )
        else:
            return base_query.only(
                "text_color",
                "background_color",
                "header_title"
            )


class CarouselViewSet(CacheMixin, viewsets.ModelViewSet):
    serializer_class = serializers.CarouselSerializer
    queryset = Carousel.objects.select_related("image").only(
        "name",
        "image__image"
    )

    def get_permissions(self):
        if self.action in ("create", "partial_update", "update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        carousel_cache = self.get_cache("carousel")

        if carousel_cache:
            return response.Response(carousel_cache)
        else:
            data = super().list(request, *args, **kwargs)
            self.set_cache("carousel", data.data)
            return data


class SiteMapViewSet(CacheMixin, viewsets.ModelViewSet):
    serializer_class = serializers.SiteMapSerializer
    queryset = SitemapEntry.objects.defer("is_deleted", "deleted_at")

    def get_permissions(self):
        if self.action in ("create", "partial_update", "update", "destroy"):
            self.permission_classes = (permissions.IsAdminUser,)
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        sitemap_cache = self.get_cache("sitemap")

        if sitemap_cache:
            return response.Response(sitemap_cache)
        else:
            data = super().list(request, *args, **kwargs)
            self.set_cache("sitemap", data.data)
            return data
