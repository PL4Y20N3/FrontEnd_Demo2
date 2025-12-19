import { useState, useEffect } from "react";
import { MessageCircle, Send, Users, X, Minimize2, LogIn } from "lucide-react";

const CommunityWeatherChat = ({ city = "Hanoi" }) => {
  // Mock authentication state - thay thế bằng useAuth() thực tế
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // City name mapping
  const cityNames = {
    'hanoi': 'Hà Nội',
    'ho-chi-minh': 'TP. Hồ Chí Minh',
    'da-nang': 'Đà Nẵng',
    'hai-phong': 'Hải Phòng',
    'can-tho': 'Cần Thơ',
    'ha-giang': 'Hà Giang',
  };

  const cityName = cityNames[city.toLowerCase()] || city;

  /* ===== LOAD MOCK MESSAGES ===== */
  useEffect(() => {
    const mockMessages = [
      {
        id: 1,
        user: "Nguyễn Văn Minh",
        location: "Hà Nội",
        content: "Trời đang mưa nhẹ, nhớ mang theo ô nhé!",
        time: "10:30"
      },
      {
        id: 2,
        user: "Trần Thị Hoa",
        location: "Quảng Ninh",
        content: "Nhiệt độ đang giảm, hơi lạnh đấy 🌧️",
        time: "11:15"
      }
    ];
    setMessages(mockMessages);
  }, [city]);

  const sendMessage = () => {
    if (!text.trim() || !isAuthenticated) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        user: user.displayName,
        location: cityName,
        content: text,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit"
        })
      }
    ]);
    setText("");
  };

  const handleLogin = () => {
    // Mock login - thay thế bằng navigate('/login') thực tế
    setIsAuthenticated(true);
    setUser({ displayName: "Người dùng mới" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* ===== FLOATING BUTTON ===== */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            fixed bottom-6 right-6 z-50
            bg-gradient-to-r from-emerald-500 to-green-600
            hover:from-emerald-600 hover:to-green-700
            text-white rounded-full p-4
            shadow-2xl transition-all duration-300
            hover:scale-110
            group
          "
          aria-label="Mở chat"
        >
          <MessageCircle className="w-6 h-6" />
          {messages.length > 0 && (
            <span className="
              absolute -top-1 -right-1
              bg-red-500 text-white text-xs font-bold
              rounded-full w-6 h-6 flex items-center justify-center
              animate-pulse
            ">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* ===== CHAT WINDOW ===== */}
      {isOpen && (
        <div
          className={`
            fixed bottom-6 right-6 z-50
            w-96
            transition-all duration-300
            ${isMinimized ? "h-auto" : ""}
          `}
        >
          <div className="
            bg-slate-800
            rounded-2xl shadow-2xl
            border border-emerald-500/30
            overflow-hidden
          ">
            {/* ===== HEADER ===== */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base">
                    Cộng đồng thời tiết
                  </h3>
                  <p className="text-white/90 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {messages.length} tin nhắn
                  </p>
                </div>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                  aria-label="Thu nhỏ"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
                  aria-label="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* ===== MESSAGES ===== */}
                <div className="h-[380px] overflow-y-auto p-4 space-y-3 bg-slate-900 relative">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                      <p className="text-sm">Chưa có tin nhắn nào</p>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div
                        key={m.id}
                        className="
                          bg-slate-800/80
                          border border-slate-700/50
                          rounded-xl p-3
                          hover:bg-slate-800
                          transition-all
                        "
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <div className="
                            w-9 h-9 rounded-full
                            bg-gradient-to-br from-emerald-500 to-green-600
                            flex items-center justify-center
                            text-white text-sm font-bold
                            flex-shrink-0
                          ">
                            {m.user.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-white text-sm font-semibold truncate">
                                {m.user}
                              </p>
                              <span className="text-slate-500 text-xs">•</span>
                              <p className="text-slate-400 text-xs">
                                {m.time}
                              </p>
                            </div>
                            <p className="text-slate-400 text-xs flex items-center gap-1">
                              📍 {m.location}
                            </p>
                          </div>
                        </div>
                        <p className="text-slate-200 text-sm ml-11 leading-relaxed">
                          {m.content}
                        </p>
                      </div>
                    ))
                  )}


                </div>

                {/* ===== INPUT AREA ===== */}
                <div className="p-4 bg-slate-800 border-t border-slate-700">
                  {!isAuthenticated ? (
                    <button
                      onClick={handleLogin}
                      className="
                        w-full
                        bg-gradient-to-r from-emerald-500 to-green-600
                        hover:from-emerald-600 hover:to-green-700
                        text-white font-semibold
                        py-3 px-4 rounded-xl
                        transition-all duration-300
                        hover:scale-105
                        shadow-lg hover:shadow-emerald-500/50
                        flex items-center justify-center gap-2
                      "
                    >
                      <LogIn className="w-5 h-5" />
                      Đăng nhập để bình luận
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Nhập tin nhắn..."
                        className="
                          flex-1
                          bg-slate-900
                          text-white
                          placeholder-slate-500
                          px-4 py-3
                          rounded-xl
                          border border-slate-700
                          focus:border-emerald-500
                          focus:outline-none
                          focus:ring-2
                          focus:ring-emerald-500/20
                          transition-all
                        "
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!text.trim()}
                        className="
                          bg-gradient-to-r from-emerald-500 to-green-600
                          hover:from-emerald-600 hover:to-green-700
                          disabled:from-slate-700 disabled:to-slate-700
                          text-white
                          p-3 rounded-xl
                          transition-all duration-300
                          hover:scale-105
                          disabled:hover:scale-100
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                          shadow-lg
                        "
                        aria-label="Gửi tin nhắn"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityWeatherChat;