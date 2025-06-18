from django.contrib import admin
from .models import City

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'created_at', 'updated_at')
    search_fields = ('name', 'country')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('country', 'created_at')
