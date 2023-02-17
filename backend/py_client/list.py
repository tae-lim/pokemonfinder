import requests

endpoint = "http://localhost:8000/api/pokefinder/"

data = {
    "description": "This field is done"
}

get_response = requests.get(endpoint)
print(get_response.json())