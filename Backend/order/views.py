from django.utils import timezone
from datetime import timedelta
from product.models import Order,OrderItem
from product.serializers import OrderSerializer,OrderRetrieveSerializer,OrderItemSerializer
from rest_framework.views import APIView
from django.views import View
from django.http import HttpResponse
from django.contrib.auth.models import User
from rest_framework.generics import ListAPIView,RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle

class OrderCreateView(APIView):
    def post(self, request, *args, **kwargs):
        user_email = request.data['user_email']
        user_object = User.objects.get(email=user_email)
        user = user_object.id
        request.data['user'] = user
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            serialized_order = OrderSerializer(order)  # Serialize the entire order object
            return Response(serialized_order.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderRetrieveView(RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderRetrieveSerializer
    lookup_field = 'id'

class OrdersListView(ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderRetrieveSerializer


class OrderItemCreateView(APIView):
    def post(self, request, format=None):
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GenerateOrderPDF(View):
    def get(self, request, order_id):
        order = Order.objects.get(pk=order_id)

        # Create response object
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="order_{order.invoice_number}.pdf"'

        # Create PDF document
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []

        # Order details table
        data = [
            ['Invoice Number:', order.invoice_number],
            ['Total Price:', f'${order.total_price}'],
            ['Status:', order.status],
            ['Created At:', order.created_at.strftime('%Y-%m-%d %H:%M:%S')],
            ['Invoice Date:', order.invoice_date.strftime('%Y-%m-%d')],
        ]

        table = Table(data, colWidths=[150, 200])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.gray),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ]))
        elements.append(table)
        # Build PDF document
        doc.build(elements)
        return response
    
class DownloadOrderPDFSales(View):

    def get(self, request):
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

        # Generate PDF
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="order_sales_report.pdf"'

        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []

        # Add headings block
        headings_block = [
            ["Order Sales Report"],

        ]
        elements.append(Table(headings_block))

        # Add data to PDF
        data = [
            ["", "Order Count", "Total Price"],
            ["Today", order_count_today, total_price_today],
            ["This Week", order_count_week, total_price_week],
            ["This Month", order_count_month, total_price_month],
        ]

        top_selling_products_data = [
            ["Top Selling Products Today","Number Of Products"],
            *[list(product.values()) for product in top_selling_products_today],
            ["Top Selling Products This Week"],
            *[list(product.values()) for product in top_selling_products_week],
            ["Top Selling Products This Month"],
            *[list(product.values()) for product in top_selling_products_month],
        ]

        table_style = TableStyle([('GRID', (0, 0), (-1, -1), 1, colors.black)])

        table = Table(data, colWidths='*')
        table.setStyle(table_style)
        elements.append(table)

        top_selling_products_table = Table(top_selling_products_data, colWidths='*')
        top_selling_products_table.setStyle(table_style)
        elements.append(top_selling_products_table)

        doc.build(elements)

        return response