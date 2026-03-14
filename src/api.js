const API_KEY = 'fcf4eeffbeb6d7effdb9fdbd5a8388f8';
const BASE = 'https://api.openweathermap.org/data/2.5';

export const fetchCurrentWeather = async (city) => {
  const res = await fetch(`${BASE}/weather?q=${city}&units=metric&appid=${API_KEY}`);
  if (!res.ok) throw new Error(res.status === 404 ? 'City not found.' : 'Something went wrong.');
  return res.json();
};

export const fetchForecast = async (city) => {
  const res = await fetch(`${BASE}/forecast?q=${city}&units=metric&cnt=5&appid=${API_KEY}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.list?.slice(0, 5) ?? [];
};

export const fetchOneCall = async (lat, lon) => {
  const res = await fetch(`${BASE}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`);
  if (!res.ok) return null;
  return res.json();
};
