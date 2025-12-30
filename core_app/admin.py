from django.contrib import admin

from . import models

@admin.register(models.Image)
class ImageAdmin(admin.ModelAdmin):
    pass


@admin.register(models.PublicNotification)
class PublicNotificationAdmin(admin.ModelAdmin):
    pass


@admin.register(models.MainSite)
class MainSiteAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Carousel)
class CarouselNameAdmin(admin.ModelAdmin):
    pass


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
