import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Users, MessageCircle, TrendingUp } from 'lucide-react';
import NewHeader from './NewHeader';

const CommunityLobby = () => {
  const navigate = useNavigate();
  const [locationPermission, setLocationPermission] = useState(null);
  const [suggestedCity, setSuggestedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Danh sách thành phố nổi bật
  const featuredCities = [
    { id: 'hanoi', name: 'Hà Nội', members: 1234, online: 89, slug: 'hanoi' },
    { id: 'hcm', name: 'TP. Hồ Chí Minh', members: 2341, online: 156, slug: 'ho-chi-minh' },
    { id: 'danang', name: 'Đà Nẵng', members: 567, online: 45, slug: 'da-nang' },
    { id: 'haiphong', name: 'Hải Phòng', members: 432, online: 34, slug: 'hai-phong' },
    { id: 'cantho', name: 'Cần Thơ', members: 298, online: 23, slug: 'can-tho' },
    { id: 'hagiang', name: 'Hà Giang', members: 156, online: 12, slug: 'ha-giang' },
  ];

  // Request location permission
  const requestLocation = async () => {
    setLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Reverse geocode để lấy tên thành phố
            // TODO: Call reverse geocode API
            const mockCity = 'Hà Nội'; // Mock data
            setSuggestedCity(mockCity);
            setLocationPermission('granted');
            setLoading(false);
          },
          (error) => {
            console.error('Location error:', error);
            setLocationPermission('denied');
            setLoading(false);
          }
        );
      } else {
        setLocationPermission('unavailable');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setLocationPermission('denied');
      setLoading(false);
    }
  };

  const handleJoinRoom = (citySlug) => {
    navigate(`/community/room/${citySlug}`);
  };

  const filteredCities = featuredCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NewHeader />
      <div className="min-h-screen bg-gray-900 relative overflow-hidden">
        {/* Background */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/assets/background.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className="fixed inset-0 z-0 bg-gray-900/80" />

        {/* Content */}
        <div className="relative z-10 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">
                🌦️ Cộng đồng thời tiết
              </h1>
              <p className="text-xl text-gray-300">
                Chia sẻ và cập nhật tình hình thời tiết thực tế tại khu vực của bạn
              </p>
            </div>

            {/* Location Permission Card */}
            {locationPermission !== 'denied' && !suggestedCity && (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 mb-8 shadow-2xl">
                <div className="flex items-start gap-6">
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Tìm phòng chat gần bạn
                    </h3>
                    <p className="text-white/90 mb-4">
                      Cho phép truy cập vị trí để tự động gợi ý phòng chat khu vực của bạn
                    </p>
                    <button
                      onClick={requestLocation}
                      disabled={loading}
                      className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Đang xác định vị trí...' : 'Cho phép truy cập vị trí'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Room (if location granted) */}
            {suggestedCity && (
              <div className="bg-green-600/20 border-2 border-green-500 rounded-3xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      📍 Phòng chat được đề xuất
                    </h3>
                    <p className="text-gray-300">
                      Dựa trên vị trí của bạn tại <span className="font-semibold text-white">{suggestedCity}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoinRoom('hanoi')}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    Tham gia ngay
                  </button>
                </div>
              </div>
            )}

            {/* Search Box */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm thành phố..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            {/* Featured Cities */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">
                  Thành phố nổi bật
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => handleJoinRoom(city.slug)}
                    className="bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700 hover:border-blue-500 hover:bg-gray-700/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                          {city.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{city.members.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>{city.online} online</span>
                          </div>
                        </div>
                      </div>
                      <MessageCircle className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-all group-hover:shadow-lg">
                      Tham gia thảo luận
                    </button>
                  </div>
                ))}
              </div>

              {filteredCities.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Không tìm thấy thành phố nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityLobby;