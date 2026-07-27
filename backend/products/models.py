from django.db import models


class Product(models.Model):
    """Nash-Security product/license plan."""
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=200)
    description = models.TextField(blank=True, default='')
    price_toman = models.PositiveIntegerField(help_text='Price in Iranian Toman')
    duration_days = models.PositiveIntegerField(help_text='License duration in days')
    max_cameras = models.PositiveIntegerField(default=1, help_text='Maximum number of cameras')
    features = models.JSONField(default=dict, blank=True, help_text='JSON object of product features')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['price_toman']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return f'{self.name} - {self.price_toman} Toman'
