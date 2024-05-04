from django.shortcuts import render
from .models import Product
from rest_framework.generics import ListAPIView 
from .serializers import ProductSerializer
# Create your views here.

class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer






    