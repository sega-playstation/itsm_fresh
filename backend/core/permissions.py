from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import permissions


class ReadOnly(BasePermission):

    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class AuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True

        return obj.created_by == request.user


class AdminOrReadOnly(permissions.IsAdminUser):

    def has_permission(self, request, view):
        admin_permission = bool(request.user and request.user.is_staff)
        return request.method == "GET" or admin_permission


class RolePermission(BasePermission):
    def has_permission(self, request, view):
        role_permission = bool(request.user.role == '1')
        return request.method == role_permission
