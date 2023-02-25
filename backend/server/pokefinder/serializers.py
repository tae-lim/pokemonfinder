from rest_framework import serializers

from .models import Pokemon

class PokemonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pokemon
        fields = [
            'id',
            'name',
            'description',
            'lat',
            'long',
            'stats',
            'height',
            'weight',
            'images',
            'types',
            'has_gender_differences',
            'location_area_encounters',
            'moves',
        ]