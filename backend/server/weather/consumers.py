import json
import os
import requests
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

class WeatherConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            lat = json.loads(text_data)["lat"]
            lng = json.loads(text_data)["lng"]
            url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={WEATHER_API_KEY}"

            response = requests.get(url)
            response.raise_for_status()
            
            data = response.json()
            await self.send(json.dumps(data))
        except Exception as e:
          print(f"Error: {e}")