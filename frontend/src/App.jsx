import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, MessageSquare, Leaf, LogOut, User, Globe } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import HomePage from './pages/HomePage';
import DiseasePage from './pages/DiseasePage';
import ChatPage from './pages/ChatPage';
import WeatherPage from './pages/WeatherPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyCropsPage from './pages/MyCropsPage';
import FarmingGuidePage from './pages/FarmingGuidePage';
import ProfilePage from './pages/ProfilePage';

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;
  const { lang } = useLanguage();
  
  const navItems = [
    { name: lang === 'bn' ? 'হোম' : 'Home', path: '/', icon: Home },
    { name: lang === 'bn' ? 'রোগ' : 'Scan', path: '/disease', icon: Camera },
    { name: 'AI', path: '/chat', icon: MessageSquare },
    { name: lang === 'bn' ? 'প্রোফাইল' : 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-5 z-50">
      {navItems.map((item) => {
        const isActive = path === item.path;
        const Icon = item.icon;
        return (
          <Link key={item.name} to={item.path} className="flex flex-col items-center gap-1">
            <Icon size={24} className={isActive ? "text-green-700" : "text-gray-400"} />
            <span className={`text-[11px] font-medium ${isActive ? "text-green-700" : "text-gray-500"}`}>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

const TopNav = () => {
  const { lang, toggleLang } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="hidden md:flex bg-white shadow-sm px-8 py-4 justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-2xl hover:text-green-800 transition">
        <Leaf size={28} /> KrishiBondhu AI
      </Link>
      <div className="flex gap-6 font-medium text-gray-600 items-center">
        <Link to="/" className="hover:text-green-700 transition">{lang === 'bn' ? 'হোম' : 'Home'}</Link>
        <Link to="/disease" className="hover:text-green-700 transition">{lang === 'bn' ? 'রোগ শনাক্ত' : 'Disease Scan'}</Link>
        <Link to="/chat" className="hover:text-green-700 transition">AI Chat</Link>
        <Link to="/weather" className="hover:text-green-700 transition">{lang === 'bn' ? 'আবহাওয়া' : 'Weather'}</Link>
        
        <button onClick={toggleLang} className="flex items-center gap-1 text-green-700 font-bold hover:text-green-800 ml-2">
          <Globe size={18} /> {lang === 'bn' ? 'EN' : 'বাং'}
        </button>

        {user ? (
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
            <Link to="/profile" className="flex items-center gap-2 text-green-700 font-bold hover:text-green-800 transition bg-green-50 px-3 py-1.5 rounded-lg">
              <User size={18} /> {user.full_name}
            </Link>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center gap-1">
              <LogOut size={18} /> {lang === 'bn' ? 'লগআউট' : 'Logout'}
            </button>
          </div>
        ) : (
          <div className="flex gap-3 ml-4 pl-4 border-l border-gray-300">
            <Link to="/login" className="text-green-700 hover:underline">{lang === 'bn' ? 'লগইন' : 'Login'}</Link>
            <Link to="/register" className="bg-green-700 text-white px-4 py-1.5 rounded-lg hover:bg-green-800 transition">{lang === 'bn' ? 'রেজিস্টার' : 'Register'}</Link>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-[#fcfdfa]">
      <TopNav />
      <main className="pb-24 md:pb-8 md:px-8 md:max-w-7xl md:mx-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/disease" element={<DiseasePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/guide" element={<FarmingGuidePage />} />
          
          {/* PROTECTED ROUTES */}
          <Route path="/crops" element={<ProtectedRoute><MyCropsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;