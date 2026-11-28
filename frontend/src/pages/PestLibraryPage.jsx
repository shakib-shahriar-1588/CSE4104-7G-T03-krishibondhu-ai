import { useState } from 'react';
import { ArrowLeft, Search, Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const PestLibraryPage = () => {
  const { lang, toggleLang } = useLanguage();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const pests = [
    { id: 1, name: 'কারেন্ট পোকা', crop: 'ধান', desc: 'ধানের অন্যতম প্রধান ক্ষতিকর পোকা।', symptoms: ['পাতা হলুদ হয়ে শুকিয়ে যায়', 'গাছের বৃদ্ধি কমে যায়'], management: ['আক্রমণ দেখা মাত্র কীটনাশক স্প্রে করুন', 'আলো ফাঁদ ব্যবহার করুন'] },
    { id: 2, name: 'সাদা মাছি', crop: 'সবজি', desc: 'পাতার রস শোষণ করে গাছ দুর্বল করে দেয়।', symptoms: ['পাতার নিচে সাদা পোকা দেখা যায়', 'পাতা কুঁকড়ে যায়'], management: ['হলুদ আঠালো ফাঁদ ব্যবহার করুন', 'নিম তেল স্প্রে করুন'] },
  ];

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link to="/guide" className="p-2 border border-gray-300 rounded-lg bg-white"><ArrowLeft size={20} className="text-gray-700" /></Link>
        <h1 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'পোকা ও রোগ' : 'Pest Library'}</h1>
        <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white">{lang === 'bn' ? 'বাং | EN' : 'EN | বাং'}</button>
      </div>

      <div className="relative mb-6">
        <input type="text" placeholder={lang === 'bn' ? 'পোকার নাম বা ফসল দিয়ে খুঁজুন' : 'Search by pest or crop'} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-green-700 shadow-sm" />
        <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {pests.filter(p => p.name.includes(search) || p.crop.includes(search)).map(pest => (
          <div key={pest.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <button onClick={() => setExpanded(expanded === pest.id ? null : pest.id)} className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full"><Bug size={20} className="text-green-700" /></div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">{pest.name}</h3>
                  <p className="text-xs text-gray-500">{pest.crop} ফসলের</p>
                </div>
              </div>
              {expanded === pest.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>
            
            {expanded === pest.id && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 text-sm space-y-3">
                <p className="text-gray-700">{pest.desc}</p>
                <div>
                  <p className="font-bold text-gray-800 mb-1">লক্ষণ:</p>
                  <ul className="list-disc list-inside text-gray-600">{pest.symptoms.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div>
                  <p className="font-bold text-gray-800 mb-1">ব্যবস্থাপনা:</p>
                  <ul className="list-disc list-inside text-gray-600">{pest.management.map((m, i) => <li key={i}>{m}</li>)}</ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PestLibraryPage;