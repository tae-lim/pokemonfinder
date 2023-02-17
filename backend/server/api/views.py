from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.response import Response

from pokefinder.models import Pokemon

@api_view(["GET", "POST"])
def api_home(request, *args, **kwargs):
    """
    DRF API VIEW
    """
    if request.method != "POST":
        return Response({"detail": "GET NO"}, status=405)
    model_data = Pokemon.objects.all().order_by("?").first()
    data = {}
    if model_data:
        data = model_to_dict(model_data)
    return Response(data)