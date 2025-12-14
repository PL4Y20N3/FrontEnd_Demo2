import React, { useEffect, useState } from 'react';
import { ArrowLeft, Sun, Cloud, CloudRain, Wind, Droplets, Eye } from 'lucide-react';
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
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Mock data cho biểu đồ 7 ngày
  const weeklyForecast = [
    { day: 'T2', date: '12/12', high: 21, low: 18, rain: 0, icon: 'cloud' },
    { day: 'T3', date: '13/12', high: 20, low: 17, rain: 100, icon: 'rain' },
    { day: 'T4', date: '14/12', high: 17, low: 15, rain: 52, icon: 'rain' },
    { day: 'T5', date: '15/12', high: 18, low: 16, rain: 0, icon: 'cloud' },
    { day: 'T6', date: '16/12', high: 18, low: 15, rain: 0, icon: 'sun' },
    { day: 'T7', date: '17/12', high: 20, low: 17, rain: 26, icon: 'cloud' },
  ];

  const getWeatherIcon = (type) => {
    switch(type) {
      case 'sun': return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
      default: return <Cloud className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="flex-1 p-6 max-h-[calc(100vh-140px)] overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        {/* Main Weather Display */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 mb-6 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-white text-4xl font-bold mb-2">{city}</h1>
              <p className="text-white/80">{detailData.date}</p>
              <p className="text-white/60 text-sm mt-1">
                Mặt trời mọc 6:23 AM • Mặt trời lặn 5:15 PM
              </p>
            </div>
            <div className="text-right">
              <div className="text-white text-7xl font-bold">
                {convertTemp(detailData.temp, tempUnit)}°
              </div>
              <p className="text-white/80 text-lg capitalize">{detailData.condition}</p>
            </div>
          </div>

          {/* Weather Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Droplets className="w-6 h-6 text-white/80 mb-2" />
              <div className="text-white/60 text-xs">Độ ẩm</div>
              <div className="text-white text-xl font-bold">{detailData.humidity}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Eye className="w-6 h-6 text-white/80 mb-2" />
              <div className="text-white/60 text-xs">Tầm nhìn</div>
              <div className="text-white text-xl font-bold">{detailData.visibility}km</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Wind className="w-6 h-6 text-white/80 mb-2" />
              <div className="text-white/60 text-xs">Gió</div>
              <div className="text-white text-xl font-bold">{detailData.wind}mph</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Sun className="w-6 h-6 text-white/80 mb-2" />
              <div className="text-white/60 text-xs">UV</div>
              <div className="text-white text-xl font-bold">1.29</div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 mb-6 border border-gray-700/50">
          <h3 className="text-white text-xl font-bold mb-4">Dự báo thời tiết theo giờ</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {detailData.hourly && detailData.hourly.map((hour, idx) => (
              <div key={idx} className="flex-shrink-0 bg-gray-700/50 rounded-xl p-4 text-center min-w-[100px]">
                <div className="text-white/80 text-sm mb-2">{hour.time}</div>
                <div className="text-white mb-2">
                  {getWeatherIcon(hour.icon)}
                </div>
                <div className="text-white text-xl font-bold">
                  {convertTemp(hour.temp, tempUnit)}°
                </div>
                <div className="text-blue-400 text-xs mt-2">
                  {Math.round(Math.random() * 100)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Forecast */}
        <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 mb-6 border border-gray-700/50">
          <h3 className="text-white text-xl font-bold mb-4">Dự báo thời tiết những ngày tới</h3>
          <div className="space-y-3">
            {weeklyForecast.map((day, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-colors">
                <div className="w-20">
                  <div className="text-white font-semibold">{day.day}</div>
                  <div className="text-white/60 text-sm">{day.date}</div>
                </div>
                <div className="flex-shrink-0">
                  {getWeatherIcon(day.icon)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold">{day.high}°</span>
                    <span className="text-white/60">/ {day.low}°</span>
                  </div>
                  {day.rain > 0 && (
                    <div className="text-blue-400 text-sm">{day.rain}% mưa</div>
                  )}
                </div>
                <div className="text-white/60 text-sm">
                  {day.rain > 0 ? `${(day.rain / 10).toFixed(1)} mm` : '0 mm'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Details */}
        <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
          <h3 className="text-white text-xl font-bold mb-4">Chi tiết hôm nay</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-1">Cảm giác như</div>
              <div className="text-white text-2xl font-bold">{convertTemp(detailData.temp, tempUnit)}°</div>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-1">Điểm sương</div>
              <div className="text-white text-2xl font-bold">18.4°</div>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-1">Áp suất</div>
              <div className="text-white text-2xl font-bold">1013 hPa</div>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <div className="text-white/60 text-sm mb-1">Chỉ số UV</div>
              <div className="text-white text-2xl font-bold">1.29</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetailPage;