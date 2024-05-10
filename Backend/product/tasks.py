# tasks.py
import os
import csv
from celery import shared_task
from .models import Order,OrderItem
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum
from io import StringIO

@shared_task
def generate_order_report_csv():
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)

    # Today's totals
    today_orders = Order.objects.filter(created_at__date=today)
    order_count_today = today_orders.count()
    total_price_today = today_orders.aggregate(Sum('total_price'))['total_price__sum'] or 0

    # Weekly totals
    week_orders = Order.objects.filter(created_at__date__range=[week_ago, today])
    order_count_week = week_orders.count()
    total_price_week = week_orders.aggregate(Sum('total_price'))['total_price__sum'] or 0

    # Monthly totals
    month_orders = Order.objects.filter(created_at__date__range=[month_ago, today])
    order_count_month = month_orders.count()
    total_price_month = month_orders.aggregate(Sum('total_price'))['total_price__sum'] or 0

    # Top selling products
    top_selling_products_today = OrderItem.objects.values('product__title').annotate(total_quantity=Sum('quantity')).order_by('-total_quantity')[:5]
    top_selling_products_week = OrderItem.objects.filter(order__created_at__date__range=[week_ago, today]).values('product__title').annotate(total_quantity=Sum('quantity')).order_by('-total_quantity')[:5]
    top_selling_products_month = OrderItem.objects.filter(order__created_at__date__range=[month_ago, today]).values('product__title').annotate(total_quantity=Sum('quantity')).order_by('-total_quantity')[:5]

    # Create CSV content
    csv_data = StringIO()
    csv_writer = csv.writer(csv_data)
    csv_writer.writerow(['Period', 'Order Count', 'Total Price'])
    csv_writer.writerow(['Today', order_count_today, total_price_today])
    csv_writer.writerow(['This Week', order_count_week, total_price_week])
    csv_writer.writerow(['This Month', order_count_month, total_price_month])
    csv_writer.writerow([])
    csv_writer.writerow(['Top Selling Products Today'])
    csv_writer.writerow(['Product Title', 'Total Quantity'])
    for product in top_selling_products_today:
        csv_writer.writerow([product['product__title'], product['total_quantity']])
    csv_writer.writerow([])
    csv_writer.writerow(['Top Selling Products This Week'])
    csv_writer.writerow(['Product Title', 'Total Quantity'])
    for product in top_selling_products_week:
        csv_writer.writerow([product['product__title'], product['total_quantity']])
    csv_writer.writerow([])
    csv_writer.writerow(['Top Selling Products This Month'])
    csv_writer.writerow(['Product Title', 'Total Quantity'])
    for product in top_selling_products_month:
        csv_writer.writerow([product['product__title'], product['total_quantity']])

    SAVE_DIR = '/C:/Users/Admin/Downloads/'

    # Construct the absolute path for the CSV file
    filename = os.path.join(SAVE_DIR, 'order_report.csv')

    # Open the file and write the CSV data
    with open(filename, 'w') as file:
        file.write(csv_data.getvalue())

    # Return the filename or any other information you need
    return filename


