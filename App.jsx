import { useState, useEffect } from "react";

const API_KEY = "fcf4eeffbeb6d7effdb9fdbd5a8388f8";

const getWeatherTheme = (condition, isDay = true) => {
  const c = condition?.toLowerCase() || "";
  if (c.includes("thunder") || c.includes("storm"))
    return { bg: "from-gray-900 via-purple-950 to-gray-900", card: "bg-purple-950/40", accent: "text-purple-300", border: "border-purple-500/30", icon: "⛈️", particles: "thunder" };
  if (c.includes("snow") || c.includes("blizzard"))
    return { bg: "from-slate-600 via-blue-100 to-slate-300", card: "bg-white/30", accent: "text-blue-900", border: "border-white/50", icon: "❄️", particles: "snow" };
  if (c.includes("rain") || c.includes("drizzle") || c.includes("mist"))
    return { bg: "from-slate-800 via-slate-600 to-blue-900", card: "bg-slate-700/40", accent: "text-blue-200", border: "border-blue-400/20", icon: "🌧️", particles: "rain" };
  if (c.includes("cloud") || c.includes("overcast") || c.includes("fog"))
    return { bg: "from-gray-500 via-gray-400 to-slate-500", card: "bg-white/20", accent: "text-gray-100", border: "border-white/30", icon: "☁️", particles: "none" };
  if (isDay)
    return { bg: "from-sky-400 via-blue-500 to-indigo-600", card: "bg-white/20", accent: "text-yellow-200", border: "border-white/30", icon: "☀️", particles: "sun" };
  return { bg: "from-indigo-950 via-blue-950 to-slate-900", card: "bg-indigo-900/30", accent: "text-indigo-200", border: "border-indigo-400/20", icon: "🌙", particles: "stars" };
};

