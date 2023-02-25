from django.urls import path
from . import views

urlpatterns = [
    path('<int:pk_pokemon>/delete/', views.user_pokemon_favorties_delete_view),
    path('', views.user_pokemon_favorites_create_list_view),
]