from datetime import timedelta
from django.db.models import Sum, Count, F
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from orders.models import Order
from licenses.models import License


class DashboardStatsView(APIView):
    """
    Dashboard statistics for the admin panel.
    GET /api/dashboard/stats/
    Returns: total sales, revenue, active licenses, recent orders,
    daily revenue chart data for last 30 days, top products.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)

        # Total sales and revenue (all paid orders)
        paid_orders = Order.objects.filter(status=Order.Status.PAID)
        total_sales = paid_orders.count()
        total_revenue = paid_orders.aggregate(total=Sum('amount_toman'))['total'] or 0

        # Active licenses
        active_licenses = License.objects.filter(
            is_active=True,
            expires_at__gt=now,
        ).count()

        # Recent orders (last 10)
        recent_orders = list(
            Order.objects.select_related('product')
            .order_by('-created_at')[:10]
            .values(
                'id', 'user_name', 'user_email',
                'product__name', 'amount_toman', 'status',
                'created_at',
            )
        )
        # Convert datetimes to strings for JSON serialization
        for order in recent_orders:
            if order.get('created_at'):
                order['created_at'] = order['created_at'].isoformat()

        # Daily revenue chart data for last 30 days
        daily_revenue = self._get_daily_revenue(thirty_days_ago, now)

        # Top products by sales count
        top_products = list(
            paid_orders.values('product__name')
            .annotate(
                sales_count=Count('id'),
                total_revenue=Sum('amount_toman'),
            )
            .order_by('-sales_count')[:5]
        )

        return Response({
            'total_sales': total_sales,
            'total_revenue': total_revenue,
            'active_licenses': active_licenses,
            'recent_orders': recent_orders,
            'daily_revenue': daily_revenue,
            'top_products': top_products,
        })

    def _get_daily_revenue(self, start_date, end_date):
        """
        Generate chart-ready daily revenue data for the last 30 days.
        Returns array of {date, revenue} objects for each day.
        Days with no sales show revenue: 0.
        """
        paid_orders = Order.objects.filter(
            status=Order.Status.PAID,
            created_at__gte=start_date,
            created_at__lte=end_date,
        )

        # Aggregate revenue by date
        daily_data = {}
        for order in paid_orders:
            day_str = order.created_at.strftime('%Y-%m-%d')
            daily_data[day_str] = daily_data.get(day_str, 0) + order.amount_toman

        # Build complete 30-day array with zeros for missing days
        chart_data = []
        for i in range(30):
            day = (start_date + timedelta(days=i)).date()
            day_str = day.isoformat()
            chart_data.append({
                'date': day_str,
                'revenue': daily_data.get(day_str, 0),
            })

        return chart_data
