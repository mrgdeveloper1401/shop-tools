from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from treebeard.admin import TreeAdmin
from import_export.admin import ImportExportModelAdmin
from daterangefilter.filters import DateRangeFilter

from core_app.admin import CoreAdminMixin
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
class UserAdmin(BaseUserAdmin, ImportExportModelAdmin, CoreAdminMixin):
    list_display = ("username", "id", "email", "mobile_phone", "is_staff", "is_active", "is_superuser", "created_at")
    filter_horizontal = ()
    search_fields = ("mobile_phone", "id")
    search_help_text = _("برای جست و جو میتوانید از شماره موبایل استفاده کنید")
    list_filter = (
        ("created_at", DateRangeFilter),
        "is_active",
        "is_staff",
        "is_superuser",
        "created_at",
        "updated_at",
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
                    # "groups",
                    # "user_permissions",
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
                "fields": ("mobile_phone", "username", "usable_password", "password1", "password2"),
            },
        ),
    )
    readonly_fields = (
        "created_at",
        "updated_at"
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            return qs.only(
                "username",
                "email",
                "mobile_phone",
                "is_staff",
                "is_active",
                "is_superuser",
                "created_at",
                "updated_at",
            )
        return qs


@admin.register(Profile)
class ProfileAdmin(CoreAdminMixin):
    list_editable = ()
    list_filter = ("created_at", "updated_at")
    raw_id_fields = ("user", "profile_image")
    search_fields = ("user__mobile_phone", "id")
    search_help_text = _("برای جست و جو میتوانید از شماره موبایل کاربر استفاده کنید")
    list_display = (
        "user_id",
        "id",
        "get_user_phone",
        "first_name",
        "last_name",
        "updated_at",
        "created_at"
    )
    list_display_links = ("user_id", "id", "get_user_phone")

    def get_user_phone(self, obj):
        return obj.user.mobile_phone

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            return qs.select_related("user").only(
                "user__mobile_phone",
                "first_name",
                "last_name",
                "updated_at",
                "created_at"
            )
        else:
            return qs.defer("is_deleted", "deleted_at")


@admin.register(UserAddress)
class UserAddressAdmin(CoreAdminMixin):
    raw_id_fields = ("state", "city", "user")
    search_fields = ("user__mobile_phone", "id")
    search_help_text = _("برای جست و جو میتوانید از شماره موبایل کاربر استفاده کنید")
    list_display = (
        "user_id",
        "id",
        "state_id",
        "city_id",
        "get_user_phone",
        "title",
        "is_default",
        "is_active"
    )
    list_editable = (
        "is_default",
        "is_active"
    )
    list_display_links = (
        "user_id",
        "state_id",
        "title",
        "id"
    )
    list_select_related = ("user",)

    def get_list_filter(self, request):
        list_filter = super().get_list_filter(request)
        list_filter = list_filter + ("is_default",)
        return list_filter

    def get_user_phone(self, obj):
        return obj.user.mobile_phone

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            return qs.only(
                "user__mobile_phone",
                "state_id",
                "city_id",
                "title",
                "is_default",
                "is_active",
                "created_at",
                "updated_at",
            )
        else:
            return qs


@admin.register(PrivateNotification)
class PrivateNotificationAdmin(CoreAdminMixin):
    list_display = (
        "title",
        "notif_type",
        "user_id",
        "is_active",
        "is_read",
        "created_at",
        "updated_at"
    )
    list_editable = ('is_active', "is_read")
    list_filter = ("is_active", "is_read")
    search_fields = ("notif_type",)
    search_help_text = _("برای جست و جو میتوانید از تایپ نوتیفیکیشن استفاده کنید")
    raw_id_fields = ("user",)

    def get_list_filter(self, request):
        list_filter = super().get_list_filter(request)
        list_filter = list_filter + ("is_read", "notif_type")
        return list_filter

    @admin.action(description="disable is_read field")
    def disable_is_read(self, request, queryset):
        queryset.update(is_read=False)

    @admin.action(description="enable is_read field")
    def enable_is_read(self, request, queryset):
        queryset.update(is_read=True)

    def get_actions(self, request):
        actions = super().get_actions(request)
        actions["disable_is_read"] = (
            type(self).disable_is_read,
            "disable_is_read",
            "disable is_read field",
        )
        actions["enable_is_read"] = (
            type(self).enable_is_read,
            "enable_is_read",
            "enable is_read field",
        )
        return actions


@admin.register(State)
class StateAdmin(CoreAdminMixin):
    list_display = ("name", "id", "slug", "tel_prefix", "is_active")
    search_fields = ("name", "id")
    search_help_text = _("برای جست و جو میتوانید از نام استان استفاده کنید")


@admin.register(City)
class CityAdmin(CoreAdminMixin):
    list_display = ("name", "id", "state_id", "get_state_name", "is_active")
    search_fields = ("name", "id")
    list_filter = ('is_active', "created_at", "updated_at")
    list_editable = ('is_active',)
    search_help_text = _("برای جست و جو میتوانید از نام شهر استفاده کنید")
    list_select_related = ("state",)
    raw_id_fields = ("state",)

    def get_queryset(self, request):
        return super().get_queryset(request).only(
            "name",
            "state_id",
            "is_active",
            "state__name",
            "tel_prefix"
        )

    def get_state_name(self, obj):
        return obj.state.name


@admin.register(TicketRoom)
class TicketRoomAdmin(CoreAdminMixin):
    search_fields = ("user__mobile_phone", "id")
    search_help_text = "برای جست و جو میتوانید از شماره تلفن کاربر استفاده کنید"
    list_display = (
        "user_id",
        "title_room",
        "get_user_phone",
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
    list_select_related = ("user",)
    raw_id_fields = ("user",)

    def get_user_phone(self, obj):
        return obj.user.mobile_phone

    def get_list_filter(self, request):
        list_filter = super().get_list_filter(request)
        list_filter = list_filter + ("is_close",)
        return list_filter

    def get_queryset(self, request):
        return super().get_queryset(request).only(
            "user__mobile_phone",
            "is_close",
            "is_active",
            "created_at",
            "updated_at",
            "subject_room",
            "title_room",
        )

    @admin.action(description="disable is_close field")
    def disable_is_close(self, request, queryset):
        queryset.update(is_close=False)

    @admin.action(description="enable is_close field")
    def enable_is_close(self, request, queryset):
        queryset.update(is_close=True)

    def get_actions(self, request):
        actions = super().get_actions(request)
        actions["disable_is_close"] = (
            type(self).disable_is_close,
            "disable_is_close",
            "disable is_close field",
        )
        actions["enable_is_close"] = (
            type(self).enable_is_close,
            "enable_is_close",
            "enable is_close field",
        )
        return actions


@admin.register(Ticket)
class TicketAdmin(TreeAdmin, CoreAdminMixin):
    # form = movenodeform_factory(Ticket)
    list_display = (
        "sender_id",
        "room_id",
        "id",
        "get_sender_phone",
        "is_active",
        "created_at",
        "updated_at"
    )
    list_editable = (
        "is_active",
    )
    list_display_links = (
        "sender_id",
        "room_id",
        "get_sender_phone"
    )
    list_select_related = ("sender",)
    raw_id_fields = ("sender", "room")
    search_fields = ("sender__mobile_phone", "id")
    search_help_text = "برای جست و جو میتوانید از شماره موبایل کاربر استفاده کنید"

    def get_sender_phone(self, obj):
        return obj.sender.mobile_phone

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if "changelist" in request.resolver_match.url_name:
            return qs.only(
                "sender__mobile_phone",
                "is_active",
                "created_at",
                "updated_at",
                "room_id",
                "path",
                "depth",
                "numchild",
            )
        else:
            return qs