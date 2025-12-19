import React from "react";
import { Sun, Cloud, CloudRain, Moon } from "lucide-react";

/* ================= CONFIG ================= */
const CHART_HEIGHT = 180;
const TOP_MARGIN = 42;
const BOTTOM_MARGIN = 28;
const ITEM_WIDTH = 40;

/* ================= ICON ================= */
const WeatherIcon = ({ type }) => {
  const cls = "w-4 h-4";
  switch (type) {
    case "sun":
      return <Sun className={`${cls} text-yellow-400`} />;
    case "rain":
      return <CloudRain className={`${cls} text-blue-400`} />;
    case "moon":
      return <Moon className={`${cls} text-blue-300`} />;
    default:
      return <Cloud className={`${cls} text-blue-300`} />;
  }
};

/* ================= COMPONENT ================= */
const FiveDayChart = ({ data = [] }) => {
  if (!data.length) return null;

  /* ---------- WIDTH ---------- */
  const totalHours = data.reduce((s, d) => s + d.hourly.length, 0);
  const chartWidth = totalHours * ITEM_WIDTH;

  /* ---------- TEMP RANGE ---------- */
  const temps = data.flatMap(d => d.hourly.map(h => h.temp));
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = Math.max(maxTemp - minTemp, 8);

  const scaleY = (t) => {
    const plot = CHART_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;
    return TOP_MARGIN + plot * (1 - (t - minTemp) / range);
  };

  /* ---------- FLATTEN DATA ---------- */
  let xOffset = 0;
  const points = [];

  data.forEach((day) => {
    day.hourly.forEach((h, i) => {
      points.push({
        ...h,
        x: xOffset + i * ITEM_WIDTH + ITEM_WIDTH / 2,
      });
    });
    xOffset += day.hourly.length * ITEM_WIDTH;
  });

  /* ---------- CURVE ---------- */
  const curvePath = points.reduce((d, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${scaleY(p.temp)}`;
    const prev = arr[i - 1];
    const cx = (prev.x + p.x) / 2;
    return d + ` Q ${cx} ${scaleY(prev.temp)} ${p.x} ${scaleY(p.temp)}`;
  }, "");

  const fillPath = `${curvePath} L ${chartWidth} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;

  /* ---------- DAY LABELS ---------- */
  let left = 0;
  const dayLabels = data.map(d => {
    const w = d.hourly.length * ITEM_WIDTH;
    const res = { ...d, left, width: w };
    left += w;
    return res;
  });

  return (
    <div className="bg-slate-900 rounded-2xl p-5">

      {/* DAY HEADER */}
      <div className="relative mb-2" style={{ height: 38 }}>
        {dayLabels.map((d, i) => (
          <div
            key={i}
            className="absolute text-center border-r border-slate-700 last:border-r-0"
            style={{ left: d.left, width: d.width }}
          >
            <div className="text-white text-xs font-semibold">{d.day}</div>
            <div className="text-slate-400 text-[10px]">{d.date}</div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="overflow-x-auto bg-slate-800 rounded-xl">
        <div
          style={{
            width: chartWidth,
            height: CHART_HEIGHT,
            position: "relative",
          }}
        >
          <svg
            width={chartWidth}
            height={CHART_HEIGHT}
            className="absolute inset-0"
          >
            <defs>
              <linearGradient id="temp5day" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#4FC3F7" />
                <stop offset="50%" stopColor="#81C784" />
                <stop offset="100%" stopColor="#FFD54F" />
              </linearGradient>

              <linearGradient id="fadeDown" y1="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>

              <mask id="fadeMask">
                <rect width={chartWidth} height={CHART_HEIGHT} fill="url(#fadeDown)" />
              </mask>
            </defs>

            {/* GRID */}
            {[0.25, 0.5, 0.75].map((p, i) => {
              const y = TOP_MARGIN + p * (CHART_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN);
              return (
                <line
                  key={i}
                  x1="0"
                  x2={chartWidth}
                  y1={y}
                  y2={y}
                  stroke="#ffffff14"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* FILL */}
            <path
              d={fillPath}
              fill="url(#temp5day)"
              mask="url(#fadeMask)"
              opacity="0.6"
            />

            {/* LINE */}
            <path
              d={curvePath}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />

            {/* PRECIP */}
            {points.map(
              (p, i) =>
                p.precipitation > 40 && (
                  <rect
                    key={i}
                    x={p.x - 6}
                    y={CHART_HEIGHT - BOTTOM_MARGIN + 6}
                    width={12}
                    height={(p.precipitation / 100) * 18}
                    fill="#4A90E2"
                    opacity="0.6"
                  />
                )
            )}
          </svg>

          {/* OVERLAY */}
          {points.map((p, i) => {
            const y = scaleY(p.temp);
            return (
              <div
                key={i}
                className="absolute text-center"
                style={{
                  left: p.x,
                  top: y - 28,
                  transform: "translateX(-50%)",
                  width: 36,
                }}
              >
                {i % 6 === 0 && <WeatherIcon type={p.iconType} />}
                <div className="text-white text-xs font-semibold">
                  {p.temp}°
                </div>
                {i % 3 === 0 && (
                  <div className="text-slate-400 text-[10px]">
                    {p.time}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FiveDayChart;
