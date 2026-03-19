import React from "react";
import { useEffect, useMemo, useState } from "react";
import ForecastCard from "./ForecastCard";
import StatCard from "./StatCard";
import { API_KEY, getUVLevel, getWeatherTheme, getWindDir } from "../utils/weather";

export default function WeatherCard({ city, onRemove, featured = false }) {
  const [forecast, setForecast] = useState([]);
  const [oneCall, setOneCall] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDay = city.dt > city.sys.sunrise && city.dt < city.sys.sunset;
  const theme = getWeatherTheme(city.weather[0].main, isDay);

  useEffect(() => {
    const fetchExtra = async () => {
      setLoading(true);

      try {
        const [forecastResponse, oneCallResponse] = await Promise.all([
          fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&units=metric&cnt=5&appid=${API_KEY}`
          ),
          fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`
          ),
        ]);

        if (forecastResponse.ok) {
          const forecastData = await forecastResponse.json();
          setForecast(forecastData.list.slice(0, 5));
        }

        if (oneCallResponse.ok) {
          const oneCallData = await oneCallResponse.json();
          setOneCall(oneCallData);
        }
      } catch (_error) {
        setForecast([]);
        setOneCall(null);
      } finally {
        setLoading(false);
      }
    };

    fetchExtra();
  }, [city.coord.lat, city.coord.lon, city.name]);

  const uv = oneCall?.current?.uvi ?? null;
  const uvLevel = uv !== null ? getUVLevel(uv) : null;
  const windDir = getWindDir(city.wind.deg);

  const forecastCards = useMemo(
    () =>
      forecast.map((item, index) => {
        const time = new Date(item.dt * 1000);

        return {
          dt: item.dt,
          label:
            index === 0
              ? "Now"
              : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          temperature: Math.round(item.main.temp),
          humidity: item.main.humidity,
          icon: getWeatherTheme(item.weather[0].main, true).icon,
        };
      }),
    [forecast]
  );

  return (
    <article
      className={`weather-card glass-panel fade-up ${featured ? "weather-card-featured" : ""}`}
      style={{
        background: theme.surface,
        borderColor: theme.surfaceBorder,
        boxShadow: `0 20px 60px ${theme.glow}`,
      }}
    >
      <div className="weather-card-header">
        <div>
          <div className="weather-card-location-row">
            <span className="weather-card-icon" aria-hidden="true">{theme.icon}</span>
            <div>
              <p className="weather-card-eyebrow">{featured ? "Primary city" : "Saved city"}</p>
              <h2 className="weather-card-title">
                {city.name}, {city.sys.country}
              </h2>
            </div>
          </div>
          <p className="weather-card-description" style={{ color: theme.accent }}>
            {city.weather[0].description}
          </p>
        </div>
        <button
          onClick={() => onRemove(city.name)}
          className="weather-card-remove"
          aria-label={`Remove ${city.name}`}
          type="button"
        >
          ✕
        </button>
      </div>

      <div className="weather-card-temp-row">
        <div>
          <p className="weather-card-temp">{Math.round(city.main.temp)}°</p>
          <p className="weather-card-feels-like">Feels like {Math.round(city.main.feels_like)}°C</p>
        </div>
        <div className="weather-card-range">
          <p>High {Math.round(city.main.temp_max)}°</p>
          <p>Low {Math.round(city.main.temp_min)}°</p>
        </div>
      </div>

      <div className="weather-stat-grid">
        <StatCard title="Humidity" value={`${city.main.humidity}%`} progressWidth={`${city.main.humidity}%`}>
          <p className="weather-stat-footnote">Comfort indicator</p>
        </StatCard>

        <StatCard
          title="Wind"
          value={`${city.wind.speed} m/s`}
          footer={`${windDir ? `${windDir} · ` : ""}Gusts ${city.wind.gust?.toFixed(1) ?? "—"}`}
        />

        <StatCard
          title="UV Index"
          value={loading ? "Loading…" : uv !== null ? uv.toFixed(1) : "Unavailable"}
          progressWidth={uv !== null ? `${Math.min(uv * 9, 100)}%` : undefined}
          progressColor={uvLevel?.meterColor}
          footer={uvLevel?.label}
        />

        <StatCard title="Pressure" value={`${city.main.pressure} hPa`} footer={`Vis ${(city.visibility / 1000).toFixed(1)} km`} />
      </div>

      {!loading && forecastCards.length > 0 ? (
        <div className="forecast-section">
          <p className="forecast-heading">Next hours</p>
          <div className="forecast-grid">
            {forecastCards.map((item) => (
              <ForecastCard key={item.dt} forecast={item} icon={item.icon} />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
