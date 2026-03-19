import React from "react";
import { useState } from "react";
import WeatherCard from "./components/WeatherCard";
import { API_KEY } from "./utils/weather";

export default function App() {
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  const fetchWeather = async (city) => {
    setFetching(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        setError("City not found. Please try again.");
        return;
      }

      const data = await response.json();
      setWeatherData((previous) => [data, ...previous]);
      setCities((previous) => [data.name.toLowerCase(), ...previous]);
    } catch (_error) {
      setError("Network error. Check your connection.");
    } finally {
      setFetching(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    if (cities.includes(trimmed.toLowerCase())) {
      setError("City already added.");
      return;
    }

    fetchWeather(trimmed);
    setQuery("");
  };

  const removeCity = (name) => {
    setWeatherData((previous) => previous.filter((city) => city.name !== name));
    setCities((previous) => previous.filter((city) => city !== name.toLowerCase()));
  };

  return (
    <>
      <style>{`
        @keyframes rainFall {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(600px); opacity: 0; }
        }
        @keyframes snowFall {
          0% { transform: translateY(-20px) translateX(0px); opacity: 0; }
          10% { opacity: 0.8; }
          50% { transform: translateY(200px) translateX(15px); }
          90% { opacity: 0.8; }
          100% { transform: translateY(600px) translateX(-10px); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-thin text-white tracking-[0.3em] mb-1">WEATHER</h1>
            <p className="text-slate-500 text-xs tracking-[0.2em] uppercase">Live Global Conditions</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError("");
              }}
              placeholder="Search any city…"
              className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/30 rounded-2xl px-5 py-3 outline-none focus:border-white/50 transition-all"
            />
            <button
              type="submit"
              disabled={fetching}
              className="bg-white text-slate-900 font-semibold px-7 py-3 rounded-2xl hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50"
            >
              {fetching ? "…" : "Search"}
            </button>
          </form>

          {error ? <p className="text-red-400 text-sm text-center mb-4">{error}</p> : null}

          {weatherData.map((city) => (
            <WeatherCard key={city.id} city={city} onRemove={removeCity} />
          ))}

          {weatherData.length === 0 && !fetching ? (
            <div className="text-center text-white/20 mt-24">
              <p className="text-7xl mb-4"><span role="img" aria-label="globe">🌍</span></p>
              <p className="text-lg font-light">Search a city to see live weather</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
