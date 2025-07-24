from django.contrib import admin

from .models import Image, PublicNotification, MainSite


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    pass


@admin.register(PublicNotification)
class PublicNotificationAdmin(admin.ModelAdmin):
    pass


@admin.register(MainSite)
class MainSiteAdmin(admin.ModelAdmin):
    pass
