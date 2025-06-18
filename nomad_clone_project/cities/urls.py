from django.urls import path
from .views import CityListView, CityDetailView

app_name = 'cities'
urlpatterns = [
    path('', CityListView.as_view(), name='city_list'),
    path('<slug:slug>/', CityDetailView.as_view(), name='city_detail'),
]
