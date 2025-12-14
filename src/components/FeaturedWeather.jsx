import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';
import { cities } from '../data/weatherData';
import { getAllWeatherData } from '../services/weatherService';
import { convertTemp, getAQIColor } from '../utils/helpers';

const FeaturedWeather = ({ tempUnit }) => {
  const [featuredCities, setFeaturedCities] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Các thành phố nổi bật
  const highlightCities = ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong'];

  useEffect(() => {
    const fetchFeaturedData = async () => {
      setLoading(true);
      const data = {};
      
      for (const city of highlightCities) {
        try {
          const cityData = await getAllWeatherData(city);
          data[city] = cityData;
        } catch (error) {
          console.error(`Error fetching ${city}:`, error);
        }
      }
      
      setFeaturedCities(data);
      setLoading(false);
    };

    fetchFeaturedData();
  }, []);

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': <Sun className="w-12 h-12 text-yellow-400" />,
      'Clouds': <Cloud className="w-12 h-12 text-gray-400" />,
      'Rain': <CloudRain className="w-12 h-12 text-blue-400" />,
      'Snow': <CloudSnow className="w-12 h-12 text-blue-200" />,
    };
    return icons[condition] || <Cloud className="w-12 h-12 text-gray-400" />;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-3"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Featured Cities Grid */}
      <div>
        <h3 className="text-white text-xl font-bold mb-4">
          Thời tiết các tỉnh nổi bật hiện tại
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlightCities.map(city => {
            const data = featuredCities[city];
            if (!data) return null;

            return (
              <div 
                key={city}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer border border-white/20"
              >
                <div className="text-center">
                  <h4 className="text-white font-semibold mb-2">{city}</h4>
                  
                  {/* Weather Icon */}
                  <div className="flex justify-center mb-3">
                    {getWeatherIcon(data.condition)}
                  </div>
                  
                  {/* Temperature */}
                  <div className="text-white text-3xl font-bold mb-2">
                    {convertTemp(data.temp, tempUnit)}°{tempUnit}
                  </div>
                  
                  {/* Condition */}
                  <div className="text-white/80 text-sm capitalize mb-3">
                    {data.condition}
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/20 rounded-lg p-2">
                      <div className="text-white/60">Độ ẩm</div>
                      <div className="text-white font-semibold">{data.humidity}%</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2">
                      <div className="text-white/60">AQI</div>
                      <div className={`font-semibold px-2 py-0.5 rounded ${getAQIColor(data.aqi)}`}>
                        {data.aqi || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Windy Map */}
      <div>
        <h3 className="text-white text-xl font-bold mb-4">Bản đồ thời tiết</h3>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              src="https://embed.windy.com/embed2.html?lat=16.047&lon=108.206&detailLat=16.047&detailLon=108.206&width=650&height=450&zoom=6&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
              frameBorder="0"
              title="Windy Weather Map"
              allowFullScreen
            />
          </div>
          <p className="text-white/60 text-xs mt-3 text-center">
            Powered by Windy.com - Cập nhật theo thời gian thực
          </p>
        </div>
      </div>

      {/* Satellite Image Section */}
      <div>
        <h3 className="text-white text-xl font-bold mb-4">Ảnh vệ tinh</h3>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-xl"
              src="https://embed.windy.com/embed2.html?lat=16.047&lon=108.206&detailLat=16.047&detailLon=108.206&width=650&height=450&zoom=6&level=surface&overlay=satellite&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
              frameBorder="0"
              title="Satellite View"
              allowFullScreen
            />
          </div>
          <p className="text-white/60 text-xs mt-3 text-center">
            Hình ảnh vệ tinh thời tiết Việt Nam
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedWeather;