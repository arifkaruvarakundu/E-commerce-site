from rest_framework.response import Response
from rest_framework import status
from .models import Product,Order
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from .serializers import ProductSerializer
from .serializers import OrderSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .serializers import UserSerializer
# Create your views here.

class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class OrderCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class OrderListView(ListAPIView):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer


class SignupAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        print("@@@@@@@@######",request.data)
        username = request.data.get('username')
        print("username:",username)
        password = request.data.get('password')
        print("password:",password)
        user = authenticate(request, username=username, password=password)
        print("user:^^^^^^^^^^^^^^",user)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful!"}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPIView(APIView):
    def post(self, request, format=None):
        logout(request)
        return Response({"message": "Logout successful!"}, status=status.HTTP_200_OK)