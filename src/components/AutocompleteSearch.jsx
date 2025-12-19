import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AutocompleteSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const popularCities = [
    'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong',
    'Can Tho', 'Hue', 'Nha Trang', 'Vung Tau',
    'Tokyo', 'Paris', 'London', 'New York', 'Seoul', 'Bangkok',
  ];

  const fetchSuggestions = async (searchText) => {
    if (searchText.length < 2) return setSuggestions([]);

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=1695ccb58d97424299a11955251312&q=${searchText}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions(
        popularCities
          .filter(c => c.toLowerCase().includes(searchText.toLowerCase()))
          .map(name => ({ name }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(() => query && fetchSuggestions(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative max-w-2xl mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!query.trim()) return;
          navigate(`/city/${query}`);
          setQuery('');
          setShowSuggestions(false);
        }}
      >
        <div className="relative">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Tìm kiếm thành phố, địa điểm..."
            className="
              w-full px-6 py-4 pr-12 rounded-2xl text-lg
              bg-white text-slate-900 placeholder-slate-400
              border-2 border-slate-300
              focus:outline-none focus:border-emerald-500
              transition-all
              dark:bg-white/10 dark:text-white dark:placeholder-white/60
              dark:border-white/20
              backdrop-blur-md
            "
          />

          <button
            type="submit"
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              p-2 rounded-xl
              bg-emerald-500 hover:bg-emerald-600
              transition-colors
            "
          >
            <Search className="w-6 h-6 text-white" />
          </button>
        </div>
      </form>

      {showSuggestions && query && (
        <div
          ref={dropdownRef}
          className="
            absolute top-full mt-2 w-full
            bg-white dark:bg-gray-800/95
            backdrop-blur-md rounded-2xl
            border border-slate-200 dark:border-gray-700
            shadow-2xl z-50 overflow-hidden
          "
        >
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin h-6 w-6 border-b-2 border-emerald-500 mx-auto" />
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => navigate(`/city/${city.name}`)}
                  className="
                    px-6 py-3 cursor-pointer transition-colors
                    hover:bg-emerald-50 dark:hover:bg-emerald-500/20
                    border-b border-slate-100 dark:border-gray-700/30
                  "
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {city.name}
                      </div>
                      {city.region && (
                        <div className="text-slate-500 dark:text-gray-400 text-sm">
                          {city.region}, {city.country}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;
