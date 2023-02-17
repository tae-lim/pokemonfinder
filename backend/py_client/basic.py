import requests

endpoint = "http://127.0.0.1:8000/api/"

get_response = requests.get(endpoint, json={"query": "Hello world"})
# print(get_response)
# # print(get_response.text)
print(get_response.json())

# print(get_response.text)