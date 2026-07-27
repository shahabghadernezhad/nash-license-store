"""
License key generator using HMAC-SHA256.
Generates unique, deterministic license keys tied to order data.
"""
import hashlib
import hmac
from django.conf import settings


def generate_license_key(order) -> str:
    """
    Generate a license key using HMAC-SHA256.
    
    The key is derived from:
    - Merchant secret key (from settings)
    - Order ID
    - User email
    - Product slug
    - Created timestamp
    
    Format: NASH-XXXX-XXXX-XXXX-XXXX (16 hex chars, 4 groups)
    """
    secret = settings.LICENSE_SECRET_KEY.encode('utf-8')

    # Create the message to sign
    message = (
        f'{order.id}'
        f'{order.user_email}'
        f'{order.product.slug}'
        f'{order.created_at.isoformat()}'
    ).encode('utf-8')

    # Generate HMAC-SHA256 digest
    digest = hmac.new(secret, message, hashlib.sha256).hexdigest()

    # Take first 16 hex chars and format as NASH-XXXX-XXXX-XXXX-XXXX
    raw_key = digest[:16].upper()
    formatted_key = f'NASH-{raw_key[0:4]}-{raw_key[4:8]}-{raw_key[8:12]}-{raw_key[12:16]}'

    return formatted_key


def verify_license_key(license_key: str, order_data: dict) -> bool:
    """
    Verify a license key by regenerating it from order data and comparing.
    """
    secret = settings.LICENSE_SECRET_KEY.encode('utf-8')

    message = (
        f'{order_data["order_id"]}'
        f'{order_data["user_email"]}'
        f'{order_data["product_slug"]}'
        f'{order_data["created_at"]}'
    ).encode('utf-8')

    digest = hmac.new(secret, message, hashlib.sha256).hexdigest()
    raw_key = digest[:16].upper()
    expected_key = f'NASH-{raw_key[0:4]}-{raw_key[4:8]}-{raw_key[8:12]}-{raw_key[12:16]}'

    return hmac.compare_digest(license_key, expected_key)
