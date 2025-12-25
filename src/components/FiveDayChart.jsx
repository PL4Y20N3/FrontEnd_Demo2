import React from "react";
import { Sun, Cloud, CloudRain, Moon } from "lucide-react";

/* ================= ICON ================= */
const WeatherIcon = ({ type }) => {
  const cls = "w-6 h-6";
  switch (type) {
    case "sun":
      return <Sun className={`${cls} text-yellow-400`} />;
    case "rain":
      return <CloudRain className={`${cls} text-blue-400`} />;
    case "moon":
      return <Moon className={`${cls} text-blue-300`} />;
    default:
      return <Cloud className={`${cls} text-sky-400`} />;
  }
};

/* ================= COMPONENT ================= */
const FiveDayChart = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-slate-400 text-center py-6">
        Không có dữ liệu dự báo 5 ngày
      </div>
    );
  }

  return (
    <div
      className="
        rounded-3xl p-6
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        transition-colors
      "
    >
      <div className="grid grid-cols-5 gap-4">
        {data.map((d, i) => (
          <div
            key={i}
            className="
              rounded-2xl p-4 text-center
              bg-slate-50 dark:bg-slate-700/50
              hover:bg-slate-100 dark:hover:bg-slate-700
              transition
            "
          >
            {/* DAY */}
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {d.day}
            </div>
            <div className="text-xs text-slate-400 mb-2">
              {d.date}
            </div>

            {/* ICON */}
            <div className="flex justify-center mb-3">
              <WeatherIcon type={d.iconType} />
            </div>

            {/* TEMP */}
            <div className="flex justify-center items-center gap-1 mb-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {d.tempMax}°
              </span>
              <span className="text-sm text-slate-400">
                {d.tempMin}°
              </span>
            </div>

            {/* RAIN */}
            <div className="text-xs text-blue-500 font-medium">
              ☔ {d.precipitation}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiveDayChart;
