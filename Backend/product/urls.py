from django.urls import path
from .views import *
urlpatterns = [
    path('products_list/', ProductListView.as_view()),
    path('orders/', OrderCreateView.as_view(), name='order-list'),
    path('signup/', SignupAPIView.as_view(), name='signup'),
    path('login/', LoginAPIView.as_view(),name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout')
    
]