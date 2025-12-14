import React from 'react';
import { Cloud } from 'lucide-react';

const NewHeader = () => {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });

  return (
    <header className="bg-gray-800/90 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-400 to-yellow-400 p-2 rounded-lg">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Environmental Monitoring</h1>
          </div>

          {/* Time */}
          <div className="text-xl font-semibold text-white">
            {currentTime}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;