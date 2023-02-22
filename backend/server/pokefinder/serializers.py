from rest_framework import serializers

from .models import Pokemon

class PokemonSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Pokemon
        fields = [
            'name',
            'description',
            'lat',
            'long',
            'hp',
            'attack',
            'defense',
            'sp_attack',
            'sp_defense',
            'speed',
            'height',
            'weight',
            'image',
            'sprite'
        ]