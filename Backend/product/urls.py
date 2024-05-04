from django.urls import path
from .views import *
urlpatterns = [
    path('products_list/', ProductListView.as_view()),
]