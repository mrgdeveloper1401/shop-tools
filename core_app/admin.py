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
