import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { authAPI } from "../services/apiService";

/**
 * ===============================
 * CONFIG
 * ===============================
 * true  → DEMO MODE (không cần backend)
 * false → BACKEND MODE (Spring / Firebase / API thật)
 */
const USE_MOCK_AUTH = true;

/**
 * ===============================
 * CONTEXT
 * ===============================
 */
const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};

/**
 * ===============================
 * MOCK USER FACTORY
 * ===============================
 */
const createMockUser = ({ email, displayName }) => ({
  id: Date.now(),
  email,
  displayName: displayName || email.split("@")[0],
  avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${email}`,
  role: "user",
});

/**
 * ===============================
 * PROVIDER
 * ===============================
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * ===============================
   * INIT AUTH (ON REFRESH)
   * ===============================
   */
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * ===============================
   * LOGIN
   * ===============================
   */
  const login = async (email, password) => {
    if (USE_MOCK_AUTH) {
      await fakeDelay();

      if (!email || password.length < 6) {
        return {
          success: false,
          error: "Email hoặc mật khẩu không hợp lệ",
        };
      }

      const mockUser = createMockUser({ email });
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true, user: mockUser };
    }

    // ===== BACKEND MODE =====
    try {
      const response = await authAPI.login({ email, password });

      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);

      return { success: true, user: response.user };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Email hoặc mật khẩu không đúng",
      };
    }
    
  };

  /**
   * ===============================
   * REGISTER
   * ===============================
   */
  const register = async (email, password, displayName) => {
    if (USE_MOCK_AUTH) {
      await fakeDelay();

      if (!displayName) {
        return {
          success: false,
          error: "Vui lòng nhập tên hiển thị",
        };
      }

      const mockUser = createMockUser({ email, displayName });
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);

      return { success: true, user: mockUser };
    }

    // ===== BACKEND MODE =====
    try {
      const response = await authAPI.register({
        email,
        password,
        displayName,
      });

      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);

      return { success: true, user: response.user };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Đã có lỗi xảy ra",
      };
    }
  };

  /**
   * ===============================
   * LOGOUT
   * ===============================
   */
  const logout = async () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  /**
   * ===============================
   * UPDATE PROFILE (MOCK)
   * ===============================
   */
  const updateProfile = async (updates) => {
    if (!user) return { success: false };

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    return { success: true, user: updatedUser };
  };

  /**
   * ===============================
   * CONTEXT VALUE
   * ===============================
   */
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

/**
 * ===============================
 * HELPERS
 * ===============================
 */
const fakeDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 700));
