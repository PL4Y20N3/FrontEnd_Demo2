import React from "react";

/**
 * Props:
 * - condition: string (Sunny, Rain, Thunderstorm, Cloudy, Mist...)
 * - isDay: boolean
 * - blur?: number (px)
 * - overlay?: number (0–1)
 * - rounded?: boolean
 */

const WeatherBackground = ({
  condition = "Clear",
  isDay = true,
  blur = 12,
  overlay = 0.45,
  rounded = true,
}) => {
  const weather = condition.toLowerCase();

  const getVideoBackground = (condition, isDay) => {
  const weather = (condition || '').toLowerCase();

  if (!isDay) return nightVideo;
  if (weather.includes('rain')) return rainVideo;
  if (weather.includes('thunder') || weather.includes('storm')) return stormVideo;
  if (weather.includes('snow')) return snowVideo;
  if (weather.includes('fog') || weather.includes('mist')) return fogVideo;
  if (weather.includes('cloud')) return cloudyVideo;

  return clearVideo;
};


  const bg = getBackground();
  const isVideo = bg.endsWith(".mp4");

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${
        rounded ? "rounded-3xl" : ""
      }`}
    >
      {/* BACKGROUND MEDIA */}
      {isVideo ? (
        <video
          src={bg}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <img
          src={bg}
          alt="weather background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* BLUR */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
        }}
      />

      {/* DARK OVERLAY */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(0,0,0,${overlay})`,
        }}
      />
    </div>
  );
};

export default WeatherBackground;
