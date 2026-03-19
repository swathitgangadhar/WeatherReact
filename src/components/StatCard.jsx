import React from "react";

export default function StatCard({ title, value, footer, progressWidth, progressColor = "#7dd3fc", children }) {
  return (
    <div className="weather-stat-card fade-up">
      <p className="weather-stat-label">{title}</p>
      <p className="weather-stat-value">{value}</p>
      {progressWidth !== undefined ? (
        <div className="weather-progress-track">
          <div
            className="weather-progress-bar"
            style={{ width: progressWidth, background: progressColor }}
          />
        </div>
      ) : null}
      {footer ? <p className="weather-stat-footer">{footer}</p> : null}
      {children}
    </div>
  );
}
