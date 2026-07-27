from django.urls import path
from .views import CreateOrderView, PaymentCallbackView, PaymentVerifyView

urlpatterns = [
    path('create/', CreateOrderView.as_view(), name='order-create'),
    path('payment/callback/', PaymentCallbackView.as_view(), name='payment-callback'),
    path('payment/verify/', PaymentVerifyView.as_view(), name='payment-verify'),
]
