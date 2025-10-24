from rest_framework import permissions
from django.utils.translation import gettext_lazy as _


class NotAuthenticated(permissions.BasePermission):
    message = "user must be not authenticated"

    def has_permission(self, request, view):
        return not request.user.is_authenticated


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user.id == request.user.id


class AsyncNotAuthenticated(permissions.BasePermission):
    message = "user must be not authenticated"

    async def has_permission(self, request, view):
        return not request.user.is_authenticated


class AsyncIsAuthenticated(permissions.BasePermission):
    """
        async permission Allows access only to authenticated users.
    """
    async def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)
