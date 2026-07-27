from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price_toman',
            'duration_days', 'max_cameras', 'features', 'is_active',
            'created_at',
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price_toman',
            'duration_days', 'max_cameras', 'features', 'is_active',
        ]
