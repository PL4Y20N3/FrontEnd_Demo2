import React, { useState, useEffect } from 'react';
import { Cloud, Search } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery, onSearchCity }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleEnter = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      onSearchCity(searchQuery.trim());
    }
  };

  return (
    <header className="bg-gray-800 p-4 shadow-lg relative z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-400 to-yellow-400 p-2 rounded-lg">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Environmental Monitoring</h1>
        </div>

        {/* SEARCH BAR (Bạn yêu cầu) */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-[380px]">
            <input
              type="text"
              placeholder="Nhập tên xã - phường, quận - huyện, tỉnh - thành..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleEnter}
              className="w-full py-2 pl-10 pr-4 rounded-full 
                         bg-white/20 text-white placeholder-white/60
                         focus:outline-none focus:ring-2 focus:ring-blue-300
                         transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} />
          </div>
        </div>

        {/* Clock */}
        <div className="text-xl font-semibold text-white">
          {currentTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          })}
        </div>

      </div>
    </header>
  );
};

export default Header;
