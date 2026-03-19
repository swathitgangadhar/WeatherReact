import React, { useEffect, useRef } from "react";

const createParticles = (type, width, height) => {
  const countMap = {
    sunny: 12,
    stars: 90,
    rain: 100,
    drizzle: 70,
    snow: 70,
    thunder: 120,
    clouds: 10,
    fog: 9,
  };

  const count = countMap[type] || 0;

  return Array.from({ length: count }, () => {
    if (type === "clouds") {
      return {
        x: Math.random() * width,
        y: Math.random() * height * 0.75,
        radius: 50 + Math.random() * 120,
        speed: 0.08 + Math.random() * 0.16,
        alpha: 0.06 + Math.random() * 0.12,
      };
    }

    if (type === "fog") {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 120 + Math.random() * 220,
        speed: 0.05 + Math.random() * 0.08,
        alpha: 0.03 + Math.random() * 0.06,
      };
    }

    if (type === "sunny") {
      return {
        x: width * (0.7 + Math.random() * 0.18),
        y: height * (0.12 + Math.random() * 0.18),
        radius: 35 + Math.random() * 80,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        alpha: 0.12 + Math.random() * 0.2,
      };
    }

    if (type === "stars") {
      return {
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        radius: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.05,
      };
    }

    if (type === "snow") {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 1,
        speedY: 0.35 + Math.random() * 0.8,
        drift: Math.random() * 0.8 + 0.2,
      };
    }

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      length: type === "drizzle" ? 10 + Math.random() * 10 : 16 + Math.random() * 22,
      speedY: type === "drizzle" ? 4 + Math.random() * 2 : 8 + Math.random() * 5,
      speedX: type === "drizzle" ? -0.6 : -1.2,
      alpha: type === "thunder" ? 0.28 + Math.random() * 0.18 : 0.16 + Math.random() * 0.12,
    };
  });
};

export default function DynamicBackgroundCanvas({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || typeof canvas.getContext !== "function") {
      return undefined;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return undefined;
    }

    let animationFrame;
    let particles = [];
    let lightningAlpha = 0;

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = createParticles(theme.particleType, window.innerWidth, window.innerHeight);
    };

    const drawParticleField = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (theme.particleType === "sunny") {
        particles.forEach((particle) => {
          particle.pulse += particle.speed;
          const radius = particle.radius + Math.sin(particle.pulse) * 8;
          const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, radius);
          gradient.addColorStop(0, `rgba(255, 226, 138, ${particle.alpha})`);
          gradient.addColorStop(1, "rgba(255, 226, 138, 0)");
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
          context.fill();
        });
      } else if (theme.particleType === "stars") {
        particles.forEach((particle) => {
          particle.pulse += particle.speed;
          context.fillStyle = `rgba(255,255,255, ${0.3 + Math.abs(Math.sin(particle.pulse)) * particle.alpha})`;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fill();
        });
      } else if (theme.particleType === "snow") {
        particles.forEach((particle) => {
          particle.y += particle.speedY;
          particle.x += Math.sin(particle.y * 0.01) * particle.drift;
          if (particle.y > window.innerHeight + 10) {
            particle.y = -10;
            particle.x = Math.random() * window.innerWidth;
          }
          context.fillStyle = "rgba(255,255,255,0.75)";
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fill();
        });
      } else if (theme.particleType === "clouds" || theme.particleType === "fog") {
        particles.forEach((particle) => {
          particle.x += particle.speed;
          if (particle.x - particle.radius > window.innerWidth) {
            particle.x = -particle.radius;
          }
          const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius);
          const alpha = theme.particleType === "fog" ? particle.alpha : particle.alpha + 0.03;
          gradient.addColorStop(0, `rgba(255,255,255, ${alpha})`);
          gradient.addColorStop(1, "rgba(255,255,255,0)");
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          context.fill();
        });
      } else if (["rain", "drizzle", "thunder"].includes(theme.particleType)) {
        particles.forEach((particle) => {
          particle.y += particle.speedY;
          particle.x += particle.speedX;
          if (particle.y > window.innerHeight + 20) {
            particle.y = -20;
            particle.x = Math.random() * window.innerWidth;
          }
          context.strokeStyle =
            theme.particleType === "drizzle"
              ? `rgba(181, 248, 242, ${particle.alpha})`
              : theme.particleType === "thunder"
                ? `rgba(193, 176, 255, ${particle.alpha})`
                : `rgba(162, 205, 255, ${particle.alpha})`;
          context.lineWidth = theme.particleType === "drizzle" ? 1 : 1.25;
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(particle.x + particle.speedX * 2, particle.y + particle.length);
          context.stroke();
        });

        if (theme.particleType === "thunder") {
          if (Math.random() > 0.992) {
            lightningAlpha = 0.28 + Math.random() * 0.2;
          }
          if (lightningAlpha > 0.01) {
            context.fillStyle = `rgba(221, 216, 255, ${lightningAlpha})`;
            context.fillRect(0, 0, window.innerWidth, window.innerHeight);
            lightningAlpha *= 0.86;
          }
        }
      }

      animationFrame = window.requestAnimationFrame(drawParticleField);
    };

    resizeCanvas();
    drawParticleField();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="app-background-canvas" aria-hidden="true" />;
}
