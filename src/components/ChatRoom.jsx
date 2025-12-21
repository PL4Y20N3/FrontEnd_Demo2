import {
  subscribeToMessages,
  sendTextMessage,
  deleteMessage,
  subscribeToOnlineUsers,
  updateOnlineStatus,
  removeOnlineUser,
} from "../services/mockChatService";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Send,
  ArrowLeft,
  Users,
  MapPin,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import NewHeader from "./NewHeader";
import ImageUploadModal from "./ImageUploadModal";

const ChatRoom = () => {
  const { citySlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [sending, setSending] = useState(false);

  const cityNames = {
    hanoi: { name: "Hà Nội", weather: "21°C", condition: "Có mây" },
    "ho-chi-minh": { name: "TP. Hồ Chí Minh", weather: "28°C", condition: "Nắng" },
    "da-nang": { name: "Đà Nẵng", weather: "25°C", condition: "Mưa nhẹ" },
    "hai-phong": { name: "Hải Phòng", weather: "22°C", condition: "Nhiều mây" },
    "can-tho": { name: "Cần Thơ", weather: "29°C", condition: "Nắng gắt" },
    "ha-giang": { name: "Hà Giang", weather: "18°C", condition: "Sương mù" },
  };

  /* ================= LOAD ROOM INFO ================= */
  useEffect(() => {
    const info = cityNames[citySlug];
    if (info) {
      setRoomInfo(info);
      setLoading(false);
    } else {
      navigate("/community");
    }
  }, [citySlug, navigate]);

  /* ================= MESSAGES ================= */
  useEffect(() => {
    if (!citySlug) return;
    return subscribeToMessages(citySlug, (data) => {
      setMessages(data);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [citySlug]);

  /* ================= ONLINE USERS ================= */
  useEffect(() => {
    if (!citySlug || !user) return;
    return subscribeToOnlineUsers(citySlug, setOnlineUsers);
  }, [citySlug, user]);

  useEffect(() => {
    if (!citySlug || !user) return;

    updateOnlineStatus(citySlug, user.id, {
      displayName: user.displayName,
      avatar: user.avatar,
    });

    const interval = setInterval(() => {
      updateOnlineStatus(citySlug, user.id, {
        displayName: user.displayName,
        avatar: user.avatar,
      });
    }, 10000);

    return () => {
      clearInterval(interval);
      removeOnlineUser(citySlug, user.id);
    };
  }, [citySlug, user]);

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    await sendTextMessage(
      citySlug,
      user.id,
      user.displayName,
      user.avatar,
      newMessage.trim()
    );
    setNewMessage("");
    setSending(false);
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <>
      <NewHeader />

      <div className="h-screen flex flex-col bg-slate-100 dark:bg-slate-900 transition-colors">
        {/* ================= ROOM HEADER ================= */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/community")}
                className="p-2 rounded-lg hover:bg-white/10 text-white"
              >
                <ArrowLeft />
              </button>

              <div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-white w-5 h-5" />
                  <h1 className="text-2xl font-bold text-white">
                    {roomInfo.name}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-sm text-white">
                    {roomInfo.weather} • {roomInfo.condition}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/80 mt-1">
                  <Users className="w-4 h-4" />
                  {onlineUsers.length} người đang online
                </div>
              </div>
            </div>

            {/* AVATARS */}
            <div className="flex -space-x-2">
              {onlineUsers.slice(0, 5).map((u) => (
                <img
                  key={u.id}
                  src={u.avatar}
                  alt={u.displayName}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ))}
            </div>
          </div>
        </div>

        {/* ================= MESSAGES ================= */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg) => {
              const isOwn = msg.userId === user.id;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    isOwn ? "flex-row-reverse" : ""
                  }`}
                >
                  <img
                    src={msg.userAvatar}
                    alt={msg.userName}
                    className="w-10 h-10 rounded-full"
                  />

                  <div className="max-w-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {msg.userName}
                      </span>
                    </div>

                    <div
                      className={`group relative px-4 py-3 rounded-2xl text-sm leading-relaxed
                        ${
                          isOwn
                            ? "bg-emerald-500 text-white"
                            : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                        }
                      `}
                    >
                      {msg.content}

                      {isOwn && (
                        <button
                          onClick={() => deleteMessage(citySlug, msg.id)}
                          className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ================= INPUT ================= */}
        <div className="border-t border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-slate-800 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowImageUpload(true)}
                className="
                  p-3 rounded-xl
                  bg-slate-200 dark:bg-slate-700
                  hover:bg-slate-300 dark:hover:bg-slate-600
                  text-slate-700 dark:text-white
                "
              >
                <ImageIcon />
              </button>

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Chia sẻ thời tiết tại ${roomInfo.name}…`}
                className="
                  flex-1 px-4 py-3 rounded-2xl resize-none
                  bg-slate-100 dark:bg-slate-900
                  text-slate-900 dark:text-white
                  placeholder-slate-400
                  border border-slate-300 dark:border-emerald-500/20
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/30
                "
                rows={1}
              />

              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="
                  px-5 rounded-xl font-medium flex items-center gap-2
                  bg-emerald-500 hover:bg-emerald-600
                  disabled:opacity-50 disabled:cursor-not-allowed
                  text-white transition
                "
              >
                <Send className="w-5 h-5" />
                Gửi
              </button>
            </form>
          </div>
        </div>

        <ImageUploadModal
          isOpen={showImageUpload}
          onClose={() => setShowImageUpload(false)}
          roomInfo={roomInfo}
        />
      </div>
    </>
  );
};

export default ChatRoom;
