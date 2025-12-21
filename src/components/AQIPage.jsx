import React, { useState, useEffect } from 'react';
import { Wind, AlertCircle, Info, MapPin, Clock, TrendingUp, TrendingDown } from 'lucide-react';

const AQIPage = () => {
  const [selectedCity, setSelectedCity] = useState('Hanoi');
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock AQI data - thay bằng API thực tế
  const mockAQIData = {
    'Hanoi': {
      current: 153,
      pm25: 61.2,
      pm10: 87.5,
      o3: 45.3,
      no2: 32.1,
      so2: 12.4,
      co: 0.8,
      trend: 'up',
      lastUpdate: new Date().toLocaleString('vi-VN'),
      hourlyData: Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        aqi: Math.floor(Math.random() * 100) + 100,
        time: new Date(Date.now() - (23 - i) * 3600000)
      }))
    },
    'Ho Chi Minh City': { current: 93, pm25: 32.1, pm10: 45.2, trend: 'down' },
    'Da Nang': { current: 89, pm25: 28.5, pm10: 41.3, trend: 'stable' },
    'Hai Phong': { current: 89, pm25: 29.8, pm10: 42.1, trend: 'down' },
    'Can Tho': { current: 91, pm25: 31.2, pm10: 44.5, trend: 'stable' },
  };

  const topPollutedCities = [
    { rank: 1, name: 'Hà Nội', aqi: 153, color: 'bg-red-500' },
    { rank: 2, name: 'Tây Hồ', aqi: 152, color: 'bg-red-500' },
    { rank: 3, name: 'Ho Chi Minh City', aqi: 93, color: 'bg-yellow-500' },
    { rank: 4, name: 'Thu Duc', aqi: 91, color: 'bg-yellow-500' },
    { rank: 5, name: 'Hải Phòng', aqi: 89, color: 'bg-yellow-500' },
    { rank: 6, name: 'Thu Dau Mot', aqi: 56, color: 'bg-yellow-400' },
    { rank: 7, name: 'Con Son', aqi: 53, color: 'bg-yellow-400' },
  ];

  const topCleanCities = [
    { rank: 1, name: 'Con Son', aqi: 53, color: 'bg-yellow-400' },
    { rank: 2, name: 'Thu Dau Mot', aqi: 56, color: 'bg-yellow-400' },
    { rank: 3, name: 'Hải Phòng', aqi: 89, color: 'bg-yellow-500' },
    { rank: 4, name: 'Thu Duc', aqi: 91, color: 'bg-yellow-500' },
    { rank: 5, name: 'Ho Chi Minh City', aqi: 93, color: 'bg-yellow-500' },
    { rank: 6, name: 'Tây Hồ', aqi: 152, color: 'bg-red-500' },
    { rank: 7, name: 'Hà Nội', aqi: 153, color: 'bg-red-500' },
  ];

  const cities = [
    'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong', 'Can Tho',
    'Hue', 'Nha Trang', 'Vung Tau', 'Ha Giang', 'Quang Ninh'
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAqiData(mockAQIData[selectedCity]);
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, [selectedCity]);

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { label: 'Tốt', color: 'bg-green-500', textColor: 'text-green-500' };
    if (aqi <= 100) return { label: 'Trung bình', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    if (aqi <= 150) return { label: 'Không tốt cho nhóm nhạy cảm', color: 'bg-orange-500', textColor: 'text-orange-500' };
    if (aqi <= 200) return { label: 'Không tốt', color: 'bg-red-500', textColor: 'text-red-500' };
    if (aqi <= 300) return { label: 'Rất xấu', color: 'bg-purple-500', textColor: 'text-purple-500' };
    return { label: 'Nguy hại', color: 'bg-red-900', textColor: 'text-red-900' };
  };

  const AQIGauge = ({ value, max = 500 }) => {
    const percentage = (value / max) * 100;
    const level = getAQILevel(value);
    const rotation = (percentage / 100) * 180 - 90;

    return (
      <div className="relative w-64 h-32 mx-auto">
        {/* Semi-circle background */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* Background arc */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="20"
            className="text-slate-700 dark:text-slate-600"
          />
          {/* Colored segments */}
          <path d="M 20 90 A 80 80 0 0 1 52 34" fill="none" stroke="#10b981" strokeWidth="20" />
          <path d="M 52 34 A 80 80 0 0 1 100 20" fill="none" stroke="#eab308" strokeWidth="20" />
          <path d="M 100 20 A 80 80 0 0 1 148 34" fill="none" stroke="#f97316" strokeWidth="20" />
          <path d="M 148 34 A 80 80 0 0 1 180 90" fill="none" stroke="#ef4444" strokeWidth="20" />
          
          {/* Needle */}
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="30"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '100px 90px' }}
          />
          <circle cx="100" cy="90" r="8" fill="white" />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className={`text-5xl font-bold ${level.textColor}`}>
            {value}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {level.label}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const currentLevel = getAQILevel(aqiData.current);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Chỉ số chất lượng không khí (AQI)
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Theo dõi chất lượng không khí thời gian thực tại Việt Nam
          </p>
        </div>

        {/* City Selector */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`
                px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all
                ${selectedCity === city
                  ? 'bg-emerald-500 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }
              `}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main AQI Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedCity}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                {aqiData.lastUpdate}
              </div>
            </div>

            {/* AQI Gauge */}
            <div className="mb-8">
              <AQIGauge value={aqiData.current} />
            </div>

            {/* Trend */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {aqiData.trend === 'up' && (
                <>
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-medium">Đang tăng</span>
                </>
              )}
              {aqiData.trend === 'down' && (
                <>
                  <TrendingDown className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-medium">Đang giảm</span>
                </>
              )}
              {aqiData.trend === 'stable' && (
                <span className="text-slate-600 dark:text-slate-400 font-medium">Ổn định</span>
              )}
            </div>

            {/* Pollutants Grid */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'PM2.5', value: aqiData.pm25, unit: 'µg/m³', icon: Wind },
                { label: 'PM10', value: aqiData.pm10, unit: 'µg/m³', icon: Wind },
                { label: 'O₃', value: aqiData.o3, unit: 'ppb', icon: Wind },
                { label: 'NO₂', value: aqiData.no2, unit: 'ppb', icon: Wind },
                { label: 'SO₂', value: aqiData.so2, unit: 'ppb', icon: Wind },
                { label: 'CO', value: aqiData.co, unit: 'ppm', icon: Wind },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center border border-slate-200 dark:border-slate-700"
                >
                  <item.icon className="w-5 h-5 mx-auto mb-2 text-emerald-500" />
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    {item.label}
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {item.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500">
                    {item.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            {/* Health Advisory */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Khuyến nghị sức khỏe
                </h3>
              </div>
              <div className={`${currentLevel.color} text-white rounded-xl p-4 mb-4`}>
                <div className="font-bold mb-2">{currentLevel.label}</div>
                <div className="text-sm opacity-90">
                  {aqiData.current > 150 
                    ? 'Mọi người nên hạn chế hoạt động ngoài trời. Đeo khẩu trang khi ra ngoài.'
                    : aqiData.current > 100
                    ? 'Nhóm nhạy cảm nên hạn chế hoạt động ngoài trời kéo dài.'
                    : 'Chất lượng không khí chấp nhận được cho hầu hết mọi người.'}
                </div>
              </div>
            </div>

            {/* AQI Scale */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Thang đo AQI
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { range: '0-50', label: 'Tốt', color: 'bg-green-500' },
                  { range: '51-100', label: 'Trung bình', color: 'bg-yellow-500' },
                  { range: '101-150', label: 'Không tốt (nhóm nhạy cảm)', color: 'bg-orange-500' },
                  { range: '151-200', label: 'Không tốt', color: 'bg-red-500' },
                  { range: '201-300', label: 'Rất xấu', color: 'bg-purple-500' },
                  { range: '300+', label: 'Nguy hại', color: 'bg-red-900' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-12 h-4 ${item.color} rounded`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        {item.range}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 24h Chart */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Biểu đồ AQI 24 giờ
          </h3>
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 1200 240">
              {/* Grid lines */}
              {[0, 50, 100, 150, 200].map((y, i) => (
                <g key={i}>
                  <line
                    x1="40"
                    y1={200 - (y / 200) * 160}
                    x2="1180"
                    y2={200 - (y / 200) * 160}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-slate-300 dark:text-slate-700"
                    strokeDasharray="4"
                  />
                  <text
                    x="10"
                    y={205 - (y / 200) * 160}
                    className="text-xs fill-slate-600 dark:fill-slate-400"
                  >
                    {y}
                  </text>
                </g>
              ))}

              {/* Bars */}
              {aqiData.hourlyData.map((item, i) => {
                const x = 50 + i * 48;
                const height = (item.aqi / 200) * 160;
                const y = 200 - height;
                const level = getAQILevel(item.aqi);
                
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={y}
                      width="40"
                      height={height}
                      className={level.color.replace('bg-', 'fill-')}
                      rx="4"
                    />
                    {i % 3 === 0 && (
                      <text
                        x={x + 20}
                        y="230"
                        textAnchor="middle"
                        className="text-xs fill-slate-600 dark:fill-slate-400"
                      >
                        {item.hour}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* City Rankings */}
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          {/* Most Polluted */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Xếp hạng trực tiếp thành phố ô nhiễm nhất
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Xếp hạng thành phố ô nhiễm nhất tại Việt Nam theo thời gian thực
            </p>
            <div className="space-y-2">
              {topPollutedCities.map((city) => (
                <div
                  key={city.rank}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-8 text-center font-bold text-slate-600 dark:text-slate-400">
                    {city.rank}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-4 rounded-sm overflow-hidden">
                      🇻🇳
                    </span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      {city.name}
                    </span>
                  </div>
                  <div className={`${city.color} text-white px-4 py-1 rounded-lg font-bold`}>
                    {city.aqi}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="font-bold text-slate-900 dark:text-white mb-1">
                2024 thành phố ô nhiễm nhất tại Việt Nam
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">Thach That, Hanoi</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                  157
                </span>
              </div>
            </div>
          </div>

          {/* Cleanest */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Xếp hạng trực tiếp thành phố sạch nhất
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Xếp hạng thành phố sạch nhất tại Việt Nam theo thời gian thực
            </p>
            <div className="space-y-2">
              {topCleanCities.map((city) => (
                <div
                  key={city.rank}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="w-8 text-center font-bold text-slate-600 dark:text-slate-400">
                    {city.rank}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-4 rounded-sm overflow-hidden">
                      🇻🇳
                    </span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      {city.name}
                    </span>
                  </div>
                  <div className={`${city.color} text-white px-4 py-1 rounded-lg font-bold`}>
                    {city.aqi}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="font-bold text-slate-900 dark:text-white mb-1">
                2024 thành phố sạch nhất tại Việt Nam
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">Tra Vinh, Tinh Tra Vinh</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-lg font-bold">
                  29
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AQIPage;