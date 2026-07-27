from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import License, LicenseLog
from .serializers import LicenseVerifySerializer, LicenseActivateSerializer


class VerifyLicenseView(APIView):
    """
    Verify a license key and check its validity.
    POST /api/licenses/verify/
    """
    def post(self, request):
        serializer = LicenseVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        license_key = serializer.validated_data['license_key']
        hardware_fingerprint = serializer.validated_data.get('hardware_fingerprint', '')

        try:
            license_obj = License.objects.select_related('order').get(license_key=license_key)
        except License.DoesNotExist:
            LicenseLog.objects.create(
                action='verification_failed',
                details=f'License key not found: {license_key}',
                license_key=license_key,
                hardware_fingerprint=hardware_fingerprint,
                ip_address=self._get_client_ip(request),
            )
            return Response({
                'valid': False,
                'message': 'License key not found',
            }, status=status.HTTP_404_NOT_FOUND)

        # Check if expired
        if license_obj.is_expired:
            LicenseLog.objects.create(
                action='verification_expired',
                details=f'Expired license verification attempt: {license_key}',
                license_key=license_key,
                order_id=str(license_obj.order_id),
                hardware_fingerprint=hardware_fingerprint,
                ip_address=self._get_client_ip(request),
            )
            return Response({
                'valid': False,
                'message': 'License has expired',
                'expires_at': license_obj.expires_at.isoformat(),
            })

        # Check if active
        if not license_obj.is_active:
            LicenseLog.objects.create(
                action='verification_inactive',
                details=f'Inactive license verification attempt: {license_key}',
                license_key=license_key,
                order_id=str(license_obj.order_id),
                hardware_fingerprint=hardware_fingerprint,
                ip_address=self._get_client_ip(request),
            )
            return Response({
                'valid': False,
                'message': 'License is inactive',
            })

        # Check hardware fingerprint binding
        if license_obj.hardware_fingerprint and hardware_fingerprint:
            if license_obj.hardware_fingerprint != hardware_fingerprint:
                LicenseLog.objects.create(
                    action='verification_fingerprint_mismatch',
                    details=f'Fingerprint mismatch for {license_key}',
                    license_key=license_key,
                    order_id=str(license_obj.order_id),
                    hardware_fingerprint=hardware_fingerprint,
                    ip_address=self._get_client_ip(request),
                )
                return Response({
                    'valid': False,
                    'message': 'Hardware fingerprint mismatch',
                })

        # Log successful verification
        LicenseLog.objects.create(
            action='verification_success',
            details=f'Successful verification: {license_key}',
            license_key=license_key,
            order_id=str(license_obj.order_id),
            hardware_fingerprint=hardware_fingerprint,
            ip_address=self._get_client_ip(request),
        )

        return Response({
            'valid': True,
            'license_key': license_obj.license_key,
            'product_name': license_obj.product_name,
            'expires_at': license_obj.expires_at.isoformat(),
        })

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')


class ActivateLicenseView(APIView):
    """
    Activate a license and bind it to a hardware fingerprint.
    POST /api/licenses/activate/
    """
    def post(self, request):
        serializer = LicenseActivateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        license_key = serializer.validated_data['license_key']
        hardware_fingerprint = serializer.validated_data['hardware_fingerprint']

        try:
            license_obj = License.objects.get(license_key=license_key)
        except License.DoesNotExist:
            return Response({
                'success': False,
                'message': 'License key not found',
            }, status=status.HTTP_404_NOT_FOUND)

        if not license_obj.is_active:
            return Response({
                'success': False,
                'message': 'License is inactive',
            }, status=status.HTTP_400_BAD_REQUEST)

        if license_obj.is_expired:
            return Response({
                'success': False,
                'message': 'License has expired',
                'expires_at': license_obj.expires_at.isoformat(),
            }, status=status.HTTP_400_BAD_REQUEST)

        # Bind hardware fingerprint
        if not license_obj.hardware_fingerprint:
            license_obj.hardware_fingerprint = hardware_fingerprint
            license_obj.save(update_fields=['hardware_fingerprint'])

            LicenseLog.objects.create(
                action='license_activated',
                details=f'License {license_key} activated on device {hardware_fingerprint}',
                license_key=license_key,
                order_id=str(license_obj.order_id),
                hardware_fingerprint=hardware_fingerprint,
                ip_address=self._get_client_ip(request),
            )

            return Response({
                'success': True,
                'message': 'License activated successfully',
                'license_key': license_key,
                'product_name': license_obj.product_name,
                'expires_at': license_obj.expires_at.isoformat(),
            })
        elif license_obj.hardware_fingerprint == hardware_fingerprint:
            # Already bound to this device
            return Response({
                'success': True,
                'message': 'License already activated on this device',
                'license_key': license_key,
                'product_name': license_obj.product_name,
                'expires_at': license_obj.expires_at.isoformat(),
            })
        else:
            # Different device - activation denied
            LicenseLog.objects.create(
                action='activation_denied',
                details=f'Different device activation attempt for {license_key}',
                license_key=license_key,
                order_id=str(license_obj.order_id),
                hardware_fingerprint=hardware_fingerprint,
                ip_address=self._get_client_ip(request),
            )
            return Response({
                'success': False,
                'message': 'License is bound to another device',
            }, status=status.HTTP_403_FORBIDDEN)

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')
