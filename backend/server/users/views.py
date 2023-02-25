# from datetime import timedelta

from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserSerializer, CustomTokenObtainPairSerializer

class TokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserCreateAPIView(CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            res = {}
            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)

            res['username'] = user.username
            res['access'] = str(access_token)
            res['refresh'] = str(refresh_token)
            return Response(res, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors)

user_create_view = UserCreateAPIView.as_view()
token_obtain_pair_view = TokenObtainPairView.as_view()