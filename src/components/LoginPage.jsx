import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Leaf } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isLogin
        ? await login(formData.email, formData.password)
        : await register(formData.email, formData.password, formData.displayName);

      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Đã có lỗi xảy ra');
      }
    } catch {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4
      bg-gradient-to-br from-emerald-900 via-green-900 to-slate-900">

      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[28rem] h-[28rem] bg-emerald-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-[28rem] h-[28rem] bg-green-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8
          border border-emerald-500/20 shadow-2xl">

          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-500/20 p-3 rounded-2xl">
                <Leaf className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {isLogin ? 'Chào mừng trở lại' : 'Tạo tài khoản EcoTrack'}
            </h1>
            <p className="text-slate-400">
              {isLogin
                ? 'Đăng nhập để tham gia cộng đồng thời tiết xanh'
                : 'Cùng xây dựng cộng đồng thời tiết bền vững'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-xl text-sm
              bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tên hiển thị
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                    placeholder="Tên của bạn"
                    className="w-full pl-12 pr-4 py-3 rounded-xl
                      bg-slate-800/60 border border-slate-700
                      text-white placeholder-slate-500
                      focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl
                    bg-slate-800/60 border border-slate-700
                    text-white placeholder-slate-500
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl
                    bg-slate-800/60 border border-slate-700
                    text-white placeholder-slate-500
                    focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white
                bg-emerald-500 hover:bg-emerald-600
                disabled:bg-slate-700 disabled:cursor-not-allowed
                transition-all shadow-lg"
            >
              {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-slate-400 hover:text-white"
            >
              {isLogin
                ? <>Chưa có tài khoản? <span className="text-emerald-400 font-semibold">Đăng ký</span></>
                : <>Đã có tài khoản? <span className="text-emerald-400 font-semibold">Đăng nhập</span></>
              }
            </button>
          </div>

          {/* Back */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-slate-500 hover:text-slate-300"
            >
              ← Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
