from django.urls import path
from .views import VerifyLicenseView, ActivateLicenseView

urlpatterns = [
    path('verify/', VerifyLicenseView.as_view(), name='license-verify'),
    path('activate/', ActivateLicenseView.as_view(), name='license-activate'),
]
