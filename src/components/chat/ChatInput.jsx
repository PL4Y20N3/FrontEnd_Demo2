import { useState } from "react";
import { Send, LogIn } from "lucide-react";

const ChatInput = ({
  isAuthenticated,
  onSend,
  onLogin,
  placeholder = "Nhập tin nhắn...",
  cityName,
}) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={onLogin}
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
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={cityName ? `Chia sẻ thời tiết tại ${cityName}...` : placeholder}
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
        onClick={handleSend}
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
  );
};

export default ChatInput;