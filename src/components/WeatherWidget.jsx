import React from 'react';
import { Droplets, Eye, Wind, Gauge, Sun, CloudRain } from 'lucide-react';
import clearVideo from '../assets/weatherVideo/clear.mp4';
import cloudyVideo from '../assets/weatherVideo/cloudy.mp4';
import fogVideo from '../assets/weatherVideo/fog.mp4';
import nightVideo from '../assets/weatherVideo/night.mp4';
import rainVideo from '../assets/weatherVideo/rain.mp4';
import snowVideo from '../assets/weatherVideo/snow.mp4';
import stormVideo from '../assets/weatherVideo/storm.mp4';

const WeatherWidget = ({ weatherData, locationName }) => {
  // Xác định video background dựa vào điều kiện thời tiết
  const getVideoBackground = (condition, isDay) => {
  const weather = (condition || '').toLowerCase();

  if (!isDay) return nightVideo;
  if (weather.includes('rain')) return rainVideo;
  if (weather.includes('thunder') || weather.includes('storm')) return stormVideo;
  if (weather.includes('snow')) return snowVideo;
  if (weather.includes('fog') || weather.includes('mist')) return fogVideo;
  if (weather.includes('cloud')) return cloudyVideo;

  return clearVideo;
};


  const videoSrc = getVideoBackground(
    weatherData.condition || 'Clear',
    weatherData.isDay !== false
  );

  return (
<div className="relative rounded-3xl shadow-2xl p-8 mb-6 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <video
          key={videoSrc} // Force reload khi đổi video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Blur rất nhẹ */}
<div className="absolute inset-0 backdrop-blur-[2px]" />

{/* Overlay tối nhẹ, KHÔNG TÍM */}
<div className="absolute inset-0 bg-black/25" />

      </div>

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-white text-3xl font-bold mb-6">
          Dự báo thời tiết {locationName}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Current Weather */}
          <div>
            <div className="flex items-start gap-6 mb-6">
              <img 
                src={`https:${weatherData.icon}`} 
                alt="weather" 
                className="w-24 h-24 drop-shadow-lg" 
              />
              <div>
                <div className="text-7xl font-bold text-white drop-shadow-lg">
                  {weatherData.temp}°
                </div>
                <div className="text-white/90 mt-2 text-lg drop-shadow-md">
                  {weatherData.condition}
                </div>
                <div className="text-white/70 text-sm drop-shadow-md">
                  Cảm giác như {weatherData.feelsLike}°
                </div>
              </div>
            </div>

            {/* Weather Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                <Droplets className="w-5 h-5 mx-auto mb-1 text-white/90" />
                <div className="text-xs text-white/70">Độ ẩm</div>
                <div className="font-semibold text-white">{weatherData.humidity}%</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                <Eye className="w-5 h-5 mx-auto mb-1 text-white/90" />
                <div className="text-xs text-white/70">Tầm nhìn</div>
                <div className="font-semibold text-white">{weatherData.visibility} km</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                <Wind className="w-5 h-5 mx-auto mb-1 text-white/90" />
                <div className="text-xs text-white/70">Gió</div>
                <div className="font-semibold text-white">{weatherData.wind} km/h</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                <Gauge className="w-5 h-5 mx-auto mb-1 text-white/90" />
                <div className="text-xs text-white/70">Áp suất</div>
                <div className="font-semibold text-white">{weatherData.pressure} mb</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                <Sun className="w-5 h-5 mx-auto mb-1 text-white/90" />
                <div className="text-xs text-white/70">UV</div>
                <div className="font-semibold text-white">{weatherData.uv}</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                <CloudRain className="w-5 h-5 mx-auto mb-1 text-white/90" />
                <div className="text-xs text-white/70">Mưa</div>
                <div className="font-semibold text-white">{weatherData.precip} mm</div>
              </div>
            </div>
          </div>

          {/* Right: 3-Day Forecast (nếu có) */}
          {weatherData.forecast && (
            <div className="grid grid-cols-3 gap-4">
              {weatherData.forecast.slice(0, 3).map((day, idx) => (
                <div 
                  key={idx} 
                  className="bg-white/15 backdrop-blur-sm border-2 border-white/25 rounded-2xl p-4 text-center hover:border-white/40 transition-colors"
                >
                  <div className="font-semibold text-white mb-3 text-sm drop-shadow-md">
                    {idx === 0 ? 'Hôm nay' : new Date(day.date).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex justify-center mb-3">
                    <img src={`https:${day.icon}`} alt="weather" className="w-14 h-14 drop-shadow-lg" />
                  </div>
                  <div className="text-blue-200 text-sm mb-2 drop-shadow-md">
                    ☔ {day.precipitation}%
                  </div>
                  <div className="text-white/80 text-xs mb-2 drop-shadow-md">
                    {day.condition}
                  </div>
                  <div className="text-white font-semibold drop-shadow-md">
                    {day.tempHigh}°/{day.tempLow}°
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;