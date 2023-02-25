import React, { useState, useEffect } from "react";

export default function WeatherComponent({ lat, lng }) {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/socket-server/');

    // ${window.location.host}

    socket.onopen = function (event) {
      console.log("WebSocket connection established.");
      socket.send(JSON.stringify({lat, lng }))
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log('Data:', data)
      setWeatherData(data);
    };

    // socket.onclose = function (event) {
    //   console.log("WebSocket connection closed.");
    // };

    // return () => {
    //   if (socket.readyState === 1) { // <-- This is important
    //       socket.close();
    //   }
    //  };
  }, []);

  console.log('weatherData', weatherData);
  return (
    <div>
      {weatherData ? (
        <div>
          <p>City: </p>
          <p>Temperature:</p>
          <p>Description:</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}