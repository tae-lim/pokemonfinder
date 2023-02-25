from rest_framework import serializers
from .models import UserPokemonFavorites
from pokefinder.models import Pokemon

class UserPokemonFavoritesSerializer(serializers.ModelSerializer):
    # pokemon = PokemonSerializer(read_only=True)
    # print('pokemon', pokemon)
    # # pokemon = PokemonSerializer(read_only=True, source='pokemon_id')
    # # pokemon = PokemonSerializer()
    class Meta:
        model = UserPokemonFavorites
        fields = ('id', 'user_id', 'pokemon_id',)
