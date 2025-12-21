import { useEffect, useState } from "react";

/**
 * Hook dùng chung cho chat
 * @param {string} citySlug
 */
export const useChat = (citySlug) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===== LOAD MESSAGES (MOCK) ===== */
  useEffect(() => {
    if (!citySlug) return;

    setLoading(true);

    // giả lập call API / realtime
    const timeout = setTimeout(() => {
      setMessages([
        {
          id: 1,
          user: "Nguyễn Văn Minh",
          content: "Trời đang mưa nhẹ, nhớ mang ô nhé 🌧️",
          time: "10:30",
        },
        {
          id: 2,
          user: "Trần Thị Hoa",
          content: "Nhiệt độ giảm rồi, hơi lạnh",
          time: "11:15",
        },
      ]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [citySlug]);

  /* ===== SEND MESSAGE ===== */
  const sendMessage = (text, user) => {
    if (!text || !user) return;

    const newMessage = {
      id: Date.now(),
      user: user.displayName,
      content: text,
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // update UI ngay (optimistic update)
    setMessages((prev) => [...prev, newMessage]);
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
};
