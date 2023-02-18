import requests

endpoint = "http://localhost:8000/api/pokefinder/delete"

data = {
    "id": "4",
    "name": "Rayquaza",
    "description": "Sky Legendary"
}

get_response = requests.delete(endpoint, json=data)
print(get_response.json())