import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';

const MonthCalendar = ({ monthData, currentDay }) => {
  const getWeatherIcon = (type, size = 'w-8 h-8') => {
    switch(type) {
      case 'sun': return <Sun className={`${size} text-yellow-400`} />;
      case 'cloud': return <Cloud className={`${size} text-blue-300`} />;
      case 'rain': return <CloudRain className={`${size} text-blue-400`} />;
      default: return <Cloud className={`${size} text-blue-300`} />;
    }
  };

  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ 7'];

  return (
    <div className="bg-gray-800/90 backdrop-blur-md rounded-3xl p-6 border border-gray-700/50">
      <h3 className="text-white text-2xl font-bold mb-6">Lịch thời tiết 30 ngày</h3>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="text-center text-gray-400 text-sm font-semibold py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {monthData.map((day, idx) => {
          const isCurrentDay = day.date === currentDay;
          const isPastDay = day.isPast;
          
          return (
            <div
              key={idx}
              className={`
                relative rounded-xl p-3 transition-all
                ${isCurrentDay 
                  ? 'bg-yellow-500/20 border-2 border-yellow-500' 
                  : isPastDay
                    ? 'bg-gray-700/30 opacity-60'
                    : 'bg-gray-700/50 hover:bg-gray-600/50'
                }
                ${day.isEmpty ? 'invisible' : ''}
              `}
            >
              {!day.isEmpty && (
                <>
                  {/* Date */}
                  <div className="text-gray-300 text-xs font-semibold mb-2">
                    {day.date}
                  </div>

                  {/* Weather Icon */}
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.iconType, 'w-6 h-6')}
                  </div>

                  {/* Temperature */}
                  <div className="text-center">
                    <div className="text-white text-sm font-bold">
                      {day.tempHigh}°
                    </div>
                    <div className="text-gray-400 text-xs">
                      {day.tempLow}°
                    </div>
                  </div>

                  {/* Precipitation */}
                  {day.precipitation > 0 && (
                    <div className="text-center text-blue-400 text-xs mt-1">
                      💧 {day.precipitation}%
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500/20 border-2 border-yellow-500 rounded"></div>
          <span className="text-gray-400">Hôm nay</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700/50 rounded"></div>
          <span className="text-gray-400">Dự báo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-700/30 opacity-60 rounded"></div>
          <span className="text-gray-400">Đã qua</span>
        </div>
      </div>
    </div>
  );
};

export default MonthCalendar;