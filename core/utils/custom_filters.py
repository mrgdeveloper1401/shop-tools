from django_filters.rest_framework import FilterSet

from account_app.models import User, UserAddress


class AdminUserInformationFilter(FilterSet):
    class Meta:
        model = User
        fields = (
            "mobile_phone",
            "is_active"
        )

    def filter_queryset(self, queryset):
        if self.request.user.is_staff:
            return super().filter_queryset(queryset)
        return queryset


class AdminUserAddressFilter(FilterSet):
    class Meta:
        model = UserAddress
        fields = (
            "postal_code",
        )

    def filter_queryset(self, queryset):
        if self.request.user.is_staff:
            return super().filter_queryset(queryset)
        return queryset
