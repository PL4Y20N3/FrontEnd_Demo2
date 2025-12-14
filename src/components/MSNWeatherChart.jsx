import React from "react";
import { Sun, Cloud, CloudRain, Moon } from "lucide-react";

/* ===================== CONFIG ===================== */
const HEIGHT = 270;
const TOP_PADDING = 56;
const BOTTOM_PADDING = 32;
const MIN_TEMP_RANGE = 5;
const ITEM_WIDTH = 72;

/* ===================== ICON ===================== */
const WeatherIcon = ({ type }) => {
  switch (type) {
    case "sun":
      return <Sun className="w-6 h-6 text-yellow-400" />;
    case "moon":
      return <Moon className="w-6 h-6 text-blue-300" />;
    case "rain":
      return <CloudRain className="w-6 h-6 text-blue-400" />;
    default:
      return <Cloud className="w-6 h-6 text-blue-200" />;
  }
};

/* ===================== UTILS ===================== */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const buildSmoothPath = (points) => {
  if (points.length < 2) return "";

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    const cx = (prev.x + curr.x) / 2;
    d += ` Q ${cx} ${prev.y} ${curr.x} ${curr.y}`;
  }

  return d;
};

/* ===================== COMPONENT ===================== */
const MSNWeatherChart = ({ data = [] }) => {
  if (!data.length) return null;

  // Tính toán chiều rộng dựa trên số lượng điểm dữ liệu
  const totalWidth = data.length * ITEM_WIDTH;
  const width = Math.max(totalWidth, 860);

  /* ---------- TEMP RANGE (ANTI JUMP) ---------- */
  const rawMax = Math.max(...data.map(d => d.temp));
  const rawMin = Math.min(...data.map(d => d.temp));

  const range = Math.max(rawMax - rawMin, MIN_TEMP_RANGE);
  const maxTemp = rawMin + range;
  const minTemp = rawMin;

  /* ---------- SCALE ---------- */
  const scaleY = (t) => {
    const normalized = clamp((t - minTemp) / range, 0.05, 0.95);
    const CHART_TOP = TOP_PADDING + 24;

    return CHART_TOP +
      (1 - normalized) * (HEIGHT - CHART_TOP - BOTTOM_PADDING);
  };

  const points = data.map((d, i) => ({
    x: i * ITEM_WIDTH + ITEM_WIDTH / 2,
    y: scaleY(d.temp),
  }));

  const curvePath = buildSmoothPath(points);
  const fillPath = `
    ${curvePath}
    L ${width} ${HEIGHT}
    L 0 ${HEIGHT}
    Z
  `;

  return (
    <div className="overflow-x-auto bg-slate-800 rounded-lg" style={{ maxWidth: '100%' }}>
      <div style={{ width: `${width}px`, minWidth: `${width}px` }}>
        <svg
          width={width}
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* ===== GRADIENT ===== */}
          <defs>
            <linearGradient id="msnGradient" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#4FC3F7" />
              <stop offset="40%" stopColor="#81C784" />
              <stop offset="70%" stopColor="#FFF176" />
              <stop offset="100%" stopColor="#FF8A65" />
            </linearGradient>

            <linearGradient id="fadeDown" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <mask id="fadeMask">
              <rect x="0" y="0" width={width} height={HEIGHT} fill="url(#fadeDown)" />
            </mask>
          </defs>

          {/* ===== GRID ===== */}
          {[0.2, 0.4, 0.6, 0.8].map((p, i) => {
            const y = TOP_PADDING + p * (HEIGHT - TOP_PADDING - BOTTOM_PADDING);
            return (
              <line
                key={i}
                x1="0"
                x2={width}
                y1={y}
                y2={y}
                stroke="#ffffff22"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* ===== FILL ===== */}
          <path
            d={fillPath}
            fill="url(#msnGradient)"
            mask="url(#fadeMask)"
            opacity="0.85"
          />

          {/* ===== CURVE ===== */}
          <path
            d={curvePath}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
          />

          {/* ===== LABELS ===== */}
          {data.map((d, i) => (
            <g key={i}>
              <text
                x={points[i].x}
                y={points[i].y - 18}
                textAnchor="middle"
                fill="#fff"
                fontSize="15"
                fontWeight="600"
              >
                {d.temp}°
              </text>

              <text
                x={points[i].x}
                y={24}
                textAnchor="middle"
                fill="#cfd8dc"
                fontSize="12"
              >
                {d.time}
              </text>
            </g>
          ))}
        </svg>

        {/* ===== ICON OVERLAY ===== */}
        <div
          className="relative"
          style={{
            marginTop: `-${HEIGHT}px`,
            height: HEIGHT,
            width: `${width}px`,
            pointerEvents: "none",
          }}
        >
          {data.map((d, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${points[i].x}px`,
                top: `${points[i].y - 50}px`,
                transform: "translateX(-50%)",
              }}
            >
              <WeatherIcon type={d.iconType} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Demo data với 24 giờ
const DemoApp = () => {
  const weatherData = [
    { time: "00:00", temp: 24, iconType: "moon" },
    { time: "01:00", temp: 22, iconType: "moon" },
    { time: "02:00", temp: 22, iconType: "moon" },
    { time: "03:00", temp: 22, iconType: "moon" },
    { time: "04:00", temp: 22, iconType: "moon" },
    { time: "05:00", temp: 22, iconType: "moon" },
    { time: "06:00", temp: 21, iconType: "moon" },
    { time: "07:00", temp: 23, iconType: "sun" },
    { time: "08:00", temp: 25, iconType: "sun" },
    { time: "09:00", temp: 27, iconType: "sun" },
    { time: "10:00", temp: 29, iconType: "sun" },
    { time: "11:00", temp: 31, iconType: "sun" },
    { time: "12:00", temp: 32, iconType: "sun" },
    { time: "13:00", temp: 33, iconType: "sun" },
    { time: "14:00", temp: 33, iconType: "sun" },
    { time: "15:00", temp: 32, iconType: "cloud" },
    { time: "16:00", temp: 31, iconType: "cloud" },
    { time: "17:00", temp: 30, iconType: "cloud" },
    { time: "18:00", temp: 28, iconType: "rain" },
    { time: "19:00", temp: 27, iconType: "rain" },
    { time: "20:00", temp: 26, iconType: "cloud" },
    { time: "21:00", temp: 25, iconType: "moon" },
    { time: "22:00", temp: 24, iconType: "moon" },
    { time: "23:00", temp: 24, iconType: "moon" },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Biểu đồ nhiệt độ 24 giờ
        </h1>
        <MSNWeatherChart data={weatherData} />
      </div>
    </div>
  );
};

export default DemoApp;