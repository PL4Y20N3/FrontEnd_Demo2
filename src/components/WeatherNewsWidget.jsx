import React, { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, ExternalLink, Clock } from "lucide-react";

const WeatherNewsWidget = ({ keyword = "weather Vietnam" }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://gnews.io/api/v4/search?q=${encodeURIComponent(
            keyword
          )}&lang=vi&max=6&sortby=publishedAt&apikey=${API_KEY}`
        );

        if (!res.ok) throw new Error("Failed to fetch news");

        const data = await res.json();
        setArticles(data.articles || []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải tin tức thời tiết");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [keyword, API_KEY]);

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 3600000);
    if (diff < 1) return "Vừa xong";
    if (diff < 24) return `${diff} giờ trước`;
    return `${Math.floor(diff / 24)} ngày trước`;
  };

  if (loading) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 border dark:border-gray-700">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Tin tức thời tiết
        </h3>
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-3xl p-6 border dark:border-gray-700">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-slate-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        Tin tức thời tiết
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((a, i) => (
          <a
            key={i}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl overflow-hidden bg-slate-100 dark:bg-gray-900/60 border dark:border-gray-700 hover:shadow-xl hover:scale-[1.02] transition"
          >
            {/* IMAGE */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={a.image || "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800"}
                alt={a.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {a.source?.name}
              </span>
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-500 transition">
                {a.title}
              </h4>

              <p className="text-xs text-slate-600 dark:text-gray-400 line-clamp-2 mb-3">
                {a.description}
              </p>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-slate-500 dark:text-gray-500">
                  <Clock className="w-3 h-3" />
                  {timeAgo(a.publishedAt)}
                </div>

                <div className="flex gap-2">
                  <ThumbsUp className="w-4 h-4 hover:text-emerald-500 transition" />
                  <ThumbsDown className="w-4 h-4 hover:text-red-500 transition" />
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* MORE */}
      <div className="mt-6 text-center">
        <button className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition">
          Xem thêm tin tức
        </button>
      </div>
    </div>
  );
};

export default WeatherNewsWidget;
