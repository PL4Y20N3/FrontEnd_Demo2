import React, { useMemo } from "react";
import { Sun, Cloud, CloudRain, Moon } from "lucide-react";

/* ===================== CONSTANTS ===================== */
const HEIGHT = 270;
const TOP_PADDING = 56;
const BOTTOM_PADDING = 32;
const MIN_TEMP_RANGE = 5;
const ITEM_WIDTH = 72;
const MIN_WIDTH = 860;

/* ===================== ICON ===================== */
const WeatherIcon = React.memo(({ type }) => {
  switch (type) {
    case "sun":
      return <Sun className="w-6 h-6 text-yellow-400" />;
    case "moon":
      return <Moon className="w-6 h-6 text-blue-400" />;
    case "rain":
      return <CloudRain className="w-6 h-6 text-blue-500" />;
    default:
      return <Cloud className="w-6 h-6 text-sky-400" />;
  }
});

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

/* ===================== MAIN COMPONENT ===================== */
const MSNWeatherChart = ({ data }) => {
  /** ========== SAFE GUARD ========== */
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-[260px] flex items-center justify-center text-slate-400">
        Không có dữ liệu thời tiết
      </div>
    );
  }

  /** ========== PRE-CALC ========== */
  const {
    width,
    points,
    curvePath,
    fillPath
  } = useMemo(() => {
    const totalWidth = data.length * ITEM_WIDTH;
    const width = Math.max(totalWidth, MIN_WIDTH);

    const temps = data.map(d => d.temp);
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const range = Math.max(maxTemp - minTemp, MIN_TEMP_RANGE);

    const scaleY = (temp) => {
      const normalized = clamp((temp - minTemp) / range, 0.05, 0.95);
      const CHART_TOP = TOP_PADDING + 24;
      return CHART_TOP + (1 - normalized) * (HEIGHT - CHART_TOP - BOTTOM_PADDING);
    };

    const points = data.map((d, i) => ({
      x: i * ITEM_WIDTH + ITEM_WIDTH / 2,
      y: scaleY(d.temp),
    }));

    const curvePath = buildSmoothPath(points);
    const fillPath = `${curvePath} L ${width} ${HEIGHT} L 0 ${HEIGHT} Z`;

    return { width, points, curvePath, fillPath };
  }, [data]);

  /** ========== RENDER ========== */
  return (
    <div
      className="overflow-x-auto rounded-2xl p-4 bg-white dark:bg-slate-800 transition-colors"
      style={{ maxWidth: "100%" }}
    >
      <div
        style={{
          width,
          "--grid": "rgb(203 213 225)",
          "--text": "rgb(30 41 59)",
          "--curve": "rgb(16 185 129)",
        }}
        className="
          dark:[--grid:rgba(255,255,255,0.35)]
          dark:[--text:#ffffff]
          dark:[--curve:#34d399]
        "
      >
        <svg width={width} height={HEIGHT}>
          {/* ===== DEFINITIONS ===== */}
          <defs>
            <linearGradient id="msnGradient" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="40%" stopColor="#34D399" />
              <stop offset="70%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>

            <linearGradient id="fadeDown" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>

            <mask id="fadeMask">
              <rect width={width} height={HEIGHT} fill="url(#fadeDown)" />
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
                stroke="var(--grid)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* ===== AREA ===== */}
          <path
            d={fillPath}
            fill="url(#msnGradient)"
            mask="url(#fadeMask)"
            opacity="0.75"
          />

          {/* ===== CURVE ===== */}
          <path
            d={curvePath}
            fill="none"
            stroke="var(--curve)"
            strokeWidth="2.5"
          />

          {/* ===== LABELS ===== */}
          {data.map((d, i) => (
            <g key={i}>
              <text
                x={points[i].x}
                y={points[i].y - 18}
                textAnchor="middle"
                fill="var(--text)"
                fontSize="15"
                fontWeight="700"
              >
                {d.temp}°
              </text>

              <text
                x={points[i].x}
                y={26}
                textAnchor="middle"
                fill="var(--text)"
                fontSize="12"
                opacity="0.85"
              >
                {d.time}
              </text>
            </g>
          ))}
        </svg>

        {/* ===== ICON OVERLAY ===== */}
        <div
          className="relative pointer-events-none"
          style={{ marginTop: `-${HEIGHT}px`, height: HEIGHT }}
        >
          {data.map((d, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: points[i].x,
                top: points[i].y - 50,
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

export default MSNWeatherChart;
