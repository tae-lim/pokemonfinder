import json
from django.http import JsonResponse

def api_home(request, *args, **kwargs):
    body = request.body
    data = {}
    print(request.GET)
    try:
        data = json.loads(body)
    except:
        pass
    data['params'] = dict(request.GET)
    data['headers'] = dict(request.headers)
    data['content_type'] = request.content_type
    return JsonResponse({"message": "hello there"})