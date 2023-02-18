from django.urls import path
from . import views

# /api/pokemon/
urlpatterns = [
    path('', views.pokemon_list_create_view),
    path('<int:pk>/', views.pokemon_detail_view),
    path('<int:pk>/update/', views.pokemon_update_view),
    # path('<int:pk>/delete/', views.pokemon_delete_view)
]