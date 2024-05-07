from rest_framework import serializers
from .models import Product,Order
from django.contrib.auth.models import User
from datetime import datetime

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['total_price','user','id']
    
    def create(self, validated_data):
        # Generate invoice number (5 digits)
        total_price = validated_data.pop('total_price')
        user = validated_data.pop('user')
        last_order_id = Order.objects.latest('id').id if Order.objects.exists() else 0
        invoice_number = f"INV-{str(last_order_id + 1).zfill(5)}"
        
        # Generate current date
        current_date = datetime.now().date()

        # Create and return the Order instance
        
        order = Order.objects.create(user=user, invoice_number=invoice_number, invoice_date=current_date, total_price=total_price, **validated_data)
        return order
    
class OrderRetrieveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
    
class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

class LoginForm(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()