from django.contrib import admin
from django.db.models import Prefetch

from . import models

@admin.register(models.Image)
class ImageAdmin(admin.ModelAdmin):
    pass


@admin.register(models.PublicNotification)
class PublicNotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "is_active", "created_at", "updated_at")
    list_per_page = 20
    list_filter = ("is_active", "created_at", "updated_at")
    search_fields = ("title", "id")
    list_display_links = ("id", "title")
    list_editable = ("is_active",)
    search_help_text = "برای جست و جو میتوانید از عنوان نوتیفیکیشن استفاده کنید"

    def get_queryset(self, request):
        return super().get_queryset(request).defer("is_deleted", "deleted_at")


@admin.register(models.MainSite)
class MainSiteAdmin(admin.ModelAdmin):
    filter_horizontal = ("images",)
    list_display = ("id", "is_publish", "created_at", "updated_at")
    list_per_page = 20
    list_editable = ("is_publish",)
    list_display_links = ("id", "created_at")

    def get_queryset(self, request):
        qs = super().get_queryset(request).defer("is_deleted", "deleted_at")
        if "change_list" in request.resolver_match:
            return qs.prefetch_related(
                Prefetch("images", queryset=models.Image.objects.only("image"))
            )
        else:
            return qs


@admin.register(models.Carousel)
class CarouselNameAdmin(admin.ModelAdmin):
    raw_id_fields = ("image",)
    list_display = ("id", "name", "created_at", "updated_at")
    list_per_page = 20
    list_filter = ("created_at", "updated_at")
    list_display_links = ("id", "name")


@admin.register(models.SitemapEntry)
class SitemapEntryAdmin(admin.ModelAdmin):
    pass


@admin.register(models.UploadFile)
class UploadFileUploadFileAdmin(admin.ModelAdmin):
    pass


class CoreAdminMixin(admin.ModelAdmin):
    list_per_page = 20
    list_filter = ('is_active', "created_at", "updated_at")
    list_editable = ("is_active",)
    actions = ("disable_is_active", "enable_is_active")

    @admin.action(description="disable fields")
    def disable_is_active(self, request, queryset):
        queryset.update(is_active=False)

    @admin.action(description="enable fields")
    def enable_is_active(self, request, queryset):
        queryset.update(is_active=True)

    def get_action(self, action):
        return super().get_action(action)

    def get_queryset(self, request):
        return super().get_queryset(request).defer(
            "is_deleted",
            "deleted_at"
        )
