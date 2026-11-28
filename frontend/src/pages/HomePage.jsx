import { useState, useEffect } from 'react';
import { Camera, MessageSquare, Cloud, Leaf, BookOpen, Phone, FlaskConical, Sprout, Bell, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const { lang, toggleLang } = useLanguage();

  const handleHelp = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) window.location.href = 'tel:16123';
    else alert(lang === 'bn' ? 'মোবাইল থেকে ১৬১২৩ নম্বরে কল করুন।' : 'Please call 16123 from your mobile phone.');
  };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 md:hidden">
        <div className="text-green-700"><Leaf size={32} /></div>
        <button onClick={toggleLang} className="bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold">{lang === 'bn' ? 'English' : 'বাংলা'}</button>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {lang === 'bn' ? `Hello, ${user?.full_name?.split(' ')[0] || 'কৃষক ভাই'}` : `Hello, ${user?.full_name?.split(' ')[0] || 'Farmer'}`}
      </h1>

      {/* Primary Action Card */}
      <Link to="/disease" className="block bg-[#1b5e20] text-white p-5 rounded-3xl mb-6 shadow-md flex items-center gap-4 hover:bg-green-800 transition">
        <div className="bg-white/20 p-3 rounded-full"><Camera size={32} className="text-yellow-300" /></div>
        <div>
          <h2 className="text-xl font-bold">{lang === 'bn' ? 'ছবি তুলে রোগ শনাক্ত' : 'Detect Disease'}</h2>
          <p className="text-sm text-gray-200">{lang === 'bn' ? 'Detect Disease' : 'ছবি তুলে রোগ শনাক্ত'}</p>
        </div>
      </Link>

      {/* 8 Feature Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/chat" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <MessageSquare size={28} className="text-green-700 mb-2" />
          <div><h3 className="text-lg font-bold text-gray-800">{lang === 'bn' ? 'AI-কে জিজ্ঞাসা করুন' : 'Ask AI'}</h3></div>
        </Link>
        
        <Link to="/weather" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <Cloud size={28} className="text-green-700 mb-2" />
          <div><h3 className="text-lg font-bold text-gray-800">{lang === 'bn' ? 'আবহাওয়া' : 'Weather'}</h3></div>
        </Link>

        <Link to="/crops" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <Leaf size={28} className="text-green-700 mb-2" />
          <div><h3 className="text-lg font-bold text-gray-800">{lang === 'bn' ? 'আমার ফসল' : 'My Crops'}</h3></div>
        </Link>

        <Link to="/guide" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <BookOpen size={28} className="text-green-700 mb-2" />
          <div><h3 className="text-lg font-bold text-gray-800">{lang === 'bn' ? 'কৃষি জ্ঞান' : 'Farming Guide'}</h3></div>
        </Link>

        <Link to="/fertilizer" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <FlaskConical size={28} className="text-green-700 mb-2" />
          <div><h3 className="text-lg font-bold text-gray-800">{lang === 'bn' ? 'সার পরামর্শ' : 'Fertilizer'}</h3></div>
        </Link>

        <Link to="/recommendation" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <Sprout size={28} className="text-green-700 mb-2" />
          <div><h3 className="text-lg font-bold text-gray-800">{lang === 'bn' ? 'ফসল নির্দেশনা' : 'Crop Rec.'}</h3></div>
        </Link>

        <Link to="/reminders" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <Bell size={28} className="text-green-700 mb-2" />
          <div><h3 className="text-lg font-bold text-gray-800">{lang === 'bn' ? 'রিমাইন্ডার' : 'Reminders'}</h3></div>
        </Link>

        <Link to="/saved" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition">
          <Bookmark size={28} className="text-green-700 mb-2" />
          <div><h3 className="text-lg font-bold text-gray-800">{lang === 'bn' ? 'সংরক্ষিত পরামর্শ' : 'Saved Advice'}</h3></div>
        </Link>
      </div>

      {/* Helpline Button */}
      <button onClick={handleHelp} className="w-full bg-green-700 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:bg-green-800 transition">
        <Phone size={20} /> {lang === 'bn' ? 'সাহায্য ও হেল্পলাইন (কল করুন)' : 'Help & Helpline (Call)'}
      </button>
    </div>
  );
};

export default HomePage;