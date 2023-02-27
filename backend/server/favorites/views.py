from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, mixins
from .serializers import UserPokemonFavoritesSerializer
from .models import UserPokemonFavorites
from rest_framework import authentication, generics, mixins, permissions, serializers, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from users.models import User

class UserPokemonFavoritesCreateList(generics.ListCreateAPIView):
    serializer_class = UserPokemonFavoritesSerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        return UserPokemonFavorites.objects.filter(user_id=user_id).prefetch_related('pokemon_id')
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = [item['pokemon'] for item in serializer.data]
        return Response(data)

    def perform_create(self, serializer):
        user_id = self.request.data['user_id']
        user = get_object_or_404(User, pk=user_id)
        serializer.save(user_id=user)

class UserPokemonFavoritesDelete(generics.DestroyAPIView):
    serializer_class = UserPokemonFavoritesSerializer

    def get_queryset(self):
        user_id = self.kwargs['pk']
        pokemon_id = self.kwargs['pk_pokemon']
        return UserPokemonFavorites.objects.filter(user_id=user_id, pokemon_id=pokemon_id)
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_queryset()
        self.perform_destroy(instance)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

user_pokemon_favorites_create_list_view = UserPokemonFavoritesCreateList.as_view()
user_pokemon_favorties_delete_view = UserPokemonFavoritesDelete.as_view()