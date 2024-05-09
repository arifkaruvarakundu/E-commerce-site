from django.urls import path
from .views import *
urlpatterns = [
    path('createOrder/', OrderCreateView.as_view(), name='order-creation'),
    path('order/<int:id>/',OrderRetrieveView.as_view(), name = 'orders-list'),
    path('ordersList/', OrdersListView.as_view(), name = 'ordersList'),
    path('createOrderItem/', OrderItemCreateView.as_view(), name='create_order_item'),
    path('download_order_pdf_sales/', DownloadOrderPDFSales.as_view(), name='salesReport'),
    path('orderPdf/<int:order_id>/', GenerateOrderPDF.as_view(), name = 'orderPDF'),
]