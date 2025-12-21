import { MessageCircle } from "lucide-react";

const ChatMessageList = ({ messages = [] }) => {
  if (!messages.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-sm">Chưa có tin nhắn nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
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
              {m.user.charAt(0).toUpperCase()}
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
              {m.location && (
                <p className="text-slate-400 text-xs flex items-center gap-1">
                  📍 {m.location}
                </p>
              )}
            </div>
          </div>
          <p className="text-slate-200 text-sm ml-11 leading-relaxed">
            {m.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ChatMessageList;