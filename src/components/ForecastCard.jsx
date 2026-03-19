import React from "react";

export default function ForecastCard({ forecast, icon }) {
  return (
    <div className="forecast-card fade-up">
      <p className="forecast-time">{forecast.label}</p>
      <p className="forecast-icon" aria-hidden="true">{icon}</p>
      <p className="forecast-temp">{forecast.temperature}°</p>
      <p className="forecast-humidity">{forecast.humidity}% humidity</p>
    </div>
  );
}
