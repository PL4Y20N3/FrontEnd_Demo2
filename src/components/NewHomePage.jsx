import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewHeader from './NewHeader';
import AutocompleteSearch from './AutocompleteSearch';
import MSNWeatherChart from './MSNWeatherChart';
import FiveDayChart from './FiveDayChart';
import MonthCalendar from './MonthCalendar';
import WeatherWidget from './WeatherWidget';
import { fetchCombinedWeatherData } from '../services/multiApiService';

const NewHomePage = () => {
  const navigate = useNavigate();
  const [mainCity, setMainCity] = useState('Hanoi');
  const [weatherData, setWeatherData] = useState(null);
  const [citiesData, setCitiesData] = useState({});
  const [loading, setLoading] = useState(true);

  const featuredCities = [
    'Hanoi',
    'Ha Giang',
    'Quang Ninh',
    'Hai Phong',
    'Da Nang',
    'Ho Chi Minh',
  ];

  /* ===================== MOCK DATA ===================== */

  const fiveDayChartData = [
    {
      day: '13',
      date: 'Hôm nay',
      hourly: [
        { time: '06:00', temp: 18, precipitation: 0 },
        { time: '12:00', temp: 23, precipitation: 0 },
        { time: '18:00', temp: 22, precipitation: 0 },
      ],
    },
  ];

  const monthCalendarData = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - 2;
    if (dayNum < 1 || dayNum > 31) return { isEmpty: true };

    return {
      date: dayNum,
      tempHigh: Math.round(20 + Math.random() * 7),
      tempLow: Math.round(14 + Math.random() * 5),
      precipitation: Math.round(Math.random() * 100),
      isPast: dayNum < 13,
      isEmpty: false,
    };
  });

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCombinedWeatherData(mainCity);
        setWeatherData(data);

        const tempCities = {};
        for (const city of featuredCities) {
          const cityData = await fetchCombinedWeatherData(city);
          tempCities[city] = cityData;
        }
        setCitiesData(tempCities);
      } catch (err) {
        console.error(err);
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
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-gray-900">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
        </div>
      </>
    );
  }

  const mainData = weatherData.current;

  /* ===================== UI ===================== */

  return (
    <>
      <NewHeader />

      {/* PAGE WRAPPER */}
      <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-gray-900 dark:text-white relative overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/assets/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.1)',
          }}
        />
        <div className="fixed inset-0 z-0 bg-white/70 dark:bg-gray-900/70" />

        {/* CONTENT */}
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">

            {/* SEARCH */}
            <div className="mb-6">
              <AutocompleteSearch />
            </div>

            {/* WEATHER WIDGET */}
            <WeatherWidget
              weatherData={{
                ...mainData,
                forecast: weatherData.forecast,
              }}
              locationName={weatherData.location.name}
            />

            {/* 5-DAY OVERVIEW */}
            <div className="mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-slate-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4">
                Tổng quan 5 ngày
              </h3>
              <FiveDayChart data={fiveDayChartData} />
            </div>

            {/* 24H CHART */}
            <div
  className="
    rounded-3xl shadow-2xl p-6 mb-6 border
    bg-white
    border-slate-200
    dark:bg-gray-800/90
    dark:border-gray-700/50
    transition-colors
  "
>
  <h3
    className="
      text-2xl font-bold mb-4
      text-slate-900
      dark:text-white
    "
  >
    Biểu đồ nhiệt độ 24 giờ
  </h3>

  <div
    className="
      rounded-2xl p-4
      bg-slate-50
      dark:bg-gray-900/50
      transition-colors
    "
  >
    <MSNWeatherChart
      data={weatherData.forecast[0].hourly.slice(0, 24).map(h => ({
        time: h.time,
        temp: h.temp,
        iconType: h.isDay ? 'sun' : 'moon',
      }))}
    />
  </div>
</div>


            {/* MONTH CALENDAR */}
            <div className="mb-6">
              <MonthCalendar
                monthData={monthCalendarData}
                currentDay={13}
              />
            </div>

            {/* CITIES + MAP */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* CITIES */}
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Thời tiết các tỉnh nổi bật
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(citiesData).map(([city, data]) => (
                    <div
                      key={city}
                      onClick={() => handleCityClick(city)}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg p-4 cursor-pointer transition-all hover:scale-105 border border-slate-200 dark:border-gray-700"
                    >
                      <div className="text-center">
                        <h4 className="font-semibold mb-2">
                          {city}
                        </h4>

                        <div className="flex justify-center mb-2">
                          <img
                            src={`https:${data.current.icon}`}
                            alt="weather"
                            className="w-12 h-12"
                          />
                        </div>

                        <div className="text-blue-500 dark:text-blue-400 text-sm mb-2">
                          ☔ {data.forecast[0].precipitation}%
                        </div>

                        <div className="text-slate-600 dark:text-gray-300 text-xs mb-2">
                          {data.current.condition}
                        </div>

                        <div className="font-bold">
                          {data.forecast[0].tempHigh}°/
                          {data.forecast[0].tempLow}°
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MAP */}
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Bản đồ thời tiết
                </h3>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-gray-700">
                  <div className="relative" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://embed.windy.com/embed2.html?lat=16.047&lon=108.206&zoom=6&overlay=wind"
                      frameBorder="0"
                      title="Windy Map"
                    />
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
