import { ArrowLeft, Bookmark, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SavedAdvicePage = () => {
  const { lang, toggleLang } = useLanguage();
  
  // Mock data for UI demonstration
  const [advices, setAdvices] = useState([
    { id: 1, date: '২০ নভেম্বর, ২০২৬', text: 'ধান গাছের পাতা হলুদ হওয়ার প্রধান কারণ নাইট্রোজেনের অভাব। ইউরিয়া সার প্রয়োগ করুন।' },
    { id: 2, date: '১৮ নভেম্বর, ২০২৬', text: 'টমেটো গাছে ব্লাইট রোগ দেখা দিলে আক্রান্ত গাছ তুলে ফেলুন এবং ছত্রাকনাশক স্প্রে করুন।' }
  ]);

  const deleteAdvice = (id) => {
    setAdvices(advices.filter(adv => adv.id !== id));
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="p-2 border border-gray-300 rounded-lg bg-white"><ArrowLeft size={20} className="text-gray-700" /></Link>
        <h1 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'সংরক্ষিত পরামর্শ' : 'Saved Advice'}</h1>
        <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white">বাং | EN</button>
      </div>

      {advices.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
          <Bookmark size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">আপনার কোনো সংরক্ষিত পরামর্শ নেই।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {advices.map((advice) => (
            <div key={advice.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative">
              <p className="text-xs text-gray-400 mb-2">{advice.date}</p>
              <p className="text-gray-700 leading-relaxed text-sm">{advice.text}</p>
              <button 
                onClick={() => deleteAdvice(advice.id)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAdvicePage;