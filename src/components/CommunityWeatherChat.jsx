import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  Users,
  X,
  Minimize2,
  LogIn,
} from "lucide-react";

const CommunityWeatherChat = ({ city = "Hanoi" }) => {
  const navigate = useNavigate();

  /* ===== AUTH MOCK (thay bằng useAuth sau) ===== */
  const [isAuthenticated] = useState(false);
  const user = { displayName: "Eco User" };

  /* ===== STATE ===== */
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  /* ===== CITY MAP ===== */
  const cityNames = {
    hanoi: "Hà Nội",
    "ho-chi-minh": "TP. Hồ Chí Minh",
    "da-nang": "Đà Nẵng",
    "hai-phong": "Hải Phòng",
    "can-tho": "Cần Thơ",
    "ha-giang": "Hà Giang",
  };

  const cityName = cityNames[city.toLowerCase()] || city;

  /* ===== MOCK DATA ===== */
  useEffect(() => {
    setMessages([
      {
        id: 1,
        user: "Nguyễn Văn Minh",
        location: "Hà Nội",
        content: "Trời đang mưa nhẹ, nhớ mang theo ô nhé!",
        time: "10:30",
      },
      {
        id: 2,
        user: "Trần Thị Hoa",
        location: "Quảng Ninh",
        content: "Nhiệt độ đang giảm, hơi lạnh 🌧️",
        time: "11:15",
      },
    ]);
  }, [city]);

  /* ===== HANDLERS ===== */
  const sendMessage = () => {
    if (!text.trim() || !isAuthenticated) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: user.displayName,
        location: cityName,
        content: text,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setText("");
  };

  const handleLogin = () => {
    setIsOpen(false);
    navigate("/login");
  };

  /* ===== RENDER ===== */
  return (
    <>
      {/* ===== FLOATING BUTTON ===== */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            fixed bottom-6 right-6 z-50
            bg-gradient-to-r from-emerald-500 to-green-600
            hover:from-emerald-600 hover:to-green-700
            text-white rounded-full p-4
            shadow-xl ring-1 ring-emerald-500/30
            transition-all hover:scale-110
          "
        >
          <MessageCircle className="w-6 h-6" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* ===== CHAT WINDOW ===== */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96">
          <div
            className="
              bg-white dark:bg-slate-800
              border border-emerald-500/30
              rounded-2xl shadow-2xl overflow-hidden
            "
          >
            {/* ===== HEADER ===== */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-sm">
                    Cộng đồng thời tiết
                  </h3>
                  <p className="text-white/90 text-xs flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {messages.length} tin nhắn
                  </p>
                </div>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:bg-white/10 p-2 rounded-lg"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:bg-white/10 p-2 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* ===== MESSAGES ===== */}
                <div className="h-[360px] overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className="
                        bg-white dark:bg-slate-800
                        border border-slate-200 dark:border-slate-700
                        rounded-xl p-3
                      "
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center font-bold text-sm">
                          {m.user.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800 dark:text-white text-sm">
                              {m.user}
                            </p>
                            <span className="text-xs text-slate-400">
                              {m.time}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            📍 {m.location}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 ml-11">
                        {m.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ===== INPUT ===== */}
                <div className="p-4 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                  {!isAuthenticated ? (
                    <button
                      onClick={handleLogin}
                      className="
                        w-full
                        bg-gradient-to-r from-emerald-500 to-green-600
                        hover:from-emerald-600 hover:to-green-700
                        text-white font-semibold
                        py-3 rounded-xl
                        shadow-md hover:shadow-emerald-500/40
                        flex items-center justify-center gap-2
                      "
                    >
                      <LogIn className="w-5 h-5" />
                      Đăng nhập để bình luận
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Nhập tin nhắn..."
                        className="
                          flex-1
                          bg-white dark:bg-slate-900
                          text-slate-900 dark:text-white
                          placeholder-slate-400
                          px-4 py-3 rounded-xl
                          border border-slate-300 dark:border-slate-700
                          focus:border-emerald-500
                          focus:ring-2 focus:ring-emerald-500/20
                          outline-none
                        "
                      />
                      <button
                        onClick={sendMessage}
                        className="
                          bg-gradient-to-r from-emerald-500 to-green-600
                          hover:from-emerald-600 hover:to-green-700
                          text-white p-3 rounded-xl
                        "
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
    </>
  );
};

export default CommunityWeatherChat;
