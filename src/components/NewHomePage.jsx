import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cloud, Sun, CloudRain, Droplets, Eye, Wind, Gauge } from 'lucide-react';
import NewHeader from './NewHeader';
import AutocompleteSearch from './AutocompleteSearch';
import MSNWeatherChart from './MSNWeatherChart';
import FiveDayChart from './FiveDayChart';
import MonthCalendar from './MonthCalendar';
import { fetchCombinedWeatherData } from '../services/multiApiService';
import { convertTemp } from '../utils/helpers';

const NewHomePage = ({ tempUnit }) => {
  const navigate = useNavigate();
  const [mainCity, setMainCity] = useState('Hanoi');
  const [weatherData, setWeatherData] = useState(null);
  const [citiesData, setCitiesData] = useState({});
  const [loading, setLoading] = useState(true);

  // Thành phố nổi bật
  const featuredCities = [
  'Hanoi',
  'Ha Giang',
  'Quang Ninh',
  'Hai Phong',
  'Da Nang',
  'Ho Chi Minh'
];


  // Mock data cho 5-day chart
  const fiveDayChartData = [
    {
      day: '12',
      date: 'Hôm qua',
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
      day: '13',
      date: 'Hôm nay',
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
      day: '14',
      date: 'CN',
      hourly: [
        { time: '00:00', temp: 20, precipitation: 0, iconType: 'moon' },
        { time: '06:00', temp: 19, precipitation: 0, iconType: 'cloud', isSunrise: true },
        { time: '12:00', temp: 22, precipitation: 0, iconType: 'sun' },
        { time: '18:00', temp: 21, precipitation: 0, iconType: 'cloud', isSunset: true },
      ]
    },
    {
      day: '15',
      date: 'Th 2',
      hourly: [
        { time: '00:00', temp: 19, precipitation: 0, iconType: 'moon' },
        { time: '06:00', temp: 18, precipitation: 0, iconType: 'cloud', isSunrise: true },
        { time: '12:00', temp: 23, precipitation: 0, iconType: 'sun' },
        { time: '18:00', temp: 20, precipitation: 0, iconType: 'cloud', isSunset: true },
      ]
    },
    {
      day: '16',
      date: 'Th 3',
      hourly: [
        { time: '00:00', temp: 19, precipitation: 0, iconType: 'moon' },
        { time: '06:00', temp: 18, precipitation: 0, iconType: 'cloud', isSunrise: true },
        { time: '12:00', temp: 22, precipitation: 0, iconType: 'sun' },
        { time: '18:00', temp: 19, precipitation: 0, iconType: 'cloud', isSunset: true },
      ]
    }
  ];

  // Mock 30-day calendar data
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
        const data = await fetchCombinedWeatherData(mainCity);
        setWeatherData(data);

        // Fetch featured cities
        const citiesDataTemp = {};
        for (const city of featuredCities) {
          try {
            const cityData = await fetchCombinedWeatherData(city);
            citiesDataTemp[city] = cityData;
          } catch (error) {
            console.error(`Error fetching ${city}:`, error);
          }
        }
        setCitiesData(citiesDataTemp);
      } catch (error) {
        console.error('Error:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [mainCity]);

  const handleCityClick = (city) => {
    navigate(`/city/${city}`);
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
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar with Autocomplete */}
            <div className="mb-6">
              <AutocompleteSearch />
            </div>

            {/* Main Weather Display */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-900 rounded-3xl shadow-2xl p-8 mb-6">
              <h2 className="text-white text-3xl font-bold mb-6">
                Dự báo thời tiết {weatherData.location.name}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Current Weather */}
                <div>
                  <div className="flex items-start gap-6 mb-6">
                    <img src={`https:${mainData.icon}`} alt="weather" className="w-24 h-24" />
                    <div>
                      <div className="text-7xl font-bold text-white">
                        {mainData.temp}°
                      </div>
                      <div className="text-white/80 mt-2 text-lg">{mainData.condition}</div>
                      <div className="text-white/60 text-sm">Cảm giác như {mainData.feelsLike}°</div>
                    </div>
                  </div>

                  {/* Weather Stats */}
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

                {/* Right: 3-Day Forecast */}
                <div className="grid grid-cols-3 gap-4">
                  {weatherData.forecast.slice(0, 3).map((day, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-4 text-center hover:border-purple-300 transition-colors">
                      <div className="font-semibold text-white mb-3 text-sm">
                        {idx === 0 ? 'Hôm nay' : new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex justify-center mb-3">
                        <img src={`https:${day.icon}`} alt="weather" className="w-14 h-14" />
                      </div>
                      <div className="text-blue-300 text-sm mb-2">
                        ☔ {day.precipitation}%
                      </div>
                      <div className="text-white/70 text-xs mb-2">
                        {day.condition}
                      </div>
                      <div className="text-white font-semibold">
                        {day.tempHigh}°/{day.tempLow}°
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5-Day Detail Chart */}
            <div className="mb-6">
              <h3 className="text-white text-2xl font-bold mb-4">Tổng quan 5 ngày</h3>
              <FiveDayChart data={fiveDayChartData} />
            </div>

            {/* MSN Weather Chart Widget */}
            <div className="bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 mb-6 border border-gray-700/50">
              <h3 className="text-white text-2xl font-bold mb-4">Biểu đồ nhiệt độ 24 giờ</h3>
              <div className="bg-gray-900/50 rounded-2xl p-4">
                <MSNWeatherChart data={weatherData.forecast[0].hourly.slice(0, 8).map(h => ({
                  time: h.time,
                  temp: h.temp,
                  iconType: h.isDay ? 'sun' : 'moon'
                }))} />
              </div>
            </div>

            {/* 30-Day Calendar */}
            <div className="mb-6">
              <MonthCalendar monthData={monthCalendarData} currentDay={13} />
            </div>

            {/* Layout: Cities Grid + Maps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Featured Cities */}
              <div>
                <h3 className="text-white text-2xl font-bold mb-4">
                  Thời tiết các tỉnh nổi bật
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(citiesData).map(([city, data]) => (
                    <div
                      key={city}
                      onClick={() => handleCityClick(city)}
                      className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-4 cursor-pointer hover:bg-gray-700/80 transition-all hover:scale-105 border border-gray-700/50"
                    >
                      <div className="text-center">
                        <h4 className="font-semibold text-white mb-2">{city}</h4>
                        <div className="flex justify-center mb-2">
                          <img src={`https:${data.current.icon}`} alt="weather" className="w-12 h-12" />
                        </div>
                        <div className="text-blue-400 text-sm mb-2">
                          ☔ {data.forecast[0].precipitation}%
                        </div>
                        <div className="text-gray-300 text-xs mb-2">
                          {data.current.condition}
                        </div>
                        <div className="text-white font-bold">
                          {data.forecast[0].tempHigh}°/{data.forecast[0].tempLow}°
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Maps */}
              <div>
                <h3 className="text-white text-2xl font-bold mb-4">
                  Bản đồ thời tiết
                </h3>
                <div className="space-y-4">
                  {/* Windy Map */}
                  <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-gray-700/50">
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-xl"
                        src="https://embed.windy.com/embed2.html?lat=16.047&lon=108.206&detailLat=16.047&detailLon=108.206&width=650&height=450&zoom=6&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
                        frameBorder="0"
                        title="Windy Map"
                      />
                    </div>
                  </div>

                  {/* Satellite */}
                  <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-gray-700/50">
                    <h4 className="font-semibold text-white p-3 border-b border-gray-700/50">Ảnh vệ tinh</h4>
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://embed.windy.com/embed2.html?lat=16.047&lon=108.206&detailLat=16.047&detailLon=108.206&width=650&height=450&zoom=6&level=surface&overlay=satellite&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
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

export default NewHomePage;