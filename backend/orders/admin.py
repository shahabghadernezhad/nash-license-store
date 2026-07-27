from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'user_name', 'user_email', 'product',
        'amount_toman', 'status', 'zarinpal_ref_id',
        'created_at', 'paid_at',
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['user_name', 'user_email', 'user_phone', 'zarinpal_authority']
    readonly_fields = ['created_at', 'paid_at', 'zarinpal_authority', 'zarinpal_ref_id']
    list_per_page = 25
