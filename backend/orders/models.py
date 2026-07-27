from django.db import models
from django.utils import timezone
from products.models import Product


class Order(models.Model):
    """Customer order for a Nash-Security license."""
    
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        PAID = 'paid', 'Paid'
        FAILED = 'failed', 'Failed'
        CANCELLED = 'cancelled', 'Cancelled'

    id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=200)
    user_email = models.EmailField()
    user_phone = models.CharField(max_length=20, blank=True, default='')
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='orders')
    amount_toman = models.PositiveIntegerField(help_text='Order amount in Toman')
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    zarinpal_authority = models.CharField(max_length=200, blank=True, default='')
    zarinpal_ref_id = models.CharField(max_length=200, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return f'Order #{self.id} - {self.user_name} - {self.status}'

    def mark_paid(self, ref_id: str):
        self.status = self.Status.PAID
        self.zarinpal_ref_id = ref_id
        self.paid_at = timezone.now()
        self.save(update_fields=['status', 'zarinpal_ref_id', 'paid_at'])

    def mark_failed(self):
        self.status = self.Status.FAILED
        self.save(update_fields=['status'])

    def mark_cancelled(self):
        self.status = self.Status.CANCELLED
        self.save(update_fields=['status'])
