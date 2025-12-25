import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Droplets,
  Eye,
  Wind,
  Gauge,
  Sun,
  CloudRain,
  MapPin,
  AlertCircle,
  Info,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import AutocompleteSearch from "./AutocompleteSearch";
import NewHeader from "./NewHeader";
import Sidebar from "./Sidebar";
import MSNWeatherChart from "./MSNWeatherChart";
import FiveDayChart from "./FiveDayChart";
import MonthCalendar from "./MonthCalendar";
import CommunityChatWidget from "./chat/CommunityChatWidget";

import { fetchCombinedWeatherData } from "../services/multiApiService";
import { getAQIColor, getAQILevel } from "../utils/helpers";
import { useAuth } from "../contexts/AuthContext";

const UnifiedCityPage = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempUnit, setTempUnit] = useState("C");
  const [selectedCity, setSelectedCity] = useState(cityName);
  const [searchQuery, setSearchQuery] = useState("");
  const [customCities, setCustomCities] = useState([]);
  const [activeTab, setActiveTab] = useState("livedata"); // 'livedata' or 'aqi'
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: "Nguyễn Văn Minh",
      location: cityName,
      content: "Thời tiết hôm nay thế nào các bạn?",
      time: "10:30"
    }
  ]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCombinedWeatherData(selectedCity);
        if (mounted) setWeatherData(data);
      } catch (err) {
        console.error("Fetch weather error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, [selectedCity]);

  const handleSearchCity = (city) => {
    if (!customCities.includes(city)) {
      setCustomCities((prev) => [...prev, city]);
    }
    setSelectedCity(city);
    navigate(`/city/${city}`);
  };

  /* ================= CHAT HANDLERS ================= */
  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now(),
      user: user?.displayName || user?.email || "User",
      location: selectedCity,
      content: text,
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
      })
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: location } });
  };

  /* ================= LOADING ================= */
  if (loading || !weatherData) {
    return (
      <>
        <NewHeader />
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-emerald-500" />
        </div>
      </>
    );
  }

  const { current, forecast, airQuality, location } = weatherData;

  /* ================= PREPARE DATA ================= */
  const todayHourly =
    forecast?.[0]?.hourly?.slice(0, 24)?.map((h) => ({
      time: h.time,
      temp: h.temp,
      iconType: h.isDay ? "sun" : "moon",
    })) || [];

  // Fix calendar data
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const monthCalendarData = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - startDayOfWeek + 1;
    
    if (dayNum < 1 || dayNum > daysInMonth) {
      return { isEmpty: true };
    }
    
    const forecastIndex = dayNum - currentDay;
    const forecastData = forecast?.[forecastIndex];
    
    return {
      date: dayNum,
      tempHigh: forecastData?.tempHigh || Math.round(20 + Math.random() * 7),
      tempLow: forecastData?.tempLow || Math.round(14 + Math.random() * 5),
      precipitation: forecastData?.precipitation || Math.round(Math.random() * 100),
      iconType: forecastData?.icon || 'sun',
      isPast: dayNum < currentDay,
      isEmpty: false,
    };
  });

  // Mock AQI data
  const aqiData = {
    current: Math.round(airQuality?.usEpaIndex * 50) || 100,
    pm25: airQuality?.pm2_5 || 32.65,
    pm10: airQuality?.pm10 || 32.95,
    o3: 45.3,
    no2: 32.1,
    so2: 12.4,
    co: 0.8,
    trend: 'up',
    lastUpdate: new Date().toLocaleString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    hourlyData: Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const baseAQI = 100;
      const variation = Math.sin(i / 3) * 50 + Math.random() * 30;
      return {
        hour: `${hour}:00`,
        aqi: Math.max(50, Math.min(200, Math.round(baseAQI + variation)))
      };
    })
  };

  const topPollutedCities = [
    { rank: 1, name: 'Hà Nội', aqi: 153, color: 'bg-red-500' },
    { rank: 2, name: 'Tây Hồ', aqi: 152, color: 'bg-red-500' },
    { rank: 3, name: 'Hồ Chí Minh', aqi: 93, color: 'bg-yellow-500' },
    { rank: 4, name: 'Thủ Đức', aqi: 91, color: 'bg-yellow-500' },
    { rank: 5, name: 'Hải Phòng', aqi: 89, color: 'bg-yellow-500' },
    { rank: 6, name: 'Thủ Dầu Một', aqi: 56, color: 'bg-yellow-400' },
    { rank: 7, name: 'Côn Sơn', aqi: 53, color: 'bg-yellow-400' },
  ];

  const topCleanCities = [
    { rank: 1, name: 'Côn Sơn', aqi: 53, color: 'bg-yellow-400' },
    { rank: 2, name: 'Thủ Dầu Một', aqi: 56, color: 'bg-yellow-400' },
    { rank: 3, name: 'Hải Phòng', aqi: 89, color: 'bg-yellow-500' },
    { rank: 4, name: 'Thủ Đức', aqi: 91, color: 'bg-yellow-500' },
    { rank: 5, name: 'Hồ Chí Minh', aqi: 93, color: 'bg-yellow-500' },
    { rank: 6, name: 'Tây Hồ', aqi: 152, color: 'bg-red-500' },
    { rank: 7, name: 'Hà Nội', aqi: 153, color: 'bg-red-500' },
  ];

  const getAQILevelData = (aqi) => {
    if (aqi <= 50) return { label: 'Tốt', color: 'bg-green-500', textColor: 'text-green-500' };
    if (aqi <= 100) return { label: 'Trung bình', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    if (aqi <= 150) return { label: 'Không tốt cho nhóm nhạy cảm', color: 'bg-orange-500', textColor: 'text-orange-500' };
    if (aqi <= 200) return { label: 'Không tốt', color: 'bg-red-500', textColor: 'text-red-500' };
    if (aqi <= 300) return { label: 'Rất xấu', color: 'bg-purple-500', textColor: 'text-purple-500' };
    return { label: 'Nguy hại', color: 'bg-red-900', textColor: 'text-red-900' };
  };

  const AQIGauge = ({ value, max = 500 }) => {
    const percentage = (value / max) * 100;
    const level = getAQILevelData(value);
    const rotation = (percentage / 100) * 180 - 90;

    return (
      <div className="relative w-64 h-32 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="20"
          />
          <path d="M 20 90 A 80 80 0 0 1 52 34" fill="none" stroke="#10b981" strokeWidth="20" />
          <path d="M 52 34 A 80 80 0 0 1 100 20" fill="none" stroke="#eab308" strokeWidth="20" />
          <path d="M 100 20 A 80 80 0 0 1 148 34" fill="none" stroke="#f97316" strokeWidth="20" />
          <path d="M 148 34 A 80 80 0 0 1 180 90" fill="none" stroke="#ef4444" strokeWidth="20" />
          
          <line
            x1="100"
            y1="90"
            x2="100"
            y2="30"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '100px 90px' }}
          />
          <circle cx="100" cy="90" r="8" fill="#1e293b" />
        </svg>
        
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

  const lat = location.lat || 21.0285;
  const lon = location.lon || 105.8542;
  const currentLevel = getAQILevelData(aqiData.current);

  /* ================= RENDER ================= */
  return (
    <>
      <NewHeader />

      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
        {/* BACK BUTTON */}
        <div className="px-6 pt-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay về trang chủ
          </button>
        </div>

        <div className="flex">
          

          {/* MAIN CONTENT */}
          <div className="flex-1 p-6 max-h-[calc(100vh-80px)] overflow-y-auto">
            <div className="max-w-7xl mx-auto">
             {/* SEARCH BAR */}
              <div className="mb-6">
                <AutocompleteSearch />
              </div>
              {/* TAB NAVIGATION */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setActiveTab("livedata")}
                  className={`
                    px-6 py-3 rounded-xl font-semibold transition-all
                    ${activeTab === "livedata"
                      ? "bg-slate-800 dark:bg-slate-700 text-white shadow-lg"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    }
                  `}
                >
                  LiveDataPage
                </button>
                <button
                  onClick={() => setActiveTab("aqi")}
                  className={`
                    px-6 py-3 rounded-xl font-semibold transition-all
                    ${activeTab === "aqi"
                      ? "bg-slate-800 dark:bg-slate-700 text-white shadow-lg"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                    }
                  `}
                >
                  AQI
                </button>
              </div>

              {/* TAB CONTENT */}
              {activeTab === "livedata" ? (
                <div className="space-y-6">
                  {/* CURRENT WEATHER CARD */}
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 shadow-xl text-white">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="w-6 h-6" />
                      <h2 className="text-3xl font-bold">
                        {location.name}, {location.country}
                      </h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <div className="flex gap-6 mb-6">
                          <img 
                            src={`https:${current.icon}`} 
                            alt={current.condition}
                            className="w-24 h-24" 
                          />
                          <div>
                            <div className="text-7xl font-bold">{current.temp}°</div>
                            <div className="text-white/90 text-lg mt-2">
                              {current.condition}
                            </div>
                            <div className="text-white/70 text-sm mt-1">
                              Cảm giác như {current.feelsLike}°
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { icon: Droplets, label: "Độ ẩm", value: `${current.humidity}%` },
                            { icon: Eye, label: "Tầm nhìn", value: `${current.visibility} km` },
                            { icon: Wind, label: "Gió", value: `${current.wind} km/h` },
                            { icon: Gauge, label: "Áp suất", value: `${current.pressure} mb` },
                            { icon: Sun, label: "UV", value: current.uv },
                            { icon: CloudRain, label: "Mưa", value: `${current.precip} mm` },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/20 transition-all"
                            >
                              <item.icon className="w-5 h-5 mx-auto mb-1" />
                              <div className="text-xs text-white/80">{item.label}</div>
                              <div className="font-semibold text-sm">{item.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {forecast?.slice(0, 3).map((day, i) => (
                          <div
                            key={i}
                            className="bg-white/15 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between hover:bg-white/20 transition-all"
                          >
                            <div className="text-sm font-medium">
                              {i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : 'Ngày kia'}
                            </div>
                            <img 
                              src={`https:${day.icon}`} 
                              alt=""
                              className="w-10 h-10" 
                            />
                            <div className="text-right">
                              <div className="font-bold">{day.tempHigh}° / {day.tempLow}°</div>
                              <div className="text-xs text-white/70">☔ {day.precipitation}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      Dự báo 5 ngày
                    </h3>
                    <FiveDayChart data={forecast?.slice(0, 5) || []} />
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 transition-colors">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                      Biểu đồ nhiệt độ 24 giờ
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4">
                      <MSNWeatherChart data={todayHourly} />
                    </div>
                  </div>

                  <MonthCalendar
                    monthData={monthCalendarData}
                    currentDay={currentDay}
                  />

                  <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Bản đồ thời tiết
                      </h3>
                    </div>
                    <div className="relative" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
                        frameBorder="0"
                        title="Windy Map"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* AQI TAB CONTENT */
                <div className="space-y-6">
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
                          <span>{aqiData.lastUpdate}</span>
                        </div>
                      </div>

                      <AQIGauge value={aqiData.current} />

                      <div className="flex items-center justify-center gap-2 my-8">
                        {aqiData.trend === 'up' && (
                          <>
                            <TrendingUp className="w-5 h-5 text-red-500" />
                            <span className="text-red-500 font-medium">Đang tăng</span>
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'PM2.5', value: aqiData.pm25, unit: 'µg/m³' },
                          { label: 'PM10', value: aqiData.pm10, unit: 'µg/m³' },
                          { label: 'O₃', value: aqiData.o3, unit: 'ppb' },
                          { label: 'NO₂', value: aqiData.no2, unit: 'ppb' },
                          { label: 'SO₂', value: aqiData.so2, unit: 'ppb' },
                          { label: 'CO', value: aqiData.co, unit: 'ppm' },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center border border-slate-200 dark:border-slate-700"
                          >
                            <Wind className="w-5 h-5 mx-auto mb-2 text-emerald-500" />
                            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                              {item.label}
                            </div>
                            <div className="text-lg font-bold text-slate-900 dark:text-white">
                              {item.value}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.unit}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Side Info */}
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-4">
                          <AlertCircle className="w-5 h-5 text-emerald-500" />
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            Khuyến nghị sức khỏe
                          </h3>
                        </div>
                        <div className={`${currentLevel.color} text-white rounded-xl p-4`}>
                          <div className="font-bold mb-2">{currentLevel.label}</div>
                          <div className="text-sm opacity-90">
                            {aqiData.current > 150 
                              ? 'Mọi người nên hạn chế hoạt động ngoài trời.'
                              : 'Chất lượng không khí chấp nhận được.'}
                          </div>
                        </div>
                      </div>

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
                            { range: '101-150', label: 'Không tốt', color: 'bg-orange-500' },
                            { range: '151-200', label: 'Xấu', color: 'bg-red-500' },
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

                  {/* 24h AQI Chart */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      Biểu đồ AQI 24 giờ
                    </h3>
                    <div className="relative h-80 bg-slate-900 rounded-2xl p-6">
                      <svg className="w-full h-full" viewBox="0 0 1400 300">
                        {/* Grid lines */}
                        {[0, 50, 100, 150, 200].map((y, i) => (
                          <g key={i}>
                            <line
                              x1="60"
                              y1={250 - (y / 200) * 200}
                              x2="1380"
                              y2={250 - (y / 200) * 200}
                              stroke="#334155"
                              strokeWidth="1"
                              strokeDasharray="4"
                            />
                            <text
                              x="20"
                              y={255 - (y / 200) * 200}
                              className="text-sm"
                              fill="#94a3b8"
                            >
                              {y}
                            </text>
                          </g>
                        ))}

                        {/* Bars */}
                        {aqiData.hourlyData.map((item, i) => {
                          const x = 80 + i * 54;
                          const height = (item.aqi / 200) * 200;
                          const y = 250 - height;
                          const level = getAQILevelData(item.aqi);
                          const fillColor = level.color === 'bg-green-500' ? '#10b981' :
                                          level.color === 'bg-yellow-500' ? '#eab308' :
                                          level.color === 'bg-orange-500' ? '#f97316' :
                                          level.color === 'bg-red-500' ? '#ef4444' : '#991b1b';
                          
                          return (
                            <g key={i}>
                              <rect
                                x={x}
                                y={y}
                                width="45"
                                height={height}
                                fill={fillColor}
                                rx="4"
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                              />
                              {i % 2 === 0 && (
                                <text
                                  x={x + 22}
                                  y="280"
                                  textAnchor="middle"
                                  className="text-xs"
                                  fill="#94a3b8"
                                >
                                  {item.hour.replace(':00', '')}
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* City Rankings */}
                  <div className="grid lg:grid-cols-2 gap-6">
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
                            className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <div className="w-8 text-center font-bold text-slate-600 dark:text-slate-400">
                              {city.rank}
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-xl">🇻🇳</span>
                              <span className="text-slate-900 dark:text-white font-medium">
                                {city.name}
                              </span>
                            </div>
                            <div className={`${city.color} text-white px-4 py-1 rounded-lg font-bold min-w-[60px] text-center`}>
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
                          <span className="text-slate-700 dark:text-slate-300">Thạch Thất, Hà Nội</span>
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
                            className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <div className="w-8 text-center font-bold text-slate-600 dark:text-slate-400">
                              {city.rank}
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-xl">🇻🇳</span>
                              <span className="text-slate-900 dark:text-white font-medium">
                                {city.name}
                              </span>
                            </div>
                            <div className={`${city.color} text-white px-4 py-1 rounded-lg font-bold min-w-[60px] text-center`}>
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
                          <span className="text-slate-700 dark:text-slate-300">Trà Vinh, Tỉnh Trà Vinh</span>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-lg font-bold">
                            29
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <CommunityChatWidget
        cityName={selectedCity}
        messages={chatMessages}
        isAuthenticated={isAuthenticated}
        onSend={handleSendMessage}
        onLogin={handleLogin}
      />
    </>
  );
};

export default UnifiedCityPage;