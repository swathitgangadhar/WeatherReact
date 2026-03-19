export const API_KEY = "fcf4eeffbeb6d7effdb9fdbd5a8388f8";

const themeMap = {
  thunder: {
    key: "thunder",
    gradient: "linear-gradient(140deg, #09070f 0%, #1a1130 45%, #0a0f1f 100%)",
    surface: "rgba(38, 22, 72, 0.42)",
    surfaceBorder: "rgba(181, 152, 255, 0.2)",
    accent: "#d8c4ff",
    muted: "rgba(233, 224, 255, 0.72)",
    icon: "⛈️",
    particleType: "thunder",
    glow: "rgba(126, 87, 255, 0.36)",
  },
  snow: {
    key: "snow",
    gradient: "linear-gradient(160deg, #dcecff 0%, #f8fbff 45%, #c6d8ee 100%)",
    surface: "rgba(255, 255, 255, 0.44)",
    surfaceBorder: "rgba(255, 255, 255, 0.58)",
    accent: "#28476b",
    muted: "rgba(40, 71, 107, 0.68)",
    icon: "❄️",
    particleType: "snow",
    glow: "rgba(255, 255, 255, 0.42)",
  },
  rain: {
    key: "rain",
    gradient: "linear-gradient(160deg, #152034 0%, #264766 42%, #0d213d 100%)",
    surface: "rgba(22, 38, 62, 0.46)",
    surfaceBorder: "rgba(132, 176, 229, 0.2)",
    accent: "#bbdbff",
    muted: "rgba(219, 235, 255, 0.7)",
    icon: "🌧️",
    particleType: "rain",
    glow: "rgba(73, 141, 233, 0.28)",
  },
  drizzle: {
    key: "drizzle",
    gradient: "linear-gradient(150deg, #16353b 0%, #2f6668 48%, #143136 100%)",
    surface: "rgba(20, 55, 57, 0.42)",
    surfaceBorder: "rgba(136, 214, 209, 0.22)",
    accent: "#c2f4ef",
    muted: "rgba(210, 244, 241, 0.7)",
    icon: "💧",
    particleType: "drizzle",
    glow: "rgba(82, 218, 205, 0.26)",
  },
  clouds: {
    key: "clouds",
    gradient: "linear-gradient(160deg, #525d6d 0%, #6e7986 45%, #3f4854 100%)",
    surface: "rgba(255, 255, 255, 0.18)",
    surfaceBorder: "rgba(255, 255, 255, 0.24)",
    accent: "#f6f8fb",
    muted: "rgba(241, 244, 249, 0.7)",
    icon: "☁️",
    particleType: "clouds",
    glow: "rgba(255, 255, 255, 0.18)",
  },
  fog: {
    key: "fog",
    gradient: "linear-gradient(160deg, #6a757e 0%, #8c96a1 50%, #5d6670 100%)",
    surface: "rgba(228, 234, 240, 0.2)",
    surfaceBorder: "rgba(245, 247, 250, 0.24)",
    accent: "#ffffff",
    muted: "rgba(247, 249, 251, 0.72)",
    icon: "🌫️",
    particleType: "fog",
    glow: "rgba(245, 247, 250, 0.2)",
  },
  clearDay: {
    key: "clearDay",
    gradient: "linear-gradient(155deg, #57b1ff 0%, #6f85ff 48%, #3047bd 100%)",
    surface: "rgba(255, 255, 255, 0.22)",
    surfaceBorder: "rgba(255, 255, 255, 0.3)",
    accent: "#fff5bb",
    muted: "rgba(245, 248, 255, 0.74)",
    icon: "☀️",
    particleType: "sunny",
    glow: "rgba(255, 214, 92, 0.32)",
  },
  clearNight: {
    key: "clearNight",
    gradient: "linear-gradient(155deg, #090d23 0%, #18275b 48%, #050814 100%)",
    surface: "rgba(15, 23, 52, 0.42)",
    surfaceBorder: "rgba(142, 174, 255, 0.18)",
    accent: "#d7e1ff",
    muted: "rgba(222, 232, 255, 0.68)",
    icon: "🌙",
    particleType: "stars",
    glow: "rgba(115, 137, 255, 0.26)",
  },
};

export const getWeatherTheme = (condition, isDay = true) => {
  const normalizedCondition = condition?.toLowerCase() || "";

  if (normalizedCondition.includes("thunder") || normalizedCondition.includes("storm")) {
    return themeMap.thunder;
  }

  if (normalizedCondition.includes("snow") || normalizedCondition.includes("blizzard")) {
    return themeMap.snow;
  }

  if (normalizedCondition.includes("drizzle")) {
    return themeMap.drizzle;
  }

  if (normalizedCondition.includes("rain")) {
    return themeMap.rain;
  }

  if (
    normalizedCondition.includes("mist") ||
    normalizedCondition.includes("fog") ||
    normalizedCondition.includes("haze") ||
    normalizedCondition.includes("smoke")
  ) {
    return themeMap.fog;
  }

  if (normalizedCondition.includes("cloud") || normalizedCondition.includes("overcast")) {
    return themeMap.clouds;
  }

  return isDay ? themeMap.clearDay : themeMap.clearNight;
};

export const getUVLevel = (uvi) => {
  if (uvi <= 2) return { label: "Low", meterColor: "#6ee7b7" };
  if (uvi <= 5) return { label: "Moderate", meterColor: "#facc15" };
  if (uvi <= 7) return { label: "High", meterColor: "#fb923c" };
  if (uvi <= 10) return { label: "Very High", meterColor: "#f87171" };
  return { label: "Extreme", meterColor: "#c084fc" };
};

export const getWindDir = (deg) => {
  if (deg === undefined) return "";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
};
