from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from treebeard.admin import TreeAdmin
from treebeard.forms import movenodeform_factory

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
    list_display = ("username", "email", "mobile_phone", "is_staff", "is_active", "is_superuser")
    search_fields = ("mobile_phone",)
    search_help_text = _("برای جست و جو میتوانید از شماره موبایل استفاده کنید")

    def get_queryset(self, request):
        return super().get_queryset(request).defer(
            "is_deleted",
            "deleted_at"
        )

    fieldsets = (
        (None, {"fields": ("mobile_phone", "password")}),
        (_("Personal info"), {"fields": ("username", "email")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "created_at", "updated_at")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "usable_password", "password1", "password2"),
            },
        ),
    )
    readonly_fields = (
        "created_at",
        "updated_at"
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user_id",
        "first_name",
        "last_name",
        "updated_at",
        "created_at"
    )

    def get_queryset(self, request):
        return super().get_queryset(request).defer(
            "is_deleted",
            "deleted_at"
        )


@admin.register(UserAddress)
class UserAddressAdmin(admin.ModelAdmin):
    list_display = (
        "user_id",
        "state_id",
        "city_id",
        "title",
        "is_default"
    )
    list_editable = (
        "is_default",
    )
    list_filter = (
        "is_default",
    )
    list_display_links = (
        "user_id",
        "state_id",
        "title"
    )

    def get_queryset(self, request):
        return super().get_queryset(request).defer(
            "is_deleted",
            "deleted_at"
        )


@admin.register(PrivateNotification)
class PrivateNotificationAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "notif_type",
        "user_id",
        "is_active",
        "is_read",
        "created_at"
    )
    list_editable = ('is_active', "is_read")
    list_filter = ("is_active", "is_read")
    search_fields = ("notif_type",)
    search_help_text = _("برای جست و جو میتوانید از تایپ نوتیفیکیشن استفاده کنید")

    def get_queryset(self, request):
        return super().get_queryset(request).defer(
            "is_deleted",
            "deleted_at"
        )


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ("name", "id", "slug", "tel_prefix")
    search_fields = ("state",)
    search_help_text = _("برای جست و جو میتوانید از نام استان استفاده کنید")


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "state_id")
    search_fields = ("name",)
    search_help_text = _("برای جست و جو میتوانید از نام شهر استفاده کنید")

    def get_queryset(self, request):
        return super().get_queryset(request).only(
            "name",
            "state_id"
        )


@admin.register(TicketRoom)
class TicketRoomAdmin(admin.ModelAdmin):
    # TODO, add search field
    list_display = (
        "user_id",
        "title_room",
        "subject_room",
        "is_active",
        "is_close",
        "created_at",
        "updated_at"
    )
    list_editable = (
        "is_active",
        "is_close"
    )
    list_display_links = (
        "user_id",
        "title_room"
    )
    list_filter = (
        "is_active",
        "is_close"
    )

    def get_queryset(self, request):
        return super().get_queryset(request).defer(
            "is_deleted",
            "deleted_at"
        )


@admin.register(Ticket)
class TicketAdmin(TreeAdmin):
    form = movenodeform_factory(Ticket)
    list_display = (
        "sender_id",
        "room_id",
        "is_active",
        "created_at",
        "updated_at"
    )
    list_editable = (
        "is_active",
    )
    list_filter = (
        "is_active",
    )
    list_display_links = (
        "sender_id",
        "room_id"
    )

    def get_queryset(self, request):
        return super().get_queryset(request).defer(
            "is_deleted",
            "deleted_at"
        )
