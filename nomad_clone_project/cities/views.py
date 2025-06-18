from django.shortcuts import render, get_object_or_404
from .models import City
from django.views.generic import ListView, DetailView

class CityListView(ListView):
    model = City
    template_name = 'cities/city_list.html' # cities/city_list.html
    context_object_name = 'cities'
    paginate_by = 10

class CityDetailView(DetailView):
    model = City
    template_name = 'cities/city_detail.html' # cities/city_detail.html
    context_object_name = 'city'
    slug_field = 'slug'
