import json

import requests
from django.conf import settings
from rest_framework import serializers

from .models import Order
from products.models import Product


class OrderCreateSerializer(serializers.Serializer):
    """Serializer for creating a new order."""
    product_id = serializers.IntegerField()
    user_name = serializers.CharField(max_length=200)
    user_email = serializers.EmailField()
    user_phone = serializers.CharField(max_length=20, required=False, default='')

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError('Product not found or inactive.')
        return value

    def create(self, validated_data):
        product = Product.objects.get(id=validated_data['product_id'])
        order = Order.objects.create(
            user_name=validated_data['user_name'],
            user_email=validated_data['user_email'],
            user_phone=validated_data.get('user_phone', ''),
            product=product,
            amount_toman=product.price_toman,
        )
        return order


class OrderSerializer(serializers.ModelSerializer):
    """Full order serializer for admin/read views."""
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user_name', 'user_email', 'user_phone',
            'product', 'product_name', 'amount_toman', 'status',
            'zarinpal_authority', 'zarinpal_ref_id',
            'created_at', 'paid_at',
        ]
        read_only_fields = fields


class PaymentVerifySerializer(serializers.Serializer):
    """Internal serializer for ZarinPal payment verification."""
    order_id = serializers.IntegerField()
    authority = serializers.CharField(max_length=200)

    def validate(self, data):
        try:
            data['order'] = Order.objects.get(
                id=data['order_id'],
                status=Order.Status.PENDING,
            )
        except Order.DoesNotExist:
            raise serializers.ValidationError('Pending order not found.')
        return data

    def create(self, validated_data):
        order = validated_data['order']
        authority = validated_data['authority']

        sandbox = settings.ZARINPAL_SANDBOX
        merchant_id = settings.ZARINPAL_MERCHANT_ID

        if sandbox:
            verify_url = 'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json'
        else:
            verify_url = 'https://api.zarinpal.com/pg/rest/WebGate/PaymentVerification.json'

        data = {
            'MerchantID': merchant_id,
            'Amount': order.amount_toman,
            'Authority': authority,
        }
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}

        try:
            response = requests.post(
                verify_url,
                data=json.dumps(data),
                headers=headers,
                timeout=30,
            )
            result = response.json()

            if result.get('Status') in (100, 101):
                ref_id = result.get('RefID', '')
                order.mark_paid(ref_id=ref_id)
                return {
                    'success': True,
                    'order_id': order.id,
                    'ref_id': ref_id,
                }
            else:
                order.mark_failed()
                return {
                    'success': False,
                    'order_id': order.id,
                    'message': f'ZarinPal error status: {result.get("Status")}',
                }

        except requests.RequestException as e:
            order.mark_failed()
            return {
                'success': False,
                'order_id': order.id,
                'message': f'Gateway connection error: {str(e)}',
            }
