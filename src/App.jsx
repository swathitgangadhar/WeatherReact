import React from "react";
import { useMemo, useState } from "react";
import DynamicBackgroundCanvas from "./components/DynamicBackgroundCanvas";
import WeatherCard from "./components/WeatherCard";
import { API_KEY, getWeatherTheme } from "./utils/weather";

export default function App() {
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);

  const activeTheme = useMemo(() => {
    const primaryCity = weatherData[0];

    if (!primaryCity) {
      return getWeatherTheme("clear", true);
    }

    const isDay = primaryCity.dt > primaryCity.sys.sunrise && primaryCity.dt < primaryCity.sys.sunset;
    return getWeatherTheme(primaryCity.weather[0].main, isDay);
  }, [weatherData]);

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
    <div className="app-shell" style={{ backgroundImage: activeTheme.gradient }}>
      <DynamicBackgroundCanvas theme={activeTheme} />
      <div className="app-background-glow" style={{ background: activeTheme.glow }} aria-hidden="true" />

      <main className="app-content">
        <section className="hero glass-panel fade-up" style={{ background: activeTheme.surface, borderColor: activeTheme.surfaceBorder }}>
          <p className="hero-kicker">Reactive atmosphere</p>
          <h1 className="hero-title">WEATHER</h1>
          <p className="hero-subtitle">
            Dynamic backgrounds, frosted glass cards, and live city conditions in one centered view.
          </p>

          <form onSubmit={handleSearch} className="search-form">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError("");
              }}
              placeholder="Search any city…"
              className="search-input"
              aria-label="Search city"
            />
            <button type="submit" disabled={fetching} className="search-button">
              {fetching ? "Searching…" : "Search"}
            </button>
          </form>

          {error ? <p className="search-error">{error}</p> : null}
        </section>

        <section className="weather-cards-stack">
          {weatherData.map((city, index) => (
            <WeatherCard key={city.id} city={city} onRemove={removeCity} featured={index === 0} />
          ))}

          {weatherData.length === 0 && !fetching ? (
            <div className="empty-state glass-panel fade-up" style={{ background: activeTheme.surface, borderColor: activeTheme.surfaceBorder }}>
              <p className="empty-state-icon"><span role="img" aria-label="globe">🌍</span></p>
              <p className="empty-state-title">Search a city to animate the atmosphere.</p>
              <p className="empty-state-copy">
                The first searched city drives the full-screen background with weather-specific motion and palette changes.
              </p>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
