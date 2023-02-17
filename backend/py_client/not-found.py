import requests

endpoint = "http://localhost:8000/api/pokefinder/100/"

get_response = requests.get(endpoint)

print(get_response.json())