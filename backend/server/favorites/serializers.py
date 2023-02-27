from rest_framework import serializers
from .models import UserPokemonFavorites
from pokefinder.models import Pokemon
from pokefinder.serializers import PokemonSerializer

class UserPokemonFavoritesSerializer(serializers.ModelSerializer):
    pokemon = PokemonSerializer(read_only=True, source='pokemon_id')
    class Meta:
        model = UserPokemonFavorites
        fields = ('id', 'user_id', 'pokemon_id', 'pokemon')
