import React from "react";
const createParticles = (count, factory) => Array.from({ length: count }, (_, index) => ({
  id: index,
  ...factory(),
}));

const rainDrops = createParticles(35, () => ({
  left: `${Math.random() * 100}%`,
  height: `${12 + Math.random() * 18}px`,
  animationDelay: `${Math.random() * 2}s`,
  animation: `rainFall ${0.4 + Math.random() * 0.5}s linear infinite`,
}));

const snowFlakes = createParticles(25, () => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 4}s`,
  animation: `snowFall ${3 + Math.random() * 3}s linear infinite`,
}));

const stars = createParticles(40, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 60}%`,
  opacity: Math.random() * 0.7 + 0.2,
  animation: `twinkle ${1 + Math.random() * 2}s ease-in-out infinite`,
  animationDelay: `${Math.random() * 2}s`,
}));

export default function WeatherParticles({ type }) {
  if (type === "rain" || type === "thunder") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute top-0 w-px bg-blue-300/40"
            style={drop}
          />
        ))}
      </div>
    );
  }

  if (type === "snow") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {snowFlakes.map((flake) => (
          <div
            key={flake.id}
            className="absolute top-0 text-white/60 text-xs"
            style={flake}
          >
            ❄
          </div>
        ))}
      </div>
    );
  }

  if (type === "sun") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-6 right-10 w-28 h-28 bg-yellow-300/25 rounded-full blur-2xl"
          style={{ animation: "pulse 3s ease-in-out infinite" }}
        />
        <div
          className="absolute top-3 right-6 w-14 h-14 bg-yellow-100/20 rounded-full blur-lg"
          style={{ animation: "pulse 2s ease-in-out infinite 1s" }}
        />
      </div>
    );
  }

  if (type === "stars") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div key={star.id} className="absolute w-1 h-1 bg-white rounded-full" style={star} />
        ))}
      </div>
    );
  }

  return null;
}
