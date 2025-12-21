import React from "react";
import { Sun, Cloud, CloudRain } from "lucide-react";

const DAYS = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ 7",
];

const getIcon = (type) => {
  switch (type) {
    case "sun":
      return <Sun className="w-6 h-6 text-yellow-400" />;
    case "rain":
      return <CloudRain className="w-6 h-6 text-blue-500" />;
    default:
      return <Cloud className="w-6 h-6 text-blue-400" />;
  }
};

const MonthCalendar = ({ monthData = [] }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // current month

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  /* ===== BUILD CALENDAR GRID ===== */
  const calendarCells = [];

  // Empty cells before day 1
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ empty: true });
  }

  // Real days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);

    const isToday =
      dateObj.toDateString() === today.toDateString();

    const isPast =
      dateObj < new Date(today.setHours(0, 0, 0, 0));

    const weather =
      monthData.find((d) => d.date === day) || {};

    calendarCells.push({
      day,
      isToday,
      isPast,
      ...weather,
    });
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Lịch thời tiết 30 ngày
      </h3>

      {/* WEEK HEADER */}
      <div className="grid grid-cols-7 mb-4 text-sm font-semibold">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-slate-500 dark:text-slate-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-3">
        {calendarCells.map((cell, idx) => {
          if (cell.empty) {
            return <div key={idx} />;
          }

          const base =
            "rounded-xl p-3 text-center transition-all";

          const bg = cell.isToday
            ? "bg-yellow-500/20 border-2 border-yellow-500"
            : cell.isPast
            ? "bg-slate-100 dark:bg-slate-700/40 opacity-60"
            : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/60 dark:hover:bg-slate-600/60";

          return (
            <div key={idx} className={`${base} ${bg}`}>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1">
                {cell.day}
              </div>

              <div className="flex justify-center mb-1">
                {getIcon(cell.iconType)}
              </div>

              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {cell.tempHigh}°
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400">
                {cell.tempLow}°
              </div>

              {cell.precipitation > 0 && (
                <div className="text-xs text-blue-500 mt-1">
                  💧 {cell.precipitation}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <div className="flex justify-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500/20 border-2 border-yellow-500 rounded" />
          <span className="text-slate-600 dark:text-slate-400">Hôm nay</span>
        </div>
        <div className="flex items-center gap-2"> 
          <div className="w-4 h-4 bg-slate-100 dark:bg-slate-700 rounded" />
          <span className="text-slate-600 dark:text-slate-400">Dự báo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700/40 opacity-60 rounded" />
          <span className="text-slate-600 dark:text-slate-400">Đã qua</span>
        </div>
      </div>
    </div>
  );
};

export default MonthCalendar;
