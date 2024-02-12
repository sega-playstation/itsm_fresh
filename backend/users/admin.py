from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

class UsersAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ['email']}),
        ('Details', {'fields': ['first_name', 'last_name']}),
        ('Permissions', {'fields': ['is_active', 'is_staff']})
    )
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_staff')
    ordering = ('email',)

admin.site.register(get_user_model(), UsersAdmin)
