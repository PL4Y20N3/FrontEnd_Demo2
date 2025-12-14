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

  // Popular cities
  const popularCities = [
    'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hai Phong',
    'Can Tho', 'Hue', 'Nha Trang', 'Vung Tau',
    'Tokyo', 'Paris', 'London', 'New York', 'Seoul', 'Bangkok'
  ];

  // Fetch suggestions from WeatherAPI
  const fetchSuggestions = async (searchText) => {
    if (searchText.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=1695ccb58d97424299a11955251312&q=${searchText}`
      );
      const data = await response.json();
      
      const formatted = data.map(city => ({
        name: city.name,
        region: city.region,
        country: city.country,
        fullName: `${city.name}, ${city.region}, ${city.country}`
      }));
      
      setSuggestions(formatted);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Fallback to local filter
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(searchText.toLowerCase())
      );
      setSuggestions(filtered.map(city => ({ name: city, fullName: city })));
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/city/${query.trim()}`);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (cityName) => {
    navigate(`/city/${cityName}`);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Tìm kiếm thành phố, địa điểm..."
            className="w-full px-6 py-4 pr-12 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 text-white placeholder-white/60 text-lg focus:outline-none focus:border-purple-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-purple-500 hover:bg-purple-600 rounded-xl transition-colors"
          >
            <Search className="w-6 h-6 text-white" />
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (query.length > 0 || suggestions.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-gray-800/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden z-50"
        >
          {loading ? (
            <div className="p-4 text-center text-white/60">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSelectCity(city.name)}
                  className="px-6 py-3 hover:bg-purple-500/20 cursor-pointer transition-colors border-b border-gray-700/30 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-semibold">{city.name}</div>
                      {city.region && (
                        <div className="text-gray-400 text-sm">
                          {city.region}, {city.country}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : query.length > 0 ? (
            <div className="p-4 text-center text-white/60">
              Không tìm thấy kết quả cho "{query}"
            </div>
          ) : (
            <div className="p-4">
              <div className="text-white/80 text-sm mb-3">Thành phố phổ biến:</div>
              <div className="flex flex-wrap gap-2">
                {popularCities.slice(0, 8).map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCity(city)}
                    className="px-3 py-1.5 bg-gray-700/50 hover:bg-purple-500/30 rounded-lg text-white text-sm transition-colors"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;