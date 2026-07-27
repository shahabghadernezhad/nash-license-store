from rest_framework import serializers
from .models import License, LicenseLog


class LicenseSerializer(serializers.ModelSerializer):
    is_expired = serializers.BooleanField(read_only=True)
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = License
        fields = [
            'id', 'license_key', 'product_name', 'user_email',
            'hardware_fingerprint', 'is_active', 'is_expired',
            'is_valid', 'expires_at', 'created_at',
        ]


class LicenseVerifySerializer(serializers.Serializer):
    """Serializer for license verification requests."""
    license_key = serializers.CharField(max_length=64)
    hardware_fingerprint = serializers.CharField(max_length=256, required=False, default='')


class LicenseActivateSerializer(serializers.Serializer):
    """Serializer for license activation requests."""
    license_key = serializers.CharField(max_length=64)
    hardware_fingerprint = serializers.CharField(max_length=256)


class LicenseLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LicenseLog
        fields = [
            'id', 'action', 'details', 'order_id',
            'license_key', 'hardware_fingerprint', 'ip_address', 'created_at',
        ]
