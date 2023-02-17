from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.response import Response

from pokefinder.models import Pokemon
from pokefinder.serializers import PokemonSerializer

@api_view(["GET"])
def api_home(request, *args, **kwargs):
    """
    DRF API VIEW
    """
    data = request.data 
    print(data)
    instance = Pokemon.objects.all().order_by("?").first()
    data = {}
    if instance:
        data = PokemonSerializer(instance).data
    return Response(data)





"""
POST

serializer = PokemonSerializer(data=request.data)
if serializer.is_valid():
    serializer.save()
    data = serializer.data
    return Response(data)


"""