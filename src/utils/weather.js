export const API_KEY = "fcf4eeffbeb6d7effdb9fdbd5a8388f8";

export const getWeatherTheme = (condition, isDay = true) => {
  const normalizedCondition = condition?.toLowerCase() || "";

  if (normalizedCondition.includes("thunder") || normalizedCondition.includes("storm")) {
    return {
      bg: "from-gray-900 via-purple-950 to-gray-900",
      card: "bg-purple-950/40",
      accent: "text-purple-300",
      border: "border-purple-500/30",
      icon: "⛈️",
      particles: "thunder",
    };
  }

  if (normalizedCondition.includes("snow") || normalizedCondition.includes("blizzard")) {
    return {
      bg: "from-slate-600 via-blue-100 to-slate-300",
      card: "bg-white/30",
      accent: "text-blue-900",
      border: "border-white/50",
      icon: "❄️",
      particles: "snow",
    };
  }

  if (
    normalizedCondition.includes("rain") ||
    normalizedCondition.includes("drizzle") ||
    normalizedCondition.includes("mist")
  ) {
    return {
      bg: "from-slate-800 via-slate-600 to-blue-900",
      card: "bg-slate-700/40",
      accent: "text-blue-200",
      border: "border-blue-400/20",
      icon: "🌧️",
      particles: "rain",
    };
  }

  if (
    normalizedCondition.includes("cloud") ||
    normalizedCondition.includes("overcast") ||
    normalizedCondition.includes("fog")
  ) {
    return {
      bg: "from-gray-500 via-gray-400 to-slate-500",
      card: "bg-white/20",
      accent: "text-gray-100",
      border: "border-white/30",
      icon: "☁️",
      particles: "none",
    };
  }

  if (isDay) {
    return {
      bg: "from-sky-400 via-blue-500 to-indigo-600",
      card: "bg-white/20",
      accent: "text-yellow-200",
      border: "border-white/30",
      icon: "☀️",
      particles: "sun",
    };
  }

  return {
    bg: "from-indigo-950 via-blue-950 to-slate-900",
    card: "bg-indigo-900/30",
    accent: "text-indigo-200",
    border: "border-indigo-400/20",
    icon: "🌙",
    particles: "stars",
  };
};

export const getUVLevel = (uvi) => {
  if (uvi <= 2) return { label: "Low", color: "text-green-400", bar: "bg-green-400" };
  if (uvi <= 5) return { label: "Moderate", color: "text-yellow-400", bar: "bg-yellow-400" };
  if (uvi <= 7) return { label: "High", color: "text-orange-400", bar: "bg-orange-400" };
  if (uvi <= 10) return { label: "Very High", color: "text-red-400", bar: "bg-red-400" };
  return { label: "Extreme", color: "text-purple-400", bar: "bg-purple-400" };
};

export const getWindDir = (deg) => {
  if (deg === undefined) return "";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
};
