from django.db import models
from django.utils import timezone


class License(models.Model):
    """Software license key for Nash-Security products."""
    id = models.AutoField(primary_key=True)
    order = models.OneToOneField(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='license',
    )
    license_key = models.CharField(
        max_length=64,
        unique=True,
        db_index=True,
        help_text='Unique generated license key',
    )
    product_name = models.CharField(max_length=200)
    user_email = models.EmailField()
    hardware_fingerprint = models.CharField(
        max_length=256,
        blank=True,
        default='',
        help_text='Hardware fingerprint bound to this license',
    )
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'License'
        verbose_name_plural = 'Licenses'

    def __str__(self):
        return f'{self.license_key} - {self.product_name}'

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    @property
    def is_valid(self):
        return self.is_active and not self.is_expired


class LicenseLog(models.Model):
    """Audit log for license-related actions."""
    id = models.AutoField(primary_key=True)
    action = models.CharField(max_length=100)
    details = models.TextField(blank=True, default='')
    order_id = models.CharField(max_length=100, blank=True, default='')
    license_key = models.CharField(max_length=64, blank=True, default='')
    hardware_fingerprint = models.CharField(max_length=256, blank=True, default='')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'License Log'
        verbose_name_plural = 'License Logs'

    def __str__(self):
        return f'{self.action} - {self.license_key or self.order_id}'
