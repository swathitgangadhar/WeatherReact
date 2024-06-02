import React, { useState } from 'react';

function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const onChange= () =>{
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1ae9fe2f3c019a9122e82b21a463b0f8
    `)
      .then(response => response.json())
      .then(data => setWeather(data));
  }

  return (
    <div>
      <input 
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={onChange}>Press me</button>  
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{Math.round(weather.main.temp - 273.15)}°C</p>
          <p>{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
