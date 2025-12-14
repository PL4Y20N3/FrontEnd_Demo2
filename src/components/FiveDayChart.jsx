import React from 'react';
import { Sun, Cloud, CloudRain, Moon } from 'lucide-react';

const FiveDayChart = ({ data }) => {
  const CHART_HEIGHT = 240;
  const TOP_MARGIN = 60;
  const BOTTOM_MARGIN = 40;
  const ITEM_WIDTH = 45;

  // Tính tổng số giờ và chiều rộng
  const totalHours = data.reduce((sum, day) => sum + day.hourly.length, 0);
  const chartWidth = totalHours * ITEM_WIDTH;

  // Tìm min/max nhiệt độ
  const allTemps = data.flatMap(day => day.hourly.map(h => h.temp));
  const maxTemp = Math.max(...allTemps);
  const minTemp = Math.min(...allTemps);
  const tempRange = Math.max(maxTemp - minTemp, 10);

  const scaleY = (temp) => {
    const plotHeight = CHART_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;
    const normalized = (temp - minTemp) / tempRange;
    return TOP_MARGIN + plotHeight * (1 - normalized);
  };

  const getWeatherIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch(type) {
      case 'sun': return <Sun className={`${iconClass} text-yellow-400`} />;
      case 'cloud': return <Cloud className={`${iconClass} text-blue-300`} />;
      case 'rain': return <CloudRain className={`${iconClass} text-blue-400`} />;
      case 'moon': return <Moon className={`${iconClass} text-blue-200`} />;
      default: return <Cloud className={`${iconClass} text-blue-300`} />;
    }
  };

  // Flatten dữ liệu với vị trí
  let xOffset = 0;
  const allHourlyData = [];
  
  data.forEach((day, dayIndex) => {
    day.hourly.forEach((hour, hourIndex) => {
      allHourlyData.push({
        ...hour,
        x: xOffset + hourIndex * ITEM_WIDTH + ITEM_WIDTH / 2,
        dayIndex,
        dayName: day.day,
        dayDate: day.date,
        isFirstOfDay: hourIndex === 0
      });
    });
    xOffset += day.hourly.length * ITEM_WIDTH;
  });

  // Tạo đường cong mượt
  const createSmoothPath = () => {
    if (allHourlyData.length < 2) return '';
    
    let path = `M ${allHourlyData[0].x} ${scaleY(allHourlyData[0].temp)}`;
    
    for (let i = 1; i < allHourlyData.length; i++) {
      const prev = allHourlyData[i - 1];
      const curr = allHourlyData[i];
      const cx = (prev.x + curr.x) / 2;
      
      path += ` Q ${cx} ${scaleY(prev.temp)} ${curr.x} ${scaleY(curr.temp)}`;
    }
    
    return path;
  };

  const curvePath = createSmoothPath();
  const fillPath = `${curvePath} L ${chartWidth} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`;

  // Tính vị trí cho nhãn ngày
  const dayPositions = data.map((day, idx) => {
    const dayHours = data.slice(0, idx + 1).reduce((sum, d) => sum + d.hourly.length, 0);
    const prevHours = data.slice(0, idx).reduce((sum, d) => sum + d.hourly.length, 0);
    
    return {
      ...day,
      left: prevHours * ITEM_WIDTH,
      width: day.hourly.length * ITEM_WIDTH
    };
  });

  return (
    <div className="bg-slate-900 p-6 rounded-2xl">
      <h2 className="text-2xl font-bold text-white mb-4">Tổng quan 5 ngày</h2>
      
      {/* Day labels */}
      <div className="relative mb-3" style={{ height: '50px' }}>
        {dayPositions.map((day, idx) => (
          <div
            key={idx}
            className="absolute text-center border-r border-slate-700 last:border-r-0"
            style={{
              left: `${day.left}px`,
              width: `${day.width}px`,
              top: 0
            }}
          >
            <div className="text-white font-semibold text-sm">{day.day}</div>
            <div className="text-slate-400 text-xs mt-0.5">{day.date}</div>
          </div>
        ))}
      </div>

      {/* Scrollable chart area */}
      <div className="overflow-x-auto bg-slate-800 rounded-lg">
        <div style={{ width: `${chartWidth}px`, height: `${CHART_HEIGHT}px`, position: 'relative' }}>
          
          {/* SVG Chart */}
          <svg
            width={chartWidth}
            height={CHART_HEIGHT}
            className="absolute inset-0"
          >
            <defs>
              <linearGradient id="tempGradient5Day" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#4FC3F7" />
                <stop offset="25%" stopColor="#66BB6A" />
                <stop offset="50%" stopColor="#FFF176" />
                <stop offset="75%" stopColor="#FFB74D" />
                <stop offset="100%" stopColor="#FF8A65" />
              </linearGradient>

              <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>

              <mask id="fadeMask5Day">
                <rect x="0" y="0" width={chartWidth} height={CHART_HEIGHT} fill="url(#fadeGradient)" />
              </mask>
            </defs>

            {/* Grid lines */}
            {[0.2, 0.4, 0.6, 0.8].map((p, i) => {
              const y = TOP_MARGIN + p * (CHART_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN);
              return (
                <line
                  key={i}
                  x1="0"
                  x2={chartWidth}
                  y1={y}
                  y2={y}
                  stroke="#ffffff15"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Precipitation bars */}
            {allHourlyData.map((hour, idx) => (
              hour.precipitation > 0 && (
                <rect
                  key={`precip-${idx}`}
                  x={hour.x - 10}
                  y={CHART_HEIGHT - BOTTOM_MARGIN}
                  width={20}
                  height={(hour.precipitation / 100) * 30}
                  fill="#4A90E2"
                  opacity="0.6"
                />
              )
            ))}

            {/* Temperature fill */}
            <path
              d={fillPath}
              fill="url(#tempGradient5Day)"
              mask="url(#fadeMask5Day)"
              opacity="0.7"
            />

            {/* Temperature line */}
            <path
              d={curvePath}
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>

          {/* Overlays */}
          {allHourlyData.map((hour, idx) => {
            const y = scaleY(hour.temp);
            const showLabel = idx % 2 === 0;
            const showIcon = idx % 4 === 0;
            
            return (
              <div
                key={idx}
                className="absolute"
                style={{
                  left: `${hour.x}px`,
                  top: `${y - 35}px`,
                  transform: 'translateX(-50%)',
                  width: '45px'
                }}
              >
                {/* Icon */}
                {showIcon && (
                  <div className="flex justify-center mb-0.5">
                    {getWeatherIcon(hour.iconType)}
                  </div>
                )}

                {/* Temperature */}
                <div className="text-white text-xs font-semibold text-center">
                  {hour.temp}°
                </div>

                {/* Time label */}
                {showLabel && (
                  <div className="text-slate-400 text-[10px] text-center mt-0.5">
                    {hour.time}
                  </div>
                )}

                {/* Precipitation */}
                {hour.precipitation > 0 && (
                  <div className="text-blue-400 text-[10px] text-center absolute" style={{ bottom: '-45px' }}>
                    {hour.precipitation}%
                  </div>
                )}
              </div>
            );
          })}

          {/* Sunrise/Sunset */}
          {allHourlyData.filter(h => h.isSunrise || h.isSunset).map((hour, idx) => (
            <div
              key={`sun-${idx}`}
              className="absolute bottom-1 flex items-center gap-0.5 bg-slate-700/50 px-1.5 py-0.5 rounded"
              style={{ left: `${hour.x}px`, transform: 'translateX(-50%)' }}
            >
              <Sun className="w-3 h-3 text-yellow-400" />
              <span className="text-[10px] text-slate-300">{hour.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Demo với dữ liệu mẫu
const DemoApp = () => {
  const sampleData = [
    {
      day: "12",
      date: "Hôm qua",
      hourly: [
        { time: "06:00", temp: 22, precipitation: 30, iconType: "cloud", isSunrise: true },
        { time: "10:00", temp: 21, precipitation: 97, iconType: "rain" },
        { time: "14:00", temp: 21, precipitation: 87, iconType: "rain" },
        { time: "18:00", temp: 20, precipitation: 79, iconType: "rain", isSunset: true },
        { time: "00:00", temp: 18, precipitation: 72, iconType: "cloud" }
      ]
    },
    {
      day: "13",
      date: "Hôm nay",
      hourly: [
        { time: "04:00", temp: 18, precipitation: 49, iconType: "cloud" },
        { time: "06:00", temp: 19, precipitation: 0, iconType: "sun", isSunrise: true },
        { time: "08:00", temp: 21, precipitation: 0, iconType: "sun" },
        { time: "12:00", temp: 23, precipitation: 0, iconType: "sun" },
        { time: "16:00", temp: 24, precipitation: 0, iconType: "cloud" },
        { time: "18:00", temp: 25, precipitation: 0, iconType: "sun", isSunset: true },
        { time: "00:00", temp: 22, precipitation: 0, iconType: "moon" }
      ]
    },
    {
      day: "14",
      date: "CN",
      hourly: [
        { time: "06:00", temp: 20, precipitation: 0, iconType: "sun", isSunrise: true },
        { time: "12:00", temp: 22, precipitation: 0, iconType: "sun" },
        { time: "18:00", temp: 21, precipitation: 0, iconType: "sun", isSunset: true },
        { time: "00:00", temp: 19, precipitation: 0, iconType: "moon" }
      ]
    },
    {
      day: "15",
      date: "Th 2",
      hourly: [
        { time: "06:00", temp: 18, precipitation: 0, iconType: "sun", isSunrise: true },
        { time: "12:00", temp: 23, precipitation: 0, iconType: "sun" },
        { time: "18:00", temp: 20, precipitation: 0, iconType: "moon", isSunset: true },
        { time: "00:00", temp: 19, precipitation: 0, iconType: "moon" }
      ]
    },
    {
      day: "16",
      date: "Th 3",
      hourly: [
        { time: "06:00", temp: 19, precipitation: 0, iconType: "sun", isSunrise: true },
        { time: "12:00", temp: 22, precipitation: 0, iconType: "sun" },
        { time: "18:00", temp: 19, precipitation: 0, iconType: "moon", isSunset: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <FiveDayChart data={sampleData} />
    </div>
  );
};

export default DemoApp;