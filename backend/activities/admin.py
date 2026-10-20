from django.contrib import admin

from activities.models import Activity


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'media_type', 'from_status', 'to_status', 'created_at')
    list_filter = ('activity_type', 'media_type', 'created_at')
    search_fields = ('user__username', 'user__email', 'media_item__title', 'game__title')
