import { useState } from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import { THEMES, getTheme } from './utils/theme';
import { fetchCurrentWeather } from './utils/api';

const globalStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  input::placeholder { color: rgba(255,255,255,0.38); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.18); border-radius: 4px; }
`;

export default function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [addedCities, setAddedCities] = useState(new Set());
  const [error, setError] = useState('');
  const [fetching, setFetching] = useState(false);

  const activeTheme =
    weatherData.length > 0
      ? getTheme(
          weatherData[0].weather[0].id,
          weatherData[0].dt > weatherData[0].sys.sunrise &&
            weatherData[0].dt < weatherData[0].sys.sunset
        )
      : THEMES.clear_day;

  const handleSearch = async (city) => {
    if (addedCities.has(city.toLowerCase())) {
      setError('This city is already on your list.');
      return;
    }
    setFetching(true);
    setError('');
    try {
      const data = await fetchCurrentWeather(city);
      setWeatherData((prev) => [data, ...prev]);
      setAddedCities((prev) => new Set([...prev, city.toLowerCase()]));
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setFetching(false);
    }
  };

  const handleRemove = (name) => {
    setWeatherData((prev) => prev.filter((c) => c.name !== name));
    setAddedCities((prev) => {
      const next = new Set(prev);
      next.delete(name.toLowerCase());
      return next;
    });
  };

  return (
    <>
      <style>{globalStyles}</style>

      <AnimatedBackground theme={activeTheme} />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: weatherData.length === 0 ? 'center' : 'flex-start',
          padding: '48px 20px 60px',
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 36,
            animation: 'fadeUp 0.5s ease both',
          }}
        >
          <h1
            style={{
              fontSize: 52,
              fontWeight: 100,
              color: activeTheme.text,
              letterSpacing: '0.28em',
              lineHeight: 1,
              margin: 0,
              transition: 'color 0.8s ease',
            }}
          >
            WEATHER
          </h1>
          <p
            style={{
              fontSize: 11,
              color: activeTheme.muted,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginTop: 8,
              transition: 'color 0.8s ease',
            }}
          >
            Live Global Conditions
          </p>
        </div>

        {/* Search */}
        <div
          style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <SearchBar onSearch={handleSearch} loading={fetching} theme={activeTheme} />
          {error && (
            <p
              style={{
                color: '#fca5a5',
                fontSize: 13,
                animation: 'fadeUp 0.3s ease',
                textAlign: 'center',
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Cards */}
        <div style={{ width: '100%', maxWidth: 600, marginTop: weatherData.length > 0 ? 28 : 0 }}>
          {weatherData.map((city) => (
            <WeatherCard key={city.id} city={city} onRemove={handleRemove} />
          ))}
        </div>

        {/* Empty state */}
        {weatherData.length === 0 && !fetching && (
          <div
            style={{
              textAlign: 'center',
              color: activeTheme.muted,
              marginTop: 48,
              animation: 'fadeUp 0.9s ease both',
            }}
          >
            <div style={{ fontSize: 58, marginBottom: 14 }}>🌍</div>
            <p style={{ fontSize: 15, fontWeight: 300, color: activeTheme.text }}>
              Search any city to see live weather
            </p>
          </div>
        )}
      </div>
    </>
  );
}