const WeatherParticles = ({ type }) => {
  if (type === "rain" || type === "thunder") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="absolute top-0 w-px bg-blue-300/40" style={{ left: `${Math.random() * 100}%`, height: `${12 + Math.random() * 18}px`, animationDelay: `${Math.random() * 2}s`, animation: `rainFall ${0.4 + Math.random() * 0.5}s linear infinite` }} />
        ))}
      </div>
    );
  }
  if (type === "snow") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div key={i} className="absolute top-0 text-white/60 text-xs" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 4}s`, animation: `snowFall ${3 + Math.random() * 3}s linear infinite` }}>❄</div>
        ))}
      </div>
    );
  }
  if (type === "sun") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-6 right-10 w-28 h-28 bg-yellow-300/25 rounded-full blur-2xl" style={{ animation: "pulse 3s ease-in-out infinite" }} />
        <div className="absolute top-3 right-6 w-14 h-14 bg-yellow-100/20 rounded-full blur-lg" style={{ animation: "pulse 2s ease-in-out infinite 1s" }} />
      </div>
    );
  }
  if (type === "stars") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-white rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, opacity: Math.random() * 0.7 + 0.2, animation: `twinkle ${1 + Math.random() * 2}s ease-in-out infinite`, animationDelay: `${Math.random() * 2}s` }} />
        ))}
      </div>
    );
  }
  return null;
};

const getUVLevel = (uvi) => {
  if (uvi <= 2) return { label: "Low", color: "text-green-400", bar: "bg-green-400" };
  if (uvi <= 5) return { label: "Moderate", color: "text-yellow-400", bar: "bg-yellow-400" };
  if (uvi <= 7) return { label: "High", color: "text-orange-400", bar: "bg-orange-400" };
  if (uvi <= 10) return { label: "Very High", color: "text-red-400", bar: "bg-red-400" };
  return { label: "Extreme", color: "text-purple-400", bar: "bg-purple-400" };
};

const getWindDir = (deg) => {
  if (deg === undefined) return "";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

const WeatherCard = ({ city, onRemove }) => {
  const [forecast, setForecast] = useState([]);
  const [oneCall, setOneCall] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDay = city.dt > city.sys.sunrise && city.dt < city.sys.sunset;
  const theme = getWeatherTheme(city.weather[0].main, isDay);

  useEffect(() => {
    const fetchExtra = async () => {
      try {
        const [foreRes, oneRes] = await Promise.all([
          fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&units=metric&cnt=5&appid=${API_KEY}`),
          fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`),
        ]);
        if (foreRes.ok) { const d = await foreRes.json(); setForecast(d.list.slice(0, 5)); }
        if (oneRes.ok) { const d = await oneRes.json(); setOneCall(d); }
      } catch (_) {}
      setLoading(false);
    };
    fetchExtra();
  }, [city.name]);

  const uv = oneCall?.current?.uvi ?? null;
  const uvLevel = uv !== null ? getUVLevel(uv) : null;
  const windDir = getWindDir(city.wind.deg);

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${theme.bg} text-white shadow-2xl mb-6`}>
      <WeatherParticles type={theme.particles} />

      {/* Header */}
      <div className="relative z-10 p-6 pb-2 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <span className="text-5xl">{theme.icon}</span>
          <div>
            <h2 className="text-2xl font-bold">{city.name}, {city.sys.country}</h2>
            <p className={`text-sm ${theme.accent} capitalize`}>{city.weather[0].description}</p>
          </div>
        </div>
        <button onClick={() => onRemove(city.name)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-400/60 flex items-center justify-center transition-all text-sm">✕</button>
      </div>

      {/* Temperature */}
      <div className="relative z-10 px-6 pb-4 flex items-end gap-4">
        <span className="text-9xl font-thin leading-none">{Math.round(city.main.temp)}°</span>
        <div className="pb-4 text-white/60 text-sm space-y-0.5">
          <p>Feels like {Math.round(city.main.feels_like)}°C</p>
          <p>↑ {Math.round(city.main.temp_max)}° &nbsp;↓ {Math.round(city.main.temp_min)}°</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="relative z-10 px-4 pb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {/* Humidity */}
        <div className={`${theme.card} backdrop-blur-md rounded-2xl p-3 border ${theme.border}`}>
          <p className="text-white/50 text-xs mb-1">💧 Humidity</p>
          <p className="text-2xl font-semibold">{city.main.humidity}%</p>
          <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${city.main.humidity}%` }} />
          </div>
        </div>

        {/* Wind */}
        <div className={`${theme.card} backdrop-blur-md rounded-2xl p-3 border ${theme.border}`}>
          <p className="text-white/50 text-xs mb-1">💨 Wind</p>
          <p className="text-2xl font-semibold">{city.wind.speed} <span className="text-base font-normal">m/s</span></p>
          <p className="text-white/50 text-xs mt-1">{windDir && `${windDir} · `}Gusts {city.wind.gust?.toFixed(1) ?? "—"}</p>
        </div>

        {/* UV Index */}
        <div className={`${theme.card} backdrop-blur-md rounded-2xl p-3 border ${theme.border}`}>
          <p className="text-white/50 text-xs mb-1">☀️ UV Index</p>
          {uv !== null ? (
            <>
              <p className={`text-2xl font-semibold ${uvLevel.color}`}>{uv.toFixed(1)}</p>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full ${uvLevel.bar} rounded-full`} style={{ width: `${Math.min(uv * 9, 100)}%` }} />
              </div>
              <p className={`text-xs mt-1 ${uvLevel.color}`}>{uvLevel.label}</p>
            </>
          ) : loading ? <p className="text-white/30 text-sm">Loading…</p> : <p className="text-white/40 text-sm">Unavailable</p>}
        </div>

        {/* Pressure */}
        <div className={`${theme.card} backdrop-blur-md rounded-2xl p-3 border ${theme.border}`}>
          <p className="text-white/50 text-xs mb-1">🌡 Pressure</p>
          <p className="text-2xl font-semibold">{city.main.pressure}</p>
          <p className="text-white/50 text-xs mt-1">hPa</p>
          {city.visibility && <p className="text-white/40 text-xs mt-1">Vis: {(city.visibility / 1000).toFixed(1)} km</p>}
        </div>
      </div>

      {/* 5-Step Forecast */}
      {!loading && forecast.length > 0 && (
        <div className="relative z-10 px-4 pb-5">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2 px-1">Forecast</p>
          <div className="grid grid-cols-5 gap-1.5">
            {forecast.map((f, i) => {
              const time = new Date(f.dt * 1000);
              const label = i === 0 ? "Now" : time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
              const fTheme = getWeatherTheme(f.weather[0].main, true);
              return (
                <div key={f.dt} className={`${theme.card} backdrop-blur-md rounded-xl p-2 text-center border ${theme.border}`}>
                  <p className="text-white/50 text-xs">{label}</p>
                  <p className="text-xl my-1">{fTheme.icon}</p>
                  <p className="text-sm font-semibold">{Math.round(f.main.temp)}°</p>
                  <p className="text-white/40 text-xs">{f.main.humidity}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

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
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
      if (res.ok) {
        const data = await res.json();
        setWeatherData((prev) => [data, ...prev]);
        setCities((prev) => [city.toLowerCase(), ...prev]);
      } else {
        setError("City not found. Please try again.");
      }
    } catch {
      setError("Network error. Check your connection.");
    }
    setFetching(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (cities.includes(trimmed.toLowerCase())) { setError("City already added."); return; }
    fetchWeather(trimmed);
    setQuery("");
  };

  const removeCity = (name) => {
    setWeatherData((prev) => prev.filter((c) => c.name !== name));
    setCities((prev) => prev.filter((c) => c !== name.toLowerCase()));
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
              onChange={(e) => { setQuery(e.target.value); setError(""); }}
              placeholder="Search any city…"
              className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/30 rounded-2xl px-5 py-3 outline-none focus:border-white/50 transition-all"
            />
            <button type="submit" disabled={fetching} className="bg-white text-slate-900 font-semibold px-7 py-3 rounded-2xl hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50">
              {fetching ? "…" : "Search"}
            </button>
          </form>

          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

          {weatherData.map((city) => (
            <WeatherCard key={city.id} city={city} onRemove={removeCity} />
          ))}

          {weatherData.length === 0 && !fetching && (
            <div className="text-center text-white/20 mt-24">
              <p className="text-7xl mb-4">🌍</p>
              <p className="text-lg font-light">Search a city to see live weather</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
