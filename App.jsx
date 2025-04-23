import React, { useState } from "react";

const API_KEY = "fcf4eeffbeb6d7effdb9fdbd5a8388f8";

const App = () => {
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState([]);

  const fetchWeather = async (city) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (res.ok) {
      const data = await res.json();
      setWeatherData((prev) => [...prev, data]);
      setCities((prev) => [...prev, city]);
    } else {
      alert("City not found!");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query && !cities.includes(query)) {
      fetchWeather(query);
      setQuery("");
    }
  };


  const removeCity = (name) => {
    setWeatherData((prev) => prev.filter((city) => city.name !== name));
    setCities((prev) => prev.filter((city) => city !== name));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-xl w-full bg-white rounded shadow">      
        <h1 className="text-2xl font-bold mb-4">Weather App 🌤️</h1>
          <form onSubmit={handleSearch} className="mb-4 flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter city name"
              className="border p-2 w-full"
           />
            <button type="submit" className="bg-blue-500 text-white px-4 rounded">
              Search
            </button>
          </form>

      <div className="grid gap-4">
        {weatherData.map((city) => (
          <div key={city.id} className="p-4 border rounded shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{city.name}</h2>
              <button
                onClick={() => removeCity(city.name)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
            <p>Temperature: {city.main.temp}°C</p>
            <p>Condition: {city.weather[0].main}</p>
            <p>Humidity: {city.main.humidity}%</p>
            <p>Wind: {city.wind.speed} m/s</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default App;
