from django.contrib import admin
from .models import License, LicenseLog


@admin.register(License)
class LicenseAdmin(admin.ModelAdmin):
    list_display = [
        'license_key', 'product_name', 'user_email',
        'is_active', 'is_expired_display', 'expires_at', 'created_at',
    ]
    list_filter = ['is_active', 'product_name', 'created_at']
    search_fields = ['license_key', 'user_email', 'product_name', 'hardware_fingerprint']
    readonly_fields = ['created_at', 'hardware_fingerprint']
    list_per_page = 25

    @admin.display(description='Expired?')
    def is_expired_display(self, obj):
        return obj.is_expired


@admin.register(LicenseLog)
class LicenseLogAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'action', 'license_key', 'order_id',
        'ip_address', 'created_at',
    ]
    list_filter = ['action', 'created_at']
    search_fields = ['license_key', 'order_id', 'details']
    readonly_fields = [
        'action', 'details', 'order_id', 'license_key',
        'hardware_fingerprint', 'ip_address', 'created_at',
    ]
    list_per_page = 50
