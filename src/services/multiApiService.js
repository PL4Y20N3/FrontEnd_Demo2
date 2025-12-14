// Multi-API service combining OpenWeather, WeatherAPI, and Open-Meteo

const OPENWEATHER_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHERAPI_KEY = '1695ccb58d97424299a11955251312';

// OpenWeather API (existing)
export const fetchOpenWeather = async (cityName) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_KEY}&units=metric`
    );
    const data = await response.json();
    return {
      source: 'OpenWeather',
      temp: Math.round(data.main.temp),
      humidity: data.main.humidity,
      wind: Math.round(data.wind.speed * 2.237),
      visibility: Math.round(data.visibility / 1000),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      coords: { lat: data.coord.lat, lon: data.coord.lon }
    };
  } catch (error) {
    console.error('OpenWeather error:', error);
    return null;
  }
};

// WeatherAPI.com - Rất chi tiết, có forecast 14 ngày
export const fetchWeatherAPI = async (cityName) => {
  try {
    // Current + Forecast + Air Quality
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${WEATHERAPI_KEY}&q=${cityName}&days=14&aqi=yes`
    );
    const data = await response.json();
    
    return {
      source: 'WeatherAPI',
      current: {
        temp: Math.round(data.current.temp_c),
        feelsLike: Math.round(data.current.feelslike_c),
        humidity: data.current.humidity,
        wind: Math.round(data.current.wind_kph),
        windDir: data.current.wind_dir,
        pressure: data.current.pressure_mb,
        precip: data.current.precip_mm,
        visibility: data.current.vis_km,
        uv: data.current.uv,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        isDay: data.current.is_day
      },
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
        localtime: data.location.localtime
      },
      forecast: data.forecast.forecastday.map(day => ({
        date: day.date,
        tempHigh: Math.round(day.day.maxtemp_c),
        tempLow: Math.round(day.day.mintemp_c),
        avgTemp: Math.round(day.day.avgtemp_c),
        condition: day.day.condition.text,
        icon: day.day.condition.icon,
        precipitation: day.day.daily_chance_of_rain,
        humidity: day.day.avghumidity,
        uv: day.day.uv,
        sunrise: day.astro.sunrise,
        sunset: day.astro.sunset,
        moonPhase: day.astro.moon_phase,
        hourly: day.hour.map(h => ({
          time: h.time.split(' ')[1],
          temp: Math.round(h.temp_c),
          feelsLike: Math.round(h.feelslike_c),
          condition: h.condition.text,
          icon: h.condition.icon,
          precipitation: h.chance_of_rain,
          humidity: h.humidity,
          wind: Math.round(h.wind_kph),
          isDay: h.is_day
        }))
      })),
      airQuality: data.current.air_quality ? {
        co: data.current.air_quality.co,
        no2: data.current.air_quality.no2,
        o3: data.current.air_quality.o3,
        pm2_5: data.current.air_quality.pm2_5,
        pm10: data.current.air_quality.pm10,
        usEpaIndex: data.current.air_quality['us-epa-index']
      } : null
    };
  } catch (error) {
    console.error('WeatherAPI error:', error);
    return null;
  }
};

// Open-Meteo - Free, không cần API key, rất nhanh
export const fetchOpenMeteo = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto`
    );
    const data = await response.json();
    
    return {
      source: 'Open-Meteo',
      current: {
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        wind: Math.round(data.current.wind_speed_10m * 3.6), // m/s to km/h
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code
      },
      hourly: data.hourly.time.slice(0, 24).map((time, idx) => ({
        time: new Date(time).getHours() + ':00',
        temp: Math.round(data.hourly.temperature_2m[idx]),
        precipitation: data.hourly.precipitation_probability[idx],
        weatherCode: data.hourly.weather_code[idx]
      })),
      daily: data.daily.time.map((date, idx) => ({
        date: date,
        tempHigh: Math.round(data.daily.temperature_2m_max[idx]),
        tempLow: Math.round(data.daily.temperature_2m_min[idx]),
        precipitation: data.daily.precipitation_probability_max[idx],
        sunrise: data.daily.sunrise[idx],
        sunset: data.daily.sunset[idx],
        weatherCode: data.daily.weather_code[idx]
      }))
    };
  } catch (error) {
    console.error('Open-Meteo error:', error);
    return null;
  }
};

// Combined data từ 3 sources
export const fetchCombinedWeatherData = async (cityName) => {
  try {
    // Fetch WeatherAPI first (most comprehensive)
    const weatherApiData = await fetchWeatherAPI(cityName);
    
    if (!weatherApiData) {
      // Fallback to OpenWeather
      return await fetchOpenWeather(cityName);
    }

    // Get Open-Meteo data for additional info
    const openMeteoData = await fetchOpenMeteo(
      weatherApiData.location.lat,
      weatherApiData.location.lon
    );

    // Combine data
    return {
      ...weatherApiData,
      openMeteo: openMeteoData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Combined fetch error:', error);
    throw error;
  }
};

// Weather code mapping (WMO codes for Open-Meteo)
export const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: { desc: 'Clear sky', icon: 'sun' },
    1: { desc: 'Mainly clear', icon: 'sun' },
    2: { desc: 'Partly cloudy', icon: 'cloud' },
    3: { desc: 'Overcast', icon: 'cloud' },
    45: { desc: 'Fog', icon: 'cloud' },
    48: { desc: 'Rime fog', icon: 'cloud' },
    51: { desc: 'Light drizzle', icon: 'rain' },
    53: { desc: 'Moderate drizzle', icon: 'rain' },
    55: { desc: 'Dense drizzle', icon: 'rain' },
    61: { desc: 'Slight rain', icon: 'rain' },
    63: { desc: 'Moderate rain', icon: 'rain' },
    65: { desc: 'Heavy rain', icon: 'rain' },
    71: { desc: 'Slight snow', icon: 'cloud' },
    73: { desc: 'Moderate snow', icon: 'cloud' },
    75: { desc: 'Heavy snow', icon: 'cloud' },
    80: { desc: 'Slight rain showers', icon: 'rain' },
    81: { desc: 'Moderate rain showers', icon: 'rain' },
    82: { desc: 'Violent rain showers', icon: 'rain' },
    95: { desc: 'Thunderstorm', icon: 'rain' },
    96: { desc: 'Thunderstorm with hail', icon: 'rain' },
    99: { desc: 'Thunderstorm with heavy hail', icon: 'rain' }
  };
  return weatherCodes[code] || { desc: 'Unknown', icon: 'cloud' };
};

// AQI từ US EPA Index (WeatherAPI)
export const getAQILevel = (index) => {
  const levels = {
    1: { level: 'Good', color: 'green', value: 25 },
    2: { level: 'Moderate', color: 'yellow', value: 75 },
    3: { level: 'Unhealthy for Sensitive', color: 'orange', value: 125 },
    4: { level: 'Unhealthy', color: 'red', value: 175 },
    5: { level: 'Very Unhealthy', color: 'purple', value: 250 },
    6: { level: 'Hazardous', color: 'maroon', value: 350 }
  };
  return levels[index] || levels[1];
};