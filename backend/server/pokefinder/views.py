import requests
import json

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework import authentication, generics, mixins, permissions, serializers
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.views import APIView

from django.shortcuts import get_object_or_404

from .models import Pokemon
from .serializers import PokemonSerializer

"""
Functional Views

""" 

@method_decorator(csrf_exempt, name='dispatch')
class PokemonListCreateAPIView(generics.ListCreateAPIView):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer

    # authentication_classes = [authentication.SessionAuthentication]
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def fetch_pokemon(self, initial_data):
        res = requests.get(f'https://pokeapi.co/api/v2/pokemon/{initial_data["Pokemon"].lower()}')
        external_data = res.json()
        data = {}
        data['name'] = initial_data['Pokemon']
        data['lat'] = initial_data['lat']
        data['long'] = initial_data['long']
        data['hp'] = external_data['stats'][0]['base_stat']
        data['attack'] = external_data['stats'][1]['base_stat']
        data['defense'] = external_data['stats'][2]['base_stat']
        data['sp_attack'] = external_data['stats'][3]['base_stat']
        data['sp_defense'] = external_data['stats'][4]['base_stat']
        data['speed'] = external_data['stats'][5]['base_stat']
        data['height'] = external_data['height']
        data['weight'] = external_data['weight']
        data['image'] = external_data['sprites']['other']['official-artwork']['front_default']
        data['sprite'] = external_data['sprites']['front_default']
        return data
    
    def create(self, request, *args, **kwargs):
        initial_data = json.loads(request.body)
        objects = []

        for item in initial_data:
            # if item['Pokemon'] and item['Lat'] and item['Long'] and item['Type'] and item['Location'] and 
            obj = self.fetch_pokemon(item)
            objects.append(obj)

        serializer = self.get_serializer(data=objects, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status.HTTP_201_CREATED)

class PokemonDetailAPIView(generics.RetrieveAPIView):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer

class PokemonUpdateAPIView(generics.UpdateAPIView):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer
    lookup_field = 'pk'

    def perform_update(self, serializer):
        instance = serializer.save()
        if not instance.description:
            instance.description = instance.name
        
class PokemonListAPIView(generics.ListAPIView):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer

class PokemonDestroyAPIView(generics.DestroyAPIView):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        # instance stuff here
        super().perform_destroy(instance)

pokemon_list_create_view = PokemonListCreateAPIView.as_view()
pokemon_detail_view = PokemonDetailAPIView.as_view()
pokemon_list_view = PokemonListAPIView.as_view()
pokemon_update_view = PokemonUpdateAPIView.as_view()
pokemon_destroy_view = PokemonDestroyAPIView.as_view()


"""
Class-based Views / Mixins

class PokemonMixinView(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    generics.GenericAPIView
    ):
    queryset = Pokemon.objects.all()
    serializer_class = PokemonSerializer
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        print(args, kwargs)
        pk = kwargs.get('pk')
        if pk is not None:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

pokemon_mixin_view = PokemonMixinView.as_view()

"""

"""
Generics

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
        # FOR LATER POKEAPI USAGE
        # url = "https://pokeapi.co/api/v2/pokemon/ditto"
        # r = requests.get(url)
        # if r.status_code == 200:
        #     data = r.json()
        #     return Response(data)


        serializer = PokemonSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            name = serializer.validated_data.get('name')
            description = serializer.validated_data.get('description') or None
            if description is None:
                description = name
            serializer.save(description=description)
            return Response(serializer.data)
        return Response({"invald": "not valid data"}, status=400)

"""