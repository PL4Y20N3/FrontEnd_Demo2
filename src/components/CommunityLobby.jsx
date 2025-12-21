import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Search,
  Users,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import NewHeader from "./NewHeader";

const CommunityLobby = () => {
  const navigate = useNavigate();
  const [locationPermission, setLocationPermission] = useState(null);
  const [suggestedCity, setSuggestedCity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const featuredCities = [
    { id: "hanoi", name: "Hà Nội", members: 1234, online: 89, slug: "hanoi" },
    {
      id: "hcm",
      name: "TP. Hồ Chí Minh",
      members: 2341,
      online: 156,
      slug: "ho-chi-minh",
    },
    {
      id: "danang",
      name: "Đà Nẵng",
      members: 567,
      online: 45,
      slug: "da-nang",
    },
    {
      id: "haiphong",
      name: "Hải Phòng",
      members: 432,
      online: 34,
      slug: "hai-phong",
    },
    {
      id: "cantho",
      name: "Cần Thơ",
      members: 298,
      online: 23,
      slug: "can-tho",
    },
    {
      id: "hagiang",
      name: "Hà Giang",
      members: 156,
      online: 12,
      slug: "ha-giang",
    },
  ];

  const requestLocation = () => {
    setLoading(true);
    setTimeout(() => {
      setSuggestedCity("Hà Nội");
      setLocationPermission("granted");
      setLoading(false);
    }, 800);
  };

  const handleJoinRoom = (slug) => {
    navigate(`/community/room/${slug}`);
  };

  const filteredCities = featuredCities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NewHeader />

      <div className="min-h-screen relative overflow-hidden bg-slate-100 dark:bg-slate-900">
        {/* BACKGROUND */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: "url(/assets/background.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(10px)",
            transform: "scale(1.1)",
          }}
        />
        <div className="fixed inset-0 z-0 bg-white/70 dark:bg-slate-900/70" />

        <div className="relative z-10 p-6">
          <div className="max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
                🌱 Cộng đồng EcoTrack
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Cập nhật & chia sẻ tình hình thời tiết thực tế từ cộng đồng
              </p>
            </div>

            {/* LOCATION CARD */}
            {locationPermission !== "denied" && !suggestedCity && (
              <div className="mb-8 rounded-3xl p-8 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl">
                <div className="flex items-start gap-6">
                  <div className="bg-emerald-500/20 p-4 rounded-2xl">
                    <MapPin className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Gợi ý phòng chat gần bạn
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      Cho phép truy cập vị trí để tham gia cộng đồng khu vực
                    </p>
                    <button
                      onClick={requestLocation}
                      disabled={loading}
                      className="
                        bg-gradient-to-r from-emerald-500 to-green-600
                        hover:from-emerald-600 hover:to-green-700
                        text-white px-6 py-3 rounded-xl font-semibold
                        transition-all disabled:opacity-60
                      "
                    >
                      {loading ? "Đang xác định…" : "Cho phép truy cập"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SUGGESTED CITY */}
            {suggestedCity && (
              <div className="mb-8 rounded-3xl p-6 bg-emerald-500/15 border border-emerald-500/40">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      📍 Phòng được đề xuất
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Khu vực{" "}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {suggestedCity}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoinRoom("hanoi")}
                    className="
                      bg-emerald-500 hover:bg-emerald-600
                      text-white px-6 py-3 rounded-xl font-semibold
                    "
                  >
                    Tham gia
                  </button>
                </div>
              </div>
            )}

            {/* SEARCH */}
            <div className="mb-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm thành phố…"
                  className="
                    w-full pl-12 pr-4 py-4 rounded-2xl
                    bg-white dark:bg-slate-800
                    border border-slate-300 dark:border-emerald-500/30
                    text-slate-900 dark:text-white
                    placeholder-slate-400
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/30
                  "
                />
              </div>
            </div>

            {/* FEATURED CITIES */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Thành phố nổi bật
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => handleJoinRoom(city.slug)}
                    className="
                      cursor-pointer rounded-2xl p-6
                      bg-white dark:bg-slate-800
                      border border-slate-200 dark:border-emerald-500/20
                      hover:border-emerald-500 hover:shadow-lg
                      transition-all
                    "
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white hover:text-emerald-500">
                          {city.name}
                        </h3>
                        <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {city.members.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            {city.online} online
                          </div>
                        </div>
                      </div>
                      <MessageCircle className="w-6 h-6 text-emerald-500" />
                    </div>

                    <button
                      className="
                        w-full mt-2 py-2 rounded-xl
                        bg-emerald-500 hover:bg-emerald-600
                        text-white font-medium
                      "
                    >
                      Tham gia thảo luận
                    </button>
                  </div>
                ))}
              </div>

              {filteredCities.length === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  Không tìm thấy thành phố
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
