from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    User,
    Profile,
    UserAddress,
    PrivateNotification,
    State,
    City,
    TicketRoom,
    Ticket
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("username", "mobile_phone", "email", "is_active")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    pass


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    pass


@admin.register(PrivateNotification)
class PrivateNotificationAdmin(admin.ModelAdmin):
    pass


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    pass


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    pass


@admin.register(TicketRoom)
class TicketRoomAdmin(admin.ModelAdmin):
    pass


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    pass
