from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

urlpatterns = [
    path('', views.user_create_view),
    path('token/', views.token_obtain_pair_view, name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('<int:pk>/favorites/pokemon/', include('favorites.urls'))
]