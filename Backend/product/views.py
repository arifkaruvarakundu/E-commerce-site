import os
from rest_framework.response import Response
from rest_framework import status
from .models import Product,Order,OrderItem
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from .serializers import ProductSerializer, UserSerializer
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.views import View
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from .tasks import generate_order_report_csv
from django.http import JsonResponse
from django.core.mail import EmailMessage

# Create your views here.

class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

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
    

    
class GenerateInvoicePDF(View):
    def get(self,request, order_id):
        # Get order and related items
        order = Order.objects.get(pk=order_id)
        order_items = OrderItem.objects.filter(order=order)
        # Create response object
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{order.invoice_number}.pdf"'
        # Create PDF document
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []

        # Order details
        data = [
            ['Invoice Number:', order.invoice_number],
            ['Invoice Date:', order.invoice_date.strftime('%Y-%m-%d')],
            ['Customer:', order.user.username],
            ['Total Price:', f'${order.total_price}'],
        ]
        table = Table(data, colWidths=[150, 200])
        table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ]))
        elements.append(table)
        elements.append(Table([['']], colWidths=[None]))

        # Order items table
        data = [['Product', 'Quantity', 'Price']]
        for item in order_items:
            data.append([item.product.title, item.quantity, f'${item.price_at_purchase}'])
        table = Table(data)
        elements.append(table)

        # Build PDF document
        doc.build(elements)
        return response    

class GenerateOrderReportView(View):
    def get(self, request):
        # Trigger Celery task to generate order report asynchronously
        task = generate_order_report_csv.delay()

        # Wait for task to complete
        task_result = task.get()

        # Check if task was successful
        if task_result:
            # Get the path of the generated CSV file
            filename = os.path.join('C:\\Users\\Admin\\Desktop\\Agua_India\\Backend', task_result)

            # Read the contents of the CSV file
            with open(filename, 'r') as file:
                csv_content = file.read()

            # Return the CSV content in the HttpResponse
            return HttpResponse(csv_content, content_type='text/csv')
        else:
            # Handle error if task failed
            return HttpResponse('Failed to generate order report', status=500)


class GenerateEmailOrderReportView(View):
    def get(self, request):
        # Trigger Celery task to generate order report asynchronously
        task = generate_order_report_csv.delay()

        # Optionally, send email with the CSV report as attachment
        email_sent = self.send_email_with_attachment(task.id)

        if email_sent:
            return JsonResponse({'task_id': task.id, 'email_sent': True})
        else:
            return JsonResponse({'task_id': task.id, 'email_sent': False})
    
    def send_email_with_attachment(self, task_id):
        try:
            # Get the CSV file path from the Celery task result
            task_result = generate_order_report_csv.AsyncResult(task_id).get()
            filename = os.path.join('C:\\Users\\Admin\\Desktop\\Agua_India\\Backend', task_result)

            # Create email message
            subject = 'Order Report CSV'
            message = 'Please find the attached order report CSV file.'
            email = EmailMessage(subject, message, 'nedungadanharif@gmail.com', ['harifn786@gmail.com'])

            # Attach the CSV file to the email
            email.attach_file(filename)

            
            email.send()

            return True
        except Exception as e:
            print("Error sending email:", e)
            return False
