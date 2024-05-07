from rest_framework.response import Response
from rest_framework import status
from .models import Product,Order
from rest_framework.generics import ListAPIView,RetrieveAPIView
from rest_framework.views import APIView
from .serializers import ProductSerializer,OrderSerializer, UserSerializer,OrderRetrieveSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

# Create your views here.

class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

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
        username = request.data.get('username')
        print("username:",username)
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            serializer = UserSerializer(user)
            return Response({"message": "Login successful!", "user": serializer.data}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPIView(APIView):
    def post(self, request, format=None):
        logout(request)
        return Response({"message": "Logout successful!"}, status=status.HTTP_200_OK)