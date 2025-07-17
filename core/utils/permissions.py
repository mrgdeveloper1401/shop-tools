from rest_framework import permissions
from django.utils.translation import gettext_lazy as _


class NotAuthenticated(permissions.BasePermission):
    message = "user must be not authenticated"

    def has_permission(self, request, view):
        return not request.user.is_authenticated
