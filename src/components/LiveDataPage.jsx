import React, { useState, useEffect } from 'react';
import { cities } from '../data/weatherData';
import { convertTemp, getAQIColor } from '../utils/helpers';
import { getAllWeatherData } from '../services/weatherService';
import WeatherBackground from './WeatherBackground';

const LiveDataPage = ({ tempUnit, allCitiesData }) => {
  const [citiesWeather, setCitiesWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Hanoi');

  useEffect(() => {
    const fetchAllCitiesData = async () => {
      setLoading(true);
      const newData = {};
      
      for (const city of cities) {
        try {
          // Kiểm tra cache trước
          if (allCitiesData[city]) {
            newData[city] = allCitiesData[city];
          } else {
            const data = await getAllWeatherData(city);
            newData[city] = data;
          }
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error);
          newData[city] = null;
        }
      }
      
      setCitiesWeather(newData);
      setLoading(false);
    };

    fetchAllCitiesData();
  }, [allCitiesData]);

  if (loading) {
    return (
      <div className="flex-1 p-6 min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-3xl font-bold mb-6">Live Environmental Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map(city => (
              <div key={city} className="bg-gray-800 rounded-2xl p-6 shadow-xl">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-4 bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Lấy dữ liệu thời tiết của thành phố được chọn để hiển thị background
  const selectedCityData = citiesWeather[selectedCity];
  const currentCondition = selectedCityData?.condition || 'Clear';
  const isDay = selectedCityData?.isDay !== false; // Default true nếu không có data

  return (
    <div className="relative flex-1 p-6 min-h-screen overflow-hidden">
      {/* Dynamic Weather Background */}
      <WeatherBackground 
        condition={currentCondition}
        isDay={isDay}
        blur={8}
        overlay={0.5}
        rounded={false}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-white text-3xl font-bold mb-2">Live Environmental Data</h2>
          <p className="text-white/70 text-sm">
            Đang hiển thị: <span className="font-semibold text-blue-400">{selectedCity}</span> - {currentCondition}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map(city => {
            const cityData = citiesWeather[city];
            
            if (!cityData) {
              return (
                <div key={city} className="bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-700/50">
                  <h3 className="text-white text-xl font-bold mb-4">{city}</h3>
                  <p className="text-white/60">Không thể tải dữ liệu</p>
                </div>
              );
            }

            const isSelected = selectedCity === city;

            return (
              <div 
                key={city} 
                className={`bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all cursor-pointer border-2 ${
                  isSelected 
                    ? 'border-blue-500 ring-2 ring-blue-400/50' 
                    : 'border-gray-700/50 hover:border-blue-400/50'
                }`}
                onClick={() => setSelectedCity(city)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-white text-xl font-bold">{city}</h3>
                  {isSelected && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                      Đang hiển thị
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Temperature</span>
                    <span className="text-white text-2xl font-bold">
                      {convertTemp(cityData.temp, tempUnit)}°{tempUnit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Condition</span>
                    <span className="text-white text-lg capitalize">{cityData.condition}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Humidity</span>
                    <span className="text-white text-xl">{cityData.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Visibility</span>
                    <span className="text-white text-xl">{cityData.visibility}km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Wind Speed</span>
                    <span className="text-white text-xl">{cityData.wind}mph</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">AQI</span>
                    <span className={`text-white text-xl font-bold px-3 py-1 rounded-lg ${getAQIColor(cityData.aqi)}`}>
                      {cityData.aqi || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-white/60 text-sm bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
          <p>🔄 Data auto-refreshes every 5 minutes</p>
          <p>Powered by OpenWeatherMap API</p>
          <p className="mt-2 text-xs text-white/40">
            💡 Click vào thẻ thành phố để thay đổi hình nền thời tiết
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveDataPage;