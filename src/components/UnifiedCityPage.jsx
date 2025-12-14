import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, Sun, CloudRain, Droplets, Eye, Wind, Gauge } from 'lucide-react';
import NewHeader from './NewHeader';
import Sidebar from './Sidebar';
import MSNWeatherChart from './MSNWeatherChart';
import FiveDayChart from './FiveDayChart';
import MonthCalendar from './MonthCalendar';
import { fetchCombinedWeatherData } from '../services/multiApiService';
import { getAQIColor, getAQILevel } from '../utils/helpers';

const UnifiedCityPage = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempUnit, setTempUnit] = useState('C');
  const [selectedCity, setSelectedCity] = useState(cityName);
  const [searchQuery, setSearchQuery] = useState('');
  const [customCities, setCustomCities] = useState([]);

  // Mock data cho 5-day chart
  const fiveDayChartData = [
    {
      day: '12', date: 'Hôm qua',
      hourly: [
        { time: '06:00', temp: 22, precipitation: 30, iconType: 'cloud', isSunrise: true },
        { time: '08:00', temp: 21, precipitation: 97, iconType: 'rain' },
        { time: '10:00', temp: 21, precipitation: 93, iconType: 'rain' },
        { time: '12:00', temp: 21, precipitation: 87, iconType: 'rain' },
        { time: '14:00', temp: 21, precipitation: 87, iconType: 'rain' },
        { time: '16:00', temp: 20, precipitation: 79, iconType: 'rain' },
        { time: '18:00', temp: 19, precipitation: 72, iconType: 'rain', isSunset: true },
        { time: '20:00', temp: 18, precipitation: 72, iconType: 'cloud' },
      ]
    },
    {
      day: '13', date: 'Hôm nay',
      hourly: [
        { time: '00:00', temp: 18, precipitation: 43, iconType: 'moon' },
        { time: '02:00', temp: 18, precipitation: 29, iconType: 'moon' },
        { time: '04:00', temp: 18, precipitation: 0, iconType: 'moon' },
        { time: '06:00', temp: 18, precipitation: 0, iconType: 'cloud', isSunrise: true },
        { time: '08:00', temp: 19, precipitation: 0, iconType: 'sun' },
        { time: '10:00', temp: 21, precipitation: 0, iconType: 'sun' },
        { time: '12:00', temp: 23, precipitation: 0, iconType: 'sun' },
        { time: '14:00', temp: 25, precipitation: 0, iconType: 'sun' },
        { time: '16:00', temp: 24, precipitation: 0, iconType: 'cloud' },
        { time: '18:00', temp: 22, precipitation: 0, iconType: 'cloud', isSunset: true },
      ]
    },
    {
      day: '14', date: 'CN',
      hourly: [
        { time: '00:00', temp: 20, precipitation: 0, iconType: 'moon' },
        { time: '06:00', temp: 19, precipitation: 0, iconType: 'cloud', isSunrise: true },
        { time: '12:00', temp: 22, precipitation: 0, iconType: 'sun' },
        { time: '18:00', temp: 21, precipitation: 0, iconType: 'cloud', isSunset: true },
      ]
    },
    {
      day: '15', date: 'Th 2',
      hourly: [
        { time: '00:00', temp: 19, precipitation: 0, iconType: 'moon' },
        { time: '06:00', temp: 18, precipitation: 0, iconType: 'cloud', isSunrise: true },
        { time: '12:00', temp: 23, precipitation: 0, iconType: 'sun' },
        { time: '18:00', temp: 20, precipitation: 0, iconType: 'cloud', isSunset: true },
      ]
    },
    {
      day: '16', date: 'Th 3',
      hourly: [
        { time: '00:00', temp: 19, precipitation: 0, iconType: 'moon' },
        { time: '06:00', temp: 18, precipitation: 0, iconType: 'cloud', isSunrise: true },
        { time: '12:00', temp: 22, precipitation: 0, iconType: 'sun' },
        { time: '18:00', temp: 19, precipitation: 0, iconType: 'cloud', isSunset: true },
      ]
    }
  ];

  // Mock 30-day calendar
  const monthCalendarData = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - 2;
    if (dayNum < 1 || dayNum > 31) return { isEmpty: true };
    return {
      date: dayNum,
      tempHigh: Math.round(20 + Math.random() * 7),
      tempLow: Math.round(14 + Math.random() * 5),
      precipitation: Math.round(Math.random() * 100),
      iconType: dayNum % 3 === 0 ? 'rain' : dayNum % 2 === 0 ? 'cloud' : 'sun',
      isPast: dayNum < 13,
      isEmpty: false
    };
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCombinedWeatherData(selectedCity);
        setWeatherData(data);
      } catch (error) {
        console.error('Error:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedCity]);

  const handleSearchCity = async (city) => {
    if (!customCities.includes(city)) {
      setCustomCities(prev => [...prev, city]);
    }
    setSelectedCity(city);
    navigate(`/city/${city}`);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading || !weatherData) {
    return (
      <>
        <NewHeader />
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  }

  const mainData = weatherData.current;
  const aqiData = weatherData.airQuality;

  return (
    <>
      <NewHeader />
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Background */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/assets/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="fixed inset-0 z-0 bg-gray-900/70" />

        {/* Content */}
        <div className="relative z-10">
          {/* Back Button */}
          <div className="px-6 pt-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay về trang chủ</span>
            </button>
          </div>

          <div className="flex">
            <Sidebar 
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              tempUnit={tempUnit}
              setTempUnit={setTempUnit}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchCity={handleSearchCity}
              customCities={customCities}
            />

            {/* Main Content */}
            <div className="flex-1 p-6 max-h-[calc(100vh-80px)] overflow-y-auto">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Current Weather Widget */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-900 rounded-3xl shadow-2xl p-8">
                  <h2 className="text-white text-3xl font-bold mb-6">
                    {weatherData.location.name}, {weatherData.location.country}
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-start gap-6 mb-6">
                        <img src={`https:${mainData.icon}`} alt="weather" className="w-24 h-24" />
                        <div>
                          <div className="text-7xl font-bold text-white">{mainData.temp}°</div>
                          <div className="text-white/80 mt-2 text-lg">{mainData.condition}</div>
                          <div className="text-white/60 text-sm">Cảm giác như {mainData.feelsLike}°</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                          <Droplets className="w-5 h-5 mx-auto mb-1 text-white/80" />
                          <div className="text-xs text-white/60">Độ ẩm</div>
                          <div className="font-semibold text-white">{mainData.humidity}%</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                          <Eye className="w-5 h-5 mx-auto mb-1 text-white/80" />
                          <div className="text-xs text-white/60">Tầm nhìn</div>
                          <div className="font-semibold text-white">{mainData.visibility} km</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                          <Wind className="w-5 h-5 mx-auto mb-1 text-white/80" />
                          <div className="text-xs text-white/60">Gió</div>
                          <div className="font-semibold text-white">{mainData.wind} km/h</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                          <Gauge className="w-5 h-5 mx-auto mb-1 text-white/80" />
                          <div className="text-xs text-white/60">Áp suất</div>
                          <div className="font-semibold text-white">{mainData.pressure} mb</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                          <Sun className="w-5 h-5 mx-auto mb-1 text-white/80" />
                          <div className="text-xs text-white/60">UV</div>
                          <div className="font-semibold text-white">{mainData.uv}</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                          <CloudRain className="w-5 h-5 mx-auto mb-1 text-white/80" />
                          <div className="text-xs text-white/60">Mưa</div>
                          <div className="font-semibold text-white">{mainData.precip} mm</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {weatherData.forecast.slice(0, 3).map((day, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-4 text-center">
                          <div className="font-semibold text-white mb-3 text-sm">
                            {idx === 0 ? 'Hôm nay' : new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                          </div>
                          <img src={`https:${day.icon}`} alt="weather" className="w-14 h-14 mx-auto mb-3" />
                          <div className="text-blue-300 text-sm mb-2">☔ {day.precipitation}%</div>
                          <div className="text-white font-semibold">{day.tempHigh}°/{day.tempLow}°</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5-Day Chart */}
                <div>
                  <h3 className="text-white text-2xl font-bold mb-4">Dự báo 5 ngày</h3>
                  <FiveDayChart data={fiveDayChartData} />
                </div>

                {/* 24h Chart */}
                <div className="bg-gray-800/90 backdrop-blur-md rounded-3xl p-6 border border-gray-700/50">
                  <h3 className="text-white text-2xl font-bold mb-4">Biểu đồ 24 giờ</h3>
                  <MSNWeatherChart data={weatherData.forecast[0].hourly.slice(0, 8).map(h => ({
                    time: h.time,
                    temp: h.temp,
                    iconType: h.isDay ? 'sun' : 'moon'
                  }))} />
                </div>

                {/* 30-Day Calendar */}
                <MonthCalendar monthData={monthCalendarData} currentDay={13} />

                {/* AQI Section */}
                {aqiData && (
                  <div className="bg-gray-800/90 backdrop-blur-md rounded-3xl p-6 border border-gray-700/50">
                    <h3 className="text-white text-2xl font-bold mb-4">Chất lượng không khí (AQI)</h3>
                    <div className="flex items-center gap-6">
                      <div className={`text-6xl font-bold text-white p-8 rounded-2xl ${getAQIColor(aqiData.usEpaIndex * 50)}`}>
                        {Math.round(aqiData.usEpaIndex * 50)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white text-2xl font-bold mb-2">
                          {getAQILevel(Math.round(aqiData.usEpaIndex * 50))}
                        </div>
                        <div className="text-white/70 mb-4">
                          PM2.5: {aqiData.pm2_5?.toFixed(1)} | PM10: {aqiData.pm10?.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Maps */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50">
                    <h4 className="text-white font-semibold p-3 border-b border-gray-700/50">Bản đồ gió</h4>
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://embed.windy.com/embed2.html?lat=${weatherData.location.lat}&lon=${weatherData.location.lon}&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C`}
                        frameBorder="0"
                        title="Wind Map"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50">
                    <h4 className="text-white font-semibold p-3 border-b border-gray-700/50">Ảnh vệ tinh</h4>
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://embed.windy.com/embed2.html?lat=${weatherData.location.lat}&lon=${weatherData.location.lon}&zoom=8&level=surface&overlay=satellite&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=`}
                        frameBorder="0"
                        title="Satellite"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnifiedCityPage;