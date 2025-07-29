from django.contrib import admin

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
class UserAdmin(admin.ModelAdmin):
    pass


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
