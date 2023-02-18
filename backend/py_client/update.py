import requests

endpoint = "http://localhost:8000/api/pokefinder/3/update/"

data = {
    "id": "3",
    "name": "Suicune",
    "description": "Legendary Ice Dog"
}

get_response = requests.patch(endpoint, json=data)
print(get_response.json())