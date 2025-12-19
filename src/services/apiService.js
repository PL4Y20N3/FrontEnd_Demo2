// src/services/apiService.js
import axios from 'axios';

// Base URL cho Spring Boot API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";


// Create axios instance với config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH APIs ====================

export const authAPI = {
  // Register
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },
};

// ==================== CHAT APIs ====================

export const chatAPI = {
  // Get messages by room
  getMessages: async (roomId, page = 0, size = 50) => {
    const response = await apiClient.get(`/chat/rooms/${roomId}/messages`, {
      params: { page, size }
    });
    return response.data;
  },

  // Send text message
  sendMessage: async (roomId, messageData) => {
    const response = await apiClient.post(`/chat/rooms/${roomId}/messages`, messageData);
    return response.data;
  },

  // Upload image message
  uploadImage: async (roomId, formData) => {
    const response = await apiClient.post(
      `/chat/rooms/${roomId}/messages/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Delete message
  deleteMessage: async (roomId, messageId) => {
    const response = await apiClient.delete(`/chat/rooms/${roomId}/messages/${messageId}`);
    return response.data;
  },

  // Get online users
  getOnlineUsers: async (roomId) => {
    const response = await apiClient.get(`/chat/rooms/${roomId}/online`);
    return response.data;
  },

  // Update online status
  updateOnlineStatus: async (roomId) => {
    const response = await apiClient.post(`/chat/rooms/${roomId}/online`);
    return response.data;
  },
};

// ==================== WEATHER APIs ====================

export const weatherAPI = {
  // Get weather by city
  getWeatherByCity: async (cityName) => {
    const response = await apiClient.get(`/weather/city/${cityName}`);
    return response.data;
  },

  // Get forecast
  getForecast: async (cityName, days = 5) => {
    const response = await apiClient.get(`/weather/forecast/${cityName}`, {
      params: { days }
    });
    return response.data;
  },
};

// ==================== WEBSOCKET CONNECTION ====================

let stompClient = null;

export const websocketService = {
  // Connect to WebSocket
  connect: (onMessageReceived, onError) => {
    // Sử dụng SockJS và STOMP
    const socket = new SockJS(`${API_BASE_URL.replace('/api', '')}/ws`);
    stompClient = Stomp.over(socket);

    const token = localStorage.getItem('auth_token');

    stompClient.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        console.log('WebSocket connected');
        // Subscribe to messages
      },
      (error) => {
        console.error('WebSocket error:', error);
        if (onError) onError(error);
      }
    );

    return stompClient;
  },

  // Subscribe to room messages
  subscribeToRoom: (roomId, callback) => {
    if (!stompClient || !stompClient.connected) {
      console.error('WebSocket not connected');
      return null;
    }

    return stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
      const data = JSON.parse(message.body);
      callback(data);
    });
  },

  // Send message via WebSocket
  sendMessage: (roomId, message) => {
    if (!stompClient || !stompClient.connected) {
      console.error('WebSocket not connected');
      return;
    }

    stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(message));
  },

  // Disconnect
  disconnect: () => {
    if (stompClient) {
      stompClient.disconnect();
      console.log('WebSocket disconnected');
    }
  },
};

export default apiClient;