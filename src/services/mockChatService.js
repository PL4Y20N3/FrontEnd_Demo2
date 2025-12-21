/* ================= MOCK STORAGE ================= */

const MESSAGE_KEY = (room) => `chat_messages_${room}`;
const ONLINE_KEY = (room) => `chat_online_${room}`;

const listeners = {};

/* ================= UTILS ================= */
const notify = (room) => {
  (listeners[room] || []).forEach((cb) => cb(getMessages(room)));
};

const getMessages = (room) => {
  return JSON.parse(localStorage.getItem(MESSAGE_KEY(room)) || "[]");
};

const saveMessages = (room, messages) => {
  localStorage.setItem(MESSAGE_KEY(room), JSON.stringify(messages));
  notify(room);
};

/* ================= MESSAGES ================= */

export const subscribeToMessages = (room, callback) => {
  listeners[room] = listeners[room] || [];
  listeners[room].push(callback);

  callback(getMessages(room));

  return () => {
    listeners[room] = listeners[room].filter((cb) => cb !== callback);
  };
};

export const sendTextMessage = async (
  room,
  userId,
  userName,
  userAvatar,
  content
) => {
  const messages = getMessages(room);

  messages.push({
    id: Date.now(),
    type: "text",
    userId,
    userName,
    userAvatar,
    content,
    createdAt: Date.now(),
  });

  saveMessages(room, messages);
};

export const deleteMessage = async (room, messageId) => {
  const messages = getMessages(room).filter((m) => m.id !== messageId);
  saveMessages(room, messages);
};

/* ================= ONLINE USERS ================= */

export const subscribeToOnlineUsers = (room, callback) => {
  const interval = setInterval(() => {
    const users = JSON.parse(localStorage.getItem(ONLINE_KEY(room)) || "[]");
    callback(users);
  }, 1000);

  return () => clearInterval(interval);
};

export const updateOnlineStatus = (room, userId, user) => {
  const users = JSON.parse(localStorage.getItem(ONLINE_KEY(room)) || "[]");

  const filtered = users.filter((u) => u.id !== userId);
  filtered.push({ id: userId, ...user, lastActive: Date.now() });

  localStorage.setItem(ONLINE_KEY(room), JSON.stringify(filtered));
};

export const removeOnlineUser = (room, userId) => {
  const users = JSON.parse(localStorage.getItem(ONLINE_KEY(room)) || "[]");
  localStorage.setItem(
    ONLINE_KEY(room),
    JSON.stringify(users.filter((u) => u.id !== userId))
  );
};
