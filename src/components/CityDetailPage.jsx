import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Eye
} from 'lucide-react';
import { getAllWeatherData } from '../services/weatherService';
import { convertTemp } from '../utils/helpers';

const CityDetailPage = ({ city, tempUnit, onBack }) => {
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getAllWeatherData(city);
        setDetailData(data);
      } catch (error) {
        console.error('Error:', error);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [city]);

  if (loading || !detailData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500" />
      </div>
    );
  }

  /* ===== MOCK WEEKLY ===== */
  const weeklyForecast = [
    { day: 'T2', date: '12/12', high: 21, low: 18, rain: 0, icon: 'cloud' },
    { day: 'T3', date: '13/12', high: 20, low: 17, rain: 100, icon: 'rain' },
    { day: 'T4', date: '14/12', high: 17, low: 15, rain: 52, icon: 'rain' },
    { day: 'T5', date: '15/12', high: 18, low: 16, rain: 0, icon: 'cloud' },
    { day: 'T6', date: '16/12', high: 18, low: 15, rain: 0, icon: 'sun' },
    { day: 'T7', date: '17/12', high: 20, low: 17, rain: 26, icon: 'cloud' },
  ];

  const getWeatherIcon = (type) => {
    switch (type) {
      case 'sun':
        return <Sun className="w-7 h-7 text-yellow-400" />;
      case 'rain':
        return <CloudRain className="w-7 h-7 text-blue-400" />;
      default:
        return <Cloud className="w-7 h-7 text-slate-400 dark:text-slate-300" />;
    }
  };

  return (
    <div className="flex-1 p-6 bg-slate-100 dark:bg-slate-900 transition-colors overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* BACK */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-500 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </button>

        {/* MAIN WEATHER */}
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 mb-6 shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-white text-4xl font-bold mb-1">{city}</h1>
              <p className="text-white/80">{detailData.date}</p>
              <p className="text-white/60 text-sm mt-1">
                Mặt trời mọc 6:23 • Lặn 17:15
              </p>
            </div>

            <div className="text-right">
              <div className="text-white text-7xl font-bold leading-none">
                {convertTemp(detailData.temp, tempUnit)}°
              </div>
              <p className="text-white/90 text-lg capitalize">
                {detailData.condition}
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Droplets, label: 'Độ ẩm', value: `${detailData.humidity}%` },
              { icon: Eye, label: 'Tầm nhìn', value: `${detailData.visibility} km` },
              { icon: Wind, label: 'Gió', value: `${detailData.wind} mph` },
              { icon: Sun, label: 'UV', value: '1.29' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/15 backdrop-blur-md rounded-xl p-4"
              >
                <item.icon className="w-6 h-6 text-white/80 mb-2" />
                <div className="text-white/70 text-xs">{item.label}</div>
                <div className="text-white text-xl font-bold">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOURLY */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-4">
            Dự báo theo giờ
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {detailData.hourly?.map((hour, idx) => (
              <div
                key={idx}
                className="min-w-[100px] text-center bg-slate-100 dark:bg-slate-700 rounded-xl p-4"
              >
                <div className="text-slate-500 dark:text-slate-300 text-sm mb-2">
                  {hour.time}
                </div>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(hour.icon)}
                </div>
                <div className="text-slate-900 dark:text-white text-xl font-bold">
                  {convertTemp(hour.temp, tempUnit)}°
                </div>
                <div className="text-blue-500 text-xs mt-1">
                  {Math.round(Math.random() * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WEEKLY */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-4">
            Những ngày tới
          </h3>
          <div className="space-y-3">
            {weeklyForecast.map((day, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl
                  bg-slate-100 dark:bg-slate-700
                  hover:bg-slate-200 dark:hover:bg-slate-600 transition"
              >
                <div className="w-20">
                  <div className="text-slate-900 dark:text-white font-semibold">
                    {day.day}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm">
                    {day.date}
                  </div>
                </div>

                {getWeatherIcon(day.icon)}

                <div className="flex-1">
                  <span className="text-slate-900 dark:text-white font-semibold">
                    {day.high}°
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {' '} / {day.low}°
                  </span>
                  {day.rain > 0 && (
                    <div className="text-blue-500 text-sm">
                      {day.rain}% mưa
                    </div>
                  )}
                </div>

                <div className="text-slate-500 dark:text-slate-400 text-sm">
                  {day.rain > 0 ? `${(day.rain / 10).toFixed(1)} mm` : '0 mm'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TODAY DETAILS */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-900 dark:text-white text-xl font-bold mb-4">
            Chi tiết hôm nay
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Cảm giác như', value: `${convertTemp(detailData.temp, tempUnit)}°` },
              { label: 'Điểm sương', value: '18.4°' },
              { label: 'Áp suất', value: '1013 hPa' },
              { label: 'UV', value: '1.29' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4"
              >
                <div className="text-slate-500 dark:text-slate-400 text-sm mb-1">
                  {item.label}
                </div>
                <div className="text-slate-900 dark:text-white text-2xl font-bold">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CityDetailPage;
