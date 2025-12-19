import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Send, 
  ArrowLeft, 
  Users, 
  MapPin, 
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import NewHeader from './NewHeader';
import ImageUploadModal from './ImageUploadModal';
import ImageMessage from './ImageMessage';

const ChatRoom = () => {
  const { citySlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [sending, setSending] = useState(false);

  // Room info mapping
  const cityNames = {
    'hanoi': { name: 'Hà Nội', weather: '21°C', condition: 'Có mây' },
    'ho-chi-minh': { name: 'TP. Hồ Chí Minh', weather: '28°C', condition: 'Nắng' },
    'da-nang': { name: 'Đà Nẵng', weather: '25°C', condition: 'Mưa nhẹ' },
    'hai-phong': { name: 'Hải Phòng', weather: '22°C', condition: 'Nhiều mây' },
    'can-tho': { name: 'Cần Thơ', weather: '29°C', condition: 'Nắng gắt' },
    'ha-giang': { name: 'Hà Giang', weather: '18°C', condition: 'Sương mù' },
  };

  // Load room info
  useEffect(() => {
    const info = cityNames[citySlug];
    if (info) {
      setRoomInfo(info);
      setLoading(false);
    } else {
      navigate('/community');
    }
  }, [citySlug, navigate]);

  // Subscribe to messages (realtime)
  useEffect(() => {
    if (!citySlug) return;

    const unsubscribe = subscribeToMessages(citySlug, (newMessages) => {
      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [citySlug]);

  // Subscribe to online users (realtime)
  useEffect(() => {
    if (!citySlug || !user) return;

    const unsubscribe = subscribeToOnlineUsers(citySlug, (users) => {
      setOnlineUsers(users);
    });

    return () => unsubscribe();
  }, [citySlug, user]);

  // Update online status
  useEffect(() => {
    if (!citySlug || !user) return;

    // Update immediately
    updateOnlineStatus(citySlug, user.id, {
      displayName: user.displayName,
      avatar: user.avatar
    });

    // Update every 10 seconds
    const interval = setInterval(() => {
      updateOnlineStatus(citySlug, user.id, {
        displayName: user.displayName,
        avatar: user.avatar
      });
    }, 10000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      removeOnlineUser(citySlug, user.id);
    };
  }, [citySlug, user]);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send text message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendTextMessage(
        citySlug,
        user.id,
        user.displayName,
        user.avatar,
        newMessage.trim()
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  // Upload image message
  const handleImageUpload = async (imageData, imageFile) => {
    setSending(true);
    try {
      await sendImageMessage(
        citySlug,
        user.id,
        user.displayName,
        user.avatar,
        imageData,
        imageFile
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId, imagePath = null) => {
    if (!confirm('Bạn có chắc muốn xóa tin nhắn này?')) return;

    try {
      await deleteMessage(citySlug, messageId, imagePath);
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Không thể xóa tin nhắn. Vui lòng thử lại.');
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    // Handle Firestore Timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) {
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <NewHeader />
      <div className="h-screen bg-gray-900 flex flex-col">
        {/* Room Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/community')}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white" />
                  <h1 className="text-2xl font-bold text-white">
                    {roomInfo.name}
                  </h1>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">
                    {roomInfo.weather} • {roomInfo.condition}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                  <Users className="w-4 h-4" />
                  <span>{onlineUsers.length} người đang online</span>
                </div>
              </div>
            </div>

            {/* Online Users Avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {onlineUsers.slice(0, 5).map((onlineUser) => (
                  <img
                    key={onlineUser.id}
                    src={onlineUser.avatar}
                    alt={onlineUser.displayName}
                    className="w-10 h-10 rounded-full border-2 border-white"
                    title={onlineUser.displayName}
                  />
                ))}
              </div>
              {onlineUsers.length > 5 && (
                <span className="text-white text-sm">
                  +{onlineUsers.length - 5}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 max-w-md mx-auto">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Chưa có tin nhắn nào
                  </h3>
                  <p className="text-gray-400">
                    Hãy là người đầu tiên chia sẻ tình hình thời tiết tại {roomInfo.name}!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.userId === user.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <img
                      src={message.userAvatar}
                      alt={message.userName}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />

                    <div className={`flex-1 max-w-lg ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">
                          {message.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp || message.createdAt)}
                        </span>
                      </div>

                      {message.type === 'image' ? (
                        <ImageMessage 
                          message={message}
                          isOwn={isOwn}
                          onDelete={() => handleDeleteMessage(message.id, message.imageData?.path)}
                        />
                      ) : (
                        <div className="group relative">
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              isOwn ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {message.content}
                            </p>
                          </div>

                          {isOwn && (
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
              <button
                type="button"
                onClick={() => setShowImageUpload(true)}
                disabled={sending}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all flex items-center gap-2"
                title="Đăng ảnh thời tiết"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-700 focus-within:border-blue-500 transition-colors">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={`Chia sẻ tình hình thời tiết tại ${roomInfo.name}...`}
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 outline-none resize-none"
                  rows={1}
                  disabled={sending}
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all flex items-center gap-2 font-medium"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-2 text-center">
              💡 Enter để gửi • Shift + Enter xuống dòng • 📸 Click icon để đăng ảnh
            </p>
          </div>
        </div>

        {/* Image Upload Modal */}
        <ImageUploadModal
          isOpen={showImageUpload}
          onClose={() => setShowImageUpload(false)}
          onUpload={handleImageUpload}
          roomInfo={roomInfo}
        />
      </div>
    </>
  );
};

export default ChatRoom;