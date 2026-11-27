import { useState, useEffect } from 'react';
import { ArrowLeft, Cloud, MapPin, AlertTriangle, RefreshCw, Sparkles, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { bdLocations } from '../data/bdLocations'; // <-- Import the location data

const WeatherPage = () => {
  const { lang, toggleLang } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Khulna'); 
  const [unit, setUnit] = useState('C');
  const [aiWarning, setAiWarning] = useState('');
  const [loadingWarning, setLoadingWarning] = useState(false);
  
  // Autocomplete State
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  useEffect(() => {
    if (weather) generateAIWarning(weather);
  }, [weather, lang]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      // Pass the city (which might be "Savar, Dhaka") to the backend
      const response = await api.get(`/weather?city=${encodeURIComponent(cityName)}`);
      setWeather(response.data.weather);
      setShowSearch(false);
    } catch (error) {
      alert(lang === 'bn' ? 'এই এলাকার আবহাওয়া পাওয়া যায়নি।' : 'Could not find weather for this location.');
    } finally {
      setLoading(false);
    }
  };

  const generateAIWarning = async (weatherData) => {
    setLoadingWarning(true);
    setAiWarning('');
    try {
      const prompt = `Current weather in ${weatherData.city}: ${weatherData.temperature}°C, humidity ${weatherData.humidity}%, condition: ${weatherData.condition}. Provide a very short (max 1-2 sentences), practical agricultural warning for farmers. Reply ONLY with the warning in ${lang === 'bn' ? 'Bangla' : 'English'}.`;
      const response = await api.post('/ai/chat', { message: prompt });
      setAiWarning(response.data.reply);
    } catch (error) {
      setAiWarning(lang === 'bn' ? 'আবহাওয়া বিশ্লেষণ করা যাচ্ছে না।' : 'Could not analyze weather.');
    } finally {
      setLoadingWarning(false);
    }
  };

  // Autocomplete Logic
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 0) {
      // Find locations that start with the typed letters
      const filtered = bdLocations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Show max 8 results to keep dropdown clean
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCity = (selectedCity) => {
    setCity(selectedCity);
    setSearchQuery('');
    setSuggestions([]);
  };

  const toggleUnit = () => setUnit(unit === 'C' ? 'F' : 'C');
  const displayTemp = (tempC) => unit === 'C' ? `${Math.round(tempC)}°C` : `${Math.round((tempC * 9/5) + 32)}°F`;

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="p-2 border border-gray-300 rounded-lg bg-white"><ArrowLeft size={20} className="text-gray-700" /></Link>
        <h1 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'আবহাওয়া' : 'Weather'}</h1>
        <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white">বাং | EN</button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin"></div></div>
      ) : weather ? (
        <div className="animate-fade-in pb-10">
          <div className="bg-[#1b5e20] text-white p-6 rounded-3xl mb-4 shadow-md relative overflow-hidden">
            <button onClick={toggleUnit} className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-lg text-sm font-bold hover:bg-white/30 transition">°{unit === 'C' ? 'F' : 'C'}</button>
            <div className="flex items-start gap-4 mb-6">
              <Cloud size={48} className="text-yellow-300" />
              <div className="flex items-start"><h2 className="text-6xl font-bold">{displayTemp(weather.temperature).slice(0, -2)}</h2><span className="text-3xl mt-1">{displayTemp(weather.temperature).slice(-2)}</span></div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-200">
              <p className="flex items-center gap-1"><MapPin size={16} /> {weather.city}</p>
              <p>{lang === 'bn' ? 'আর্দ্রতা' : 'Humidity'}: {weather.humidity}%</p>
              <p>{lang === 'bn' ? 'অবস্থা' : 'Condition'}: {weather.condition}</p>
            </div>
          </div>

          <div className="bg-[#fff8e1] border border-yellow-200 p-4 rounded-xl flex items-start gap-3 mb-6 shadow-sm">
            {loadingWarning ? <Sparkles size={24} className="text-yellow-600 animate-pulse mt-0.5" /> : <AlertTriangle size={24} className="text-yellow-600 mt-0.5 shrink-0" />}
            <div>
              <p className="text-yellow-800 font-bold text-sm mb-1">{lang === 'bn' ? 'এআই কৃষি সতর্কতা:' : 'AI Agriculture Alert:'}</p>
              <p className="text-yellow-800 text-sm leading-relaxed">{loadingWarning ? (lang === 'bn' ? 'বিশ্লেষণ করা হচ্ছে...' : 'Analyzing...') : aiWarning}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-3">{lang === 'bn' ? 'আগামী ৫ দিন' : 'Next 5 Days'}</h3>
          <div className="space-y-3">
            {['কাল', 'শুক্রবার', 'শনিবার', 'রবিবার', 'সোমবার'].map((day, index) => (
              <div key={index} className="bg-white border border-gray-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3"><Cloud size={24} className="text-green-700" /><span className="font-semibold text-gray-800">{day}</span></div>
                <div className="text-sm font-medium text-gray-600"><span className="text-gray-900 font-bold">{displayTemp(30 + index)} / {displayTemp(22 + index)}</span> <span className="text-blue-500 ml-2">{10 + index * 5}%</span></div>
              </div>
            ))}
          </div>

          {/* AUTOCOMPLETE LOCATION SEARCH */}
          <div className="mt-6 relative">
            {!showSearch ? (
              <button onClick={() => setShowSearch(true)} className="w-full bg-white border border-gray-300 text-gray-800 py-3 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2">
                <RefreshCw size={18} /> {lang === 'bn' ? 'এলাকা বদলান' : 'Change Location'}
              </button>
            ) : (
              <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-md">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder={lang === 'bn' ? 'গ্রাম/শহর/জেলা লিখুন...' : 'Type village/city/district...'} 
                    value={searchQuery} 
                    onChange={handleSearchChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-green-700"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                {suggestions.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    {suggestions.map((sug, idx) => (
                      <button key={idx} onClick={() => handleSelectCity(sug)} className="w-full text-left px-4 py-2 hover:bg-green-50 border-b border-gray-100 last:border-0 text-sm font-medium text-gray-700">
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={() => setShowSearch(false)} className="text-xs text-red-500 mt-2 font-semibold underline">Cancel</button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default WeatherPage;