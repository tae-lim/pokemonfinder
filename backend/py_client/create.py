import requests

endpoint = "http://localhost:8000/api/pokefinder/"

data = {
    "name": "Dragonite",
    "description": "PseudoLegendary"
}

get_response = requests.post(endpoint, json=data)
print(get_response.json())