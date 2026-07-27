import json

import requests
from django.conf import settings
from django.http import HttpResponseRedirect
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderCreateSerializer, OrderSerializer, PaymentVerifySerializer
from licenses.generator import generate_license_key
from licenses.models import License, LicenseLog


ZARINPAL_SANDBOX = settings.ZARINPAL_SANDBOX
ZARINPAL_MERCHANT_ID = settings.ZARINPAL_MERCHANT_ID
ZARINPAL_CALLBACK_URL = settings.ZARINPAL_CALLBACK_URL
ZARINPAL_DESCRIPTION = settings.ZARINPAL_DESCRIPTION

# ZarinPal API endpoints
if ZARINPAL_SANDBOX:
    ZARINPAL_REQUEST_URL = 'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentRequest.json'
    ZARINPAL_VERIFY_URL = 'https://sandbox.zarinpal.com/pg/rest/WebGate/PaymentVerification.json'
    ZARINPAL_GATEWAY_URL = 'https://sandbox.zarinpal.com/pg/StartPay'
else:
    ZARINPAL_REQUEST_URL = 'https://api.zarinpal.com/pg/rest/WebGate/PaymentRequest.json'
    ZARINPAL_VERIFY_URL = 'https://api.zarinpal.com/pg/rest/WebGate/PaymentVerification.json'
    ZARINPAL_GATEWAY_URL = 'https://www.zarinpal.com/pg/StartPay'


def _create_license(order: Order):
    """Create a license for a paid order."""
    from datetime import timedelta

    license_key = generate_license_key(order)
    expires_at = timezone.now() + timedelta(days=order.product.duration_days)

    license_obj = License.objects.create(
        order=order,
        license_key=license_key,
        product_name=order.product.name,
        user_email=order.user_email,
        is_active=True,
        expires_at=expires_at,
    )

    LicenseLog.objects.create(
        action='license_created',
        details=f'License {license_key} created for order #{order.id}',
        order_id=str(order.id),
        license_key=license_key,
    )

    return license_obj


class CreateOrderView(APIView):
    """
    Create a new order and return ZarinPal payment gateway URL.
    POST /api/orders/create/
    """
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        # Prepare ZarinPal payment request
        callback_url = f'{ZARINPAL_CALLBACK_URL}?order_id={order.id}'

        data = {
            'MerchantID': ZARINPAL_MERCHANT_ID,
            'Amount': order.amount_toman,
            'Description': f'{ZARINPAL_DESCRIPTION} - {order.product.name}',
            'CallbackURL': callback_url,
            'Email': order.user_email,
            'Mobile': order.user_phone,
        }
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}

        try:
            response = requests.post(
                ZARINPAL_REQUEST_URL,
                data=json.dumps(data),
                headers=headers,
                timeout=30,
            )
            result = response.json()

            if result.get('Status') == 100 or result.get('Status') == 101:
                authority = result.get('Authority', '')
                order.zarinpal_authority = authority
                order.save(update_fields=['zarinpal_authority'])

                gateway_url = f'{ZARINPAL_GATEWAY_URL}/{authority}'
                return Response({
                    'order_id': order.id,
                    'gateway_url': gateway_url,
                    'authority': authority,
                }, status=status.HTTP_201_CREATED)
            else:
                order.mark_failed()
                return Response({
                    'error': 'Payment gateway error',
                    'details': result,
                }, status=status.HTTP_400_BAD_REQUEST)

        except requests.RequestException as e:
            order.mark_failed()
            return Response({
                'error': 'Unable to connect to payment gateway',
                'details': str(e),
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class PaymentCallbackView(APIView):
    """
    Handle ZarinPal payment callback after user completes payment.
    GET /api/orders/payment/callback/?order_id=X&Authority=Y&Status=Z
    """
    def get(self, request):
        authority = request.GET.get('Authority', '')
        payment_status = request.GET.get('Status', '')
        order_id = request.GET.get('order_id')

        if not order_id:
            return Response(
                {'error': 'Missing order_id parameter'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if payment_status != 'OK':
            order.mark_cancelled()
            return HttpResponseRedirect('/payment/failed/')

        # Verify payment with ZarinPal
        verify_serializer = PaymentVerifySerializer(data={
            'order_id': order.id,
            'authority': authority,
        })
        verify_serializer.is_valid(raise_exception=True)
        result = verify_serializer.save()

        if result.get('success'):
            # Generate license key
            try:
                _create_license(order)
            except Exception:
                # Log but don't fail the payment
                LicenseLog.objects.create(
                    action='license_generation_error',
                    details=f'Failed to generate license for order #{order.id}',
                    order_id=str(order.id),
                )
            return HttpResponseRedirect('/payment/success/')
        else:
            order.mark_failed()
            return HttpResponseRedirect('/payment/failed/')


class PaymentVerifyView(APIView):
    """
    Verify a ZarinPal payment.
    POST /api/orders/payment/verify/
    """
    def post(self, request):
        serializer = PaymentVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        if result.get('success'):
            order = Order.objects.get(id=result['order_id'])
            try:
                _create_license(order)
            except Exception as e:
                return Response({
                    'success': True,
                    'message': 'Payment verified but license generation failed',
                    'error': str(e),
                }, status=status.HTTP_200_OK)

            return Response({
                'success': True,
                'message': 'Payment verified and license generated',
                'ref_id': result.get('ref_id'),
            })
        else:
            return Response({
                'success': False,
                'message': result.get('message', 'Verification failed'),
            }, status=status.HTTP_400_BAD_REQUEST)
