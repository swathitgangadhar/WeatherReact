import React from "react";
import { useEffect, useMemo, useState } from "react";
import ForecastCard from "./ForecastCard";
import StatCard from "./StatCard";
import WeatherParticles from "./WeatherParticles";
import { API_KEY, getUVLevel, getWeatherTheme, getWindDir } from "../utils/weather";

export default function WeatherCard({ city, onRemove }) {
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
        const label =
          index === 0
            ? "Now"
            : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        return {
          dt: item.dt,
          label,
          temperature: Math.round(item.main.temp),
          humidity: item.main.humidity,
          icon: getWeatherTheme(item.weather[0].main, true).icon,
        };
      }),
    [forecast]
  );

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.bg} text-white shadow-2xl mb-6`}>
      <WeatherParticles type={theme.particles} />

      <div className="relative z-10 p-6 pb-2 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{theme.icon}</span>
          <div>
            <h2 className="text-2xl font-bold">
              {city.name}, {city.sys.country}
            </h2>
            <p className={`text-sm ${theme.accent} capitalize`}>{city.weather[0].description}</p>
          </div>
        </div>
        <button
          onClick={() => onRemove(city.name)}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-400/60 flex items-center justify-center transition-all text-sm"
          aria-label={`Remove ${city.name}`}
        >
          ✕
        </button>
      </div>

      <div className="relative z-10 px-6 pb-4 flex items-end gap-4">
        <span className="text-9xl font-thin leading-none">{Math.round(city.main.temp)}°</span>
        <div className="pb-4 text-white/60 text-sm space-y-0.5">
          <p>Feels like {Math.round(city.main.feels_like)}°C</p>
          <p>
            ↑ {Math.round(city.main.temp_max)}° &nbsp;↓ {Math.round(city.main.temp_min)}°
          </p>
        </div>
      </div>

      <div className="relative z-10 px-4 pb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard
          theme={theme}
          title="💧 Humidity"
          value={`${city.main.humidity}%`}
          progressWidth={`${city.main.humidity}%`}
        />

        <StatCard
          theme={theme}
          title="💨 Wind"
          value={
            <>
              {city.wind.speed} <span className="text-base font-normal">m/s</span>
            </>
          }
          footer={`${windDir ? `${windDir} · ` : ""}Gusts ${city.wind.gust?.toFixed(1) ?? "—"}`}
        />

        <StatCard theme={theme} title="☀️ UV Index" value={loading ? "Loading…" : uv !== null ? uv.toFixed(1) : "Unavailable"} progressWidth={uv !== null ? `${Math.min(uv * 9, 100)}%` : undefined} progressClassName={uvLevel?.bar}>
          {uvLevel ? <p className={`text-xs mt-1 ${uvLevel.color}`}>{uvLevel.label}</p> : null}
        </StatCard>

        <StatCard
          theme={theme}
          title="🌡 Pressure"
          value={city.main.pressure}
          footer="hPa"
        >
          {city.visibility ? (
            <p className="text-white/40 text-xs mt-1">Vis: {(city.visibility / 1000).toFixed(1)} km</p>
          ) : null}
        </StatCard>
      </div>

      {!loading && forecastCards.length > 0 ? (
        <div className="relative z-10 px-4 pb-5">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2 px-1">Forecast</p>
          <div className="grid grid-cols-5 gap-1.5">
            {forecastCards.map((item) => (
              <ForecastCard key={item.dt} forecast={item} theme={theme} icon={item.icon} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
