import React from 'react';
import FeaturedWeather from './FeaturedWeather';

const PredictionPage = ({ tempUnit }) => {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white text-3xl font-bold mb-6">Dự Báo Thời Tiết</h2>
        
        {/* Featured Weather & Maps */}
        <FeaturedWeather tempUnit={tempUnit} />
        
        {/* Coming Soon Section */}
        <div className="mt-8 bg-blue-600/20 border border-blue-500/50 rounded-2xl p-6 text-center">
          <h3 className="text-white text-2xl font-bold mb-3">🔮 Dự Báo 7 Ngày</h3>
          <p className="text-white/80 mb-4">
            Tính năng dự báo thời tiết chi tiết cho 7 ngày tới đang được phát triển
          </p>
          <p className="text-white/60 text-sm">
            Yêu cầu nâng cấp OpenWeather API plan để truy cập dữ liệu mở rộng
          </p>
        </div>
      </div>
    </div>
  );
};

export default PredictionPage;