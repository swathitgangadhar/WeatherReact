import React from "react";
export default function ForecastCard({ forecast, theme, icon }) {
  return (
    <div className={`${theme.card} backdrop-blur-md rounded-xl p-2 text-center border ${theme.border}`}>
      <p className="text-white/50 text-xs">{forecast.label}</p>
      <p className="text-xl my-1">{icon}</p>
      <p className="text-sm font-semibold">{forecast.temperature}°</p>
      <p className="text-white/40 text-xs">{forecast.humidity}%</p>
    </div>
  );
}
