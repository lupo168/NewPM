from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'profile'
    fk_name = 'user'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_bio_preview')

    def get_bio_preview(self, instance):
        if hasattr(instance, 'profile'):
            return (instance.profile.bio[:75] + '...') if instance.profile.bio and len(instance.profile.bio) > 75 else instance.profile.bio
        return "No profile"
    get_bio_preview.short_description = 'Bio Preview'

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
