import React, { useState } from 'react';
import { X, MapPin, Thermometer, Calendar, Download } from 'lucide-react';

const ImageMessage = ({ message, isOwn, onDelete }) => {
  const [showFullscreen, setShowFullscreen] = useState(false);

  const weatherTagColors = {
    sunny: { bg: 'bg-yellow-500', text: '☀️ Nắng' },
    cloudy: { bg: 'bg-gray-500', text: '☁️ Có mây' },
    rainy: { bg: 'bg-blue-500', text: '🌧️ Mưa' },
    stormy: { bg: 'bg-purple-500', text: '⛈️ Giông' },
    foggy: { bg: 'bg-gray-400', text: '🌫️ Sương mù' },
    snowy: { bg: 'bg-blue-300', text: '❄️ Tuyết' },
  };

  const tag = weatherTagColors[message.imageData?.weatherTag] || weatherTagColors.cloudy;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = message.imageData.url || message.imageData.image; // Support both URL and base64
    link.download = message.imageData.fileName || 'weather-photo.jpg';
    link.target = '_blank';
    link.click();
  };

  return (
    <>
      <div className={`flex flex-col gap-2 max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Image Container */}
        <div
          className={`relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group ${
            isOwn ? 'bg-blue-900' : 'bg-gray-800'
          }`}
          onClick={() => setShowFullscreen(true)}
        >
          <img
            src={message.imageData.url || message.imageData.image}
            alt={message.imageData.caption}
            className="w-full h-auto max-h-96 object-cover"
          />

          {/* Overlay with metadata */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-between text-white text-sm">
                <span>Click để xem lớn</span>
                <Download className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Weather Tag */}
          {message.imageData.weatherTag && (
            <div className={`absolute top-3 left-3 ${tag.bg} px-3 py-1 rounded-full text-white text-sm font-semibold shadow-lg`}>
              {tag.text}
            </div>
          )}

          {/* Delete button for own messages */}
          {isOwn && onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(message.id);
              }}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>

        {/* Caption */}
        {message.imageData.caption && (
          <div
            className={`px-4 py-2 rounded-2xl max-w-md ${
              isOwn
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-white'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.imageData.caption}
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-3 px-2 text-xs text-gray-500">
          {message.imageData.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{message.imageData.location}</span>
            </div>
          )}
          {message.imageData.temperature && (
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3" />
              <span>{message.imageData.temperature}</span>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <button
            onClick={() => setShowFullscreen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all"
          >
            <Download className="w-6 h-6" />
          </button>

          <div className="max-w-6xl w-full">
            <img
              src={message.imageData.url || message.imageData.image}
              alt={message.imageData.caption}
              className="w-full h-auto max-h-[90vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Caption and Metadata */}
            <div
              className="mt-6 bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 max-w-2xl mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {message.imageData.caption && (
                <p className="text-white text-lg mb-4 leading-relaxed">
                  {message.imageData.caption}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={message.userAvatar}
                    alt={message.userName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-white font-semibold">{message.userName}</span>
                </div>

                {message.imageData.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{message.imageData.location}</span>
                  </div>
                )}

                {message.imageData.temperature && (
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4" />
                    <span>{message.imageData.temperature}</span>
                  </div>
                )}

                {message.imageData.weatherTag && (
                  <div className={`${tag.bg} px-3 py-1 rounded-full text-white text-sm font-semibold`}>
                    {tag.text}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(message.timestamp).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageMessage;