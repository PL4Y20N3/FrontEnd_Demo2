import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react';
import useTheme from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';

const NewHeader = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();

  const { user, isAuthenticated, logout } = useAuth();

  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  );

  // Update time every minute
  useEffect(() => {
    const tick = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* LOGO ONLY - CLICK HOME */}
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer hover:opacity-80 transition flex items-center"
          >
            <img
              src="/logo.png"
              alt="EcoTrack"
              className="h-10 w-auto"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            {/* AUTH + COMMUNITY */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Community */}
                  <button
                    onClick={() => navigate('/community')}
                    className="
                      px-4 py-2 rounded-lg font-medium transition-all
                      bg-emerald-500 hover:bg-emerald-600 text-white
                    "
                  >
                    Community
                  </button>

                  {/* User block */}
                  <div className="flex items-center gap-3 pl-2">
                    <img
                      src={user?.avatar || '/avatar-default.png'}
                      alt={user?.displayName || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-emerald-500 object-cover"
                    />

                    <div className="leading-tight">
                      <p className="text-slate-900 dark:text-white font-medium">
                        {user?.displayName || 'User'}
                      </p>

                      <button
                        onClick={logout}
                        className="text-xs text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                      >
                        <LogOut className="w-3 h-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Login */}
                  <button
                    onClick={() => navigate('/login')}
                    className="
                      px-4 py-2 rounded-lg font-medium transition-all
                      bg-emerald-500 hover:bg-emerald-600 text-white
                    "
                  >
                    Đăng nhập
                  </button>

                  {/* Community (locked/pro) */}
                  <button
                    onClick={() => navigate('/community')}
                    className="
                      px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                      bg-slate-200 hover:bg-slate-300 text-slate-900
                      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
                    "
                    title="Đăng nhập để tham gia Community"
                  >
                    <span>Community</span>
                    <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                      Pro
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* TIME + THEME TOGGLE (side-by-side) */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700">
              <div className="text-lg font-semibold text-slate-800 dark:text-white">
                {currentTime}
              </div>

              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewHeader;
