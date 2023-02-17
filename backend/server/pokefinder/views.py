from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Pokemon
from .serializers import PokemonSerializer

class PokemonListCreateAPIView(generics.ListCreateAPIView):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer

    # 1:41:25
    def perform_create(self, serializer):
        # serializer.save(user=self.request.user)
        name = serializer.validated_data.get('name')
        description = serializer.validated_data.get('description') or None
        if description is None:
            description = name
        serializer.save(description=description)
        # this is possibly where you do third party api requests @ pokeapi

pokemon_list_create_view = PokemonListCreateAPIView.as_view()

class PokemonDetailAPIView(generics.RetrieveAPIView):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer

pokemon_detail_view = PokemonDetailAPIView.as_view()

class PokemonListAPIView(generics.ListAPIView):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer

pokemon_list_view = PokemonListAPIView.as_view()

@api_view(['GET', 'POST'])
def pokemon_alt_view(request, pk=None, *args, **kwargs):
    method = request.method

    if method == "GET":
        # detail view
        if pk is not None:
            obj = get_object_or_404(Pokemon, pk=pk)
            data = PokemonSerializer(obj, many=False).data
            return Response(data)

        # list view
        queryset = Pokemon.objects.all()
        data = PokemonSerializer(queryset, many=True).data
        return Response(data)
    
    if method == "POST":
        serializer = PokemonSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            name = serializer.validated_data.get('name')
            description = serializer.validated_data.get('description') or None
            if description is None:
                description = name
            serializer.save(description=description)
            return Response(serializer.data)
        return Response({"invald": "not valid data"}, status=400)