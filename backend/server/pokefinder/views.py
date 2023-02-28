import requests
import json
import random

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


    '''
     updates lat and long with random coordinate from polyline
     long and lat are not updated in the backend and a random selection is made on frontend due to time crunch
     would also need a PATCH method invoked during the GET
    '''
    # def assign_coordinates(self, data):
    #     polyline = data['polyline']

    #     if polyline is not None:
    #         points = [(point[1], point[0]) for point in polyline]
    #         selected_point = random.choice(points)
    #         data['lat'], data['long'] = selected_point

    def fetch_pokemon(self, initial_data):
        res = requests.get(f'https://pokeapi.co/api/v2/pokemon/{initial_data["Pokemon"].lower()}')
        external_data = res.json()
        data = {}
        stats = {
            'hp': external_data['stats'][0]['base_stat'],
            'attack': external_data['stats'][1]['base_stat'],
            'defense': external_data['stats'][2]['base_stat'],
            'sp_attack': external_data['stats'][3]['base_stat'],
            'sp_defense': external_data['stats'][4]['base_stat'],
            'speed': external_data['stats'][5]['base_stat']
        }
        images = {
            'image': external_data['sprites']['other']['official-artwork']['front_default'],
            'sprite': initial_data['Sprite'] or external_data['sprites']['front_default']
        }
        if initial_data['Lat'] and initial_data['Long']:
            data['lat'] = "{:.6f}".format(float(initial_data['Lat']))
            data['lng'] = "{:.6f}".format(float(initial_data['Long']))
        data['name'] = initial_data['Pokemon']
        data['polyline'] = initial_data['polyline']
        data['height'] = external_data['height']
        data['weight'] = external_data['weight']
        data['types'] = [type['type']['name'] for type in external_data['types']]
        data['stats'] = stats
        data['images'] = images
        data['moves'] = self.calc_most_recent_moves(external_data['moves'], 60, initial_data['Latest Moves'])

        return data
    
    def find_english_description(self, flavor_texts):
        for flavor_text in flavor_texts:
            if flavor_text['language']['name'] == 'en':
                return flavor_text['flavor_text']

    def fetch_pokemon_species(self, data):
        res = requests.get(f'https://pokeapi.co/api/v2/pokemon-species/{data["name"].lower()}')
        external_data = res.json()
        data['stats']['happiness'] = external_data['base_happiness']
        data['has_gender_differences'] = external_data['has_gender_differences']
        data['description'] = self.find_english_description(external_data["flavor_text_entries"])

    def calc_most_recent_moves(self, moves, level, initial_moves):
        if initial_moves:
            try: 
                moves = json.load(initial_moves)
                return moves
            except:
                pass
        move_objs = []

        for move_data in moves:
            move = {
                'level_learned_at': 0,
                'move_name': None
            }
            for version_group_detail in move_data["version_group_details"]:
                if version_group_detail["level_learned_at"] > move['level_learned_at']:
                    move['level_learned_at'] = version_group_detail["level_learned_at"]
                    move['move_name'] = move_data["move"]["name"]
            move_objs.append(move)
        
        sorted_moves = sorted(move_objs, key=lambda move: move["level_learned_at"], reverse=True)
        filtered_moves = filter(lambda move: move["level_learned_at"] <= level, sorted_moves)
        return list(filtered_moves)[:4]

    def fetch_location(self, data, location):
        if location:
            data['location_area_encounters'] = location.replace(' ', '-')
            return
        res = requests.get(f'https://pokeapi.co/api/v2/pokemon/{data["name"].lower()}/encounters')
        external_data = res.json()
        location = None
        try:
            if external_data and external_data[0] and external_data[0]['location_area']:
                location = external_data[0]['location_area']['name']
        except KeyError:
            pass
        data['location_area_encounters'] = location
    
    def create(self, request, *args, **kwargs):
        initial_data = json.loads(request.body)
        objects = []

        for item in initial_data:
            obj = self.fetch_pokemon(item)
            self.fetch_pokemon_species(obj)
            self.fetch_location(obj, item['Location'])
            objects.append(obj)

        serializer = self.get_serializer(data=objects, many=True)

        if serializer.is_valid():
            serializer.save()
            data = serializer.data
            return Response(data, status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        for i, obj in enumerate(serializer.data):
            obj['id'] = queryset[i].id
            if obj['polyline']:
                coordinates = random.choice(obj['polyline'])
                obj['lat'] = coordinates['lat']
                obj['lng'] = coordinates['lng']

        return Response(serializer.data)
    

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