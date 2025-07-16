from django.contrib import admin

from .models import User, Profile, UserAddress


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    pass


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    pass


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    pass
