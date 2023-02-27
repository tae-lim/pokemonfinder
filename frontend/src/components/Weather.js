import React, { useState, useEffect } from "react";

export default function Weather({ lat, lng, location, happiness }) {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/socket-server/');

    socket.onopen = function (event) {
      console.log("WebSocket connection established.");
      socket.send(JSON.stringify({lat, lng }))
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setWeatherData(data);
    };

    socket.onclose = function (event) {
      console.log("WebSocket connection closed.");
    };

    return () => {
      if (socket.readyState === 1) {
          socket.close();
      }
     };
  }, []);

  const calcHappiness = (baseHappiness, temperature) => {
    const variance = Math.random() * 0.4 - 0.2;
    const happiness = baseHappiness * (1 + variance * (temperature - temperature) / temperature);
    return happiness >= 0 ? happiness : 0
  }

  return (
    <div>
      {weatherData ? (
        <div>
          <p>Area: {location || weatherData?.name}</p>
          <p>Temperature:{weatherData?.main?.temp}</p>
          <p>Description:{weatherData?.weather[0]?.description}</p>
          <p>Current Happiness:{calcHappiness(happiness, weatherData?.main?.temp)}</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}