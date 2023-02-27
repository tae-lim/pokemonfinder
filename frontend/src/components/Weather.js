import React, { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';

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
    <Box display="flex" flexDirection="column">
      {weatherData ? (
        <Box>
          <Typography>Area: {location || weatherData?.name}</Typography>
          <Typography>Temperature: {Math.floor(1.8*(weatherData?.main?.temp-273) + 32)} F</Typography>
          <Typography>Description: {weatherData?.weather[0]?.description}</Typography>
          <Typography>Current Happiness: {calcHappiness(happiness, 1.8*(weatherData?.main?.temp-273) + 32)}</Typography>
        </Box>
      ) : (
        <Typography>Loading weather data...</Typography>
      )}
    </Box>
  );
}