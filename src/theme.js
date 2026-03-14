export const THEMES = {
  thunderstorm: {
    id: 'thunderstorm',
    bg: ['#0f0c29', '#302b63', '#24243e'],
    accent: '#a78bfa',
    accentText: '#000',
    cardBg: 'rgba(30,20,60,0.55)',
    border: 'rgba(167,139,250,0.25)',
    text: '#e2d9f3',
    muted: 'rgba(226,217,243,0.5)',
    label: 'Thunderstorm',
    emoji: '⛈️',
    particles: 'lightning',
    barTrack: 'rgba(167,139,250,0.15)',
  },
  drizzle: {
    id: 'drizzle',
    bg: ['#1a2a3a', '#2d4a66', '#1a2a3a'],
    accent: '#93c5fd',
    accentText: '#0c2340',
    cardBg: 'rgba(20,40,65,0.55)',
    border: 'rgba(147,197,253,0.2)',
    text: '#dbeafe',
    muted: 'rgba(219,234,254,0.5)',
    label: 'Drizzle',
    emoji: '🌦️',
    particles: 'drizzle',
    barTrack: 'rgba(147,197,253,0.12)',
  },
  rain: {
    id: 'rain',
    bg: ['#1e3a5f', '#2d5382', '#1a2f4a'],
    accent: '#60a5fa',
    accentText: '#0a1f3a',
    cardBg: 'rgba(20,45,80,0.55)',
    border: 'rgba(96,165,250,0.2)',
    text: '#bfdbfe',
    muted: 'rgba(191,219,254,0.5)',
    label: 'Rain',
    emoji: '🌧️',
    particles: 'rain',
    barTrack: 'rgba(96,165,250,0.12)',
  },
  snow: {
    id: 'snow',
    bg: ['#c0cfe0', '#a8bfd4', '#d6e4f0'],
    accent: '#1e3a8a',
    accentText: '#fff',
    cardBg: 'rgba(255,255,255,0.38)',
    border: 'rgba(30,58,138,0.18)',
    text: '#1e3a5f',
    muted: 'rgba(30,58,95,0.5)',
    label: 'Snow',
    emoji: '❄️',
    particles: 'snow',
    barTrack: 'rgba(30,58,138,0.1)',
  },
  atmosphere: {
    id: 'atmosphere',
    bg: ['#5a6370', '#7a8490', '#5a6370'],
    accent: '#f0f4f8',
    accentText: '#2d3748',
    cardBg: 'rgba(90,100,115,0.45)',
    border: 'rgba(240,244,248,0.18)',
    text: '#f0f4f8',
    muted: 'rgba(240,244,248,0.5)',
    label: 'Fog',
    emoji: '🌫️',
    particles: 'fog',
    barTrack: 'rgba(240,244,248,0.1)',
  },
  clear_day: {
    id: 'clear_day',
    bg: ['#0ea5e9', '#38bdf8', '#0284c7'],
    accent: '#fde68a',
    accentText: '#713f12',
    cardBg: 'rgba(255,255,255,0.18)',
    border: 'rgba(255,255,255,0.3)',
    text: '#fff',
    muted: 'rgba(255,255,255,0.65)',
    label: 'Clear',
    emoji: '☀️',
    particles: 'sun',
    barTrack: 'rgba(255,255,255,0.15)',
  },
  clear_night: {
    id: 'clear_night',
    bg: ['#0f172a', '#1e1b4b', '#0f172a'],
    accent: '#c7d2fe',
    accentText: '#1e1b4b',
    cardBg: 'rgba(15,20,50,0.55)',
    border: 'rgba(199,210,254,0.2)',
    text: '#e0e7ff',
    muted: 'rgba(224,231,255,0.5)',
    label: 'Clear Night',
    emoji: '🌙',
    particles: 'stars',
    barTrack: 'rgba(199,210,254,0.1)',
  },
  clouds: {
    id: 'clouds',
    bg: ['#3d4f61', '#556070', '#334155'],
    accent: '#e2e8f0',
    accentText: '#1e293b',
    cardBg: 'rgba(45,60,80,0.5)',
    border: 'rgba(226,232,240,0.2)',
    text: '#f1f5f9',
    muted: 'rgba(241,245,249,0.5)',
    label: 'Cloudy',
    emoji: '☁️',
    particles: 'clouds',
    barTrack: 'rgba(226,232,240,0.1)',
  },
};

export const getTheme = (weatherId, isDay) => {
  if (weatherId >= 200 && weatherId < 300) return THEMES.thunderstorm;
  if (weatherId >= 300 && weatherId < 400) return THEMES.drizzle;
  if (weatherId >= 500 && weatherId < 600) return THEMES.rain;
  if (weatherId >= 600 && weatherId < 700) return THEMES.snow;
  if (weatherId >= 700 && weatherId < 800) return THEMES.atmosphere;
  if (weatherId === 800) return isDay ? THEMES.clear_day : THEMES.clear_night;
  return THEMES.clouds;
};

export const getUVInfo = (uvi) => {
  if (uvi <= 2) return { label: 'Low', color: '#4ade80' };
  if (uvi <= 5) return { label: 'Moderate', color: '#facc15' };
  if (uvi <= 7) return { label: 'High', color: '#fb923c' };
  if (uvi <= 10) return { label: 'Very High', color: '#f87171' };
  return { label: 'Extreme', color: '#c084fc' };
};

export const getWindDir = (deg) => {
  if (deg === undefined || deg === null) return '';
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];
};

export const getForecastEmoji = (weatherId, isDay = true) => {
  const t = getTheme(weatherId, isDay);
  return t.emoji;
};
