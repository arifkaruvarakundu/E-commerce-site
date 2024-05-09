from django.urls import path
from .views import *
urlpatterns = [
    path('products_list/', ProductListView.as_view()),
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(),name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('generate_invoice_pdf/<int:order_id>/', GenerateInvoicePDF.as_view(), name = 'invoicePdf' ),
]