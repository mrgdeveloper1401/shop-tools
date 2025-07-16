from django.contrib import admin

from .models import Image, PublicNotification


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    pass


@admin.register(PublicNotification)
class PublicNotificationAdmin(admin.ModelAdmin):
    pass
