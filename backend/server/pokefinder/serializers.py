from rest_framework import serializers

from .models import Pokemon

class PokemonSerializer(serializers.ModelSerializer):
    region = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Pokemon
        fields = [
            'name',
            'description',
            'region'
        ]
    
    def get_region(self, obj):
        return obj.get_region()


# can make primary and secondary serializers
