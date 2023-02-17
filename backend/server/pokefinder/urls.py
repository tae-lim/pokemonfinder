from django.urls import path
from . import views

# /api/pokemon/
urlpatterns = [
    path('', views.pokemon_alt_view),
    path('<int:pk>/', views.pokemon_alt_view),
]