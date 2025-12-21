import { useState } from "react";
import { MessageCircle, X, Minimize2, Users } from "lucide-react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";

const CommunityChatWidget = ({
  cityName = "Hà Nội",
  messages = [],
  isAuthenticated = false,
  onSend,
  onLogin,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

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
            shadow-2xl transition-all duration-300
            hover:scale-110
            group
          "
          aria-label="Mở chat cộng đồng"
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
        <div className="fixed bottom-6 right-6 z-50 w-96 transition-all duration-300">
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
                    {cityName} • {messages.length} tin nhắn
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
                  onClick={handleClose}
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
                <div className="h-[380px] overflow-y-auto p-4 bg-slate-900">
                  <ChatMessageList messages={messages} />
                </div>

                {/* ===== INPUT AREA ===== */}
                <div className="p-4 bg-slate-800 border-t border-slate-700">
                  <ChatInput
                    isAuthenticated={isAuthenticated}
                    onSend={onSend}
                    onLogin={onLogin}
                    cityName={cityName}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityChatWidget;