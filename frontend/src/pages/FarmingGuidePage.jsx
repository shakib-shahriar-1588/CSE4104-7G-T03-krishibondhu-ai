import { useState } from 'react';
import { ArrowLeft, BookOpen, X, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const FarmingGuidePage = () => {
  const { lang, toggleLang } = useLanguage();
  const [selectedGuide, setSelectedGuide] = useState(null);

  const guidesData = {
    bn: [
      { id: 1, title: 'ধান চাষের সঠিক পদ্ধতি', desc: 'জমি তৈরি থেকে শুরু করে ফসল কাটা পর্যন্ত বিস্তারিত নির্দেশিকা।', fullText: 'ধান চাষের জন্য প্রথমে জমি ভালোভাবে চাষ ও মই দিতে হবে। এরপর বীজতলা তৈরি করে বীজ বপন করতে হবে। সঠিক পরিমাণ সার ও পানি নিশ্চিত করতে হবে। রোগবালাই দমনে সতর্ক থাকতে হবে।' },
      { id: 2, title: 'সারের সঠিক ব্যবহার', desc: 'কোন ফসলে কখন এবং কী পরিমাণ সার প্রয়োগ করবেন।', fullText: 'মাটির স্বাস্থ্য পরীক্ষা করে সারের মাত্রা নির্ধারণ করা উচিত। সাধারণত ইউরিয়া, টিএসপি, এমওপি এবং জৈব সার মিশিয়ে প্রয়োগ করতে হয়। ফসলের বৃদ্ধির বিভিন্ন পর্যায়ে সার প্রয়োগের নিয়ম আলাদা।' },
      { id: 3, title: 'জৈব বালাইনাশক তৈরি', desc: 'ঘরোয়া উপকরণ দিয়ে পোকা দমনের সহজ উপায়।', fullText: 'নিম পাতা, রসুন, মরিচ ও তেঁতুল পাতা দিয়ে সহজেই জৈব বালাইনাশক তৈরি করা যায়। এগুলো পানিতে সিদ্ধ করে ছেঁকে নিয়ে স্প্রে করলে ফসলের ক্ষতিকর পোকা দমন করা সম্ভব। এটি পরিবেশবান্ধব।' },
      { id: 4, title: 'সেচ ব্যবস্থাপনা', desc: 'বিভিন্ন মৌসুমে ফসলের পানির চাহিদা মেটানোর নিয়ম।', fullText: 'শুকনো মৌসুমে ফসলের পানির চাহিদা বেশি থাকে। জমিতে পর্যাপ্ত আর্দ্রতা ধরে রাখতে সময়মতো সেচ দিতে হবে। তবে অতিরিক্ত পানি যেন জমিতে জমে না থাকে সেদিকে খেয়াল রাখতে হবে।' },
    ],
    en: [
      { id: 1, title: 'Proper Rice Cultivation', desc: 'A detailed guide from land preparation to harvesting.', fullText: 'For rice cultivation, the land must be plowed well. Then, prepare a seedbed and sow the seeds. Ensure the right amount of fertilizer and water. Be careful about pest control.' },
      { id: 2, title: 'Correct Use of Fertilizer', desc: 'When and how much fertilizer to apply for which crop.', fullText: 'Fertilizer dosage should be determined by testing the soil. Usually, Urea, TSP, MOP, and organic fertilizers are mixed and applied. The rules for fertilizer application vary at different stages of crop growth.' },
      { id: 3, title: 'Making Organic Pesticides', desc: 'Easy ways to control pests using household ingredients.', fullText: 'Organic pesticides can be easily made using neem leaves, garlic, chili, and tamarind leaves. Boil them in water, strain, and spray to control harmful pests. This is eco-friendly.' },
      { id: 4, title: 'Irrigation Management', desc: 'Rules for meeting crop water demands in different seasons.', fullText: 'Crops need more water in the dry season. Irrigate on time to maintain adequate moisture in the field. However, make sure excess water does not accumulate in the land.' },
    ]
  };

  const currentGuides = guidesData[lang];

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto min-h-screen relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="p-2 border border-gray-300 rounded-lg bg-white">
          <ArrowLeft size={20} className="text-gray-700" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'কৃষি জ্ঞান' : 'Farming Guide'}</h1>
        
        <button 
          onClick={toggleLang}
          className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
        >
          {lang === 'bn' ? 'বাং | EN' : 'EN | বাং'}
        </button>
      </div>

      {/* Guide List */}
      <div className="space-y-4 mb-8">
        {currentGuides.map((guide) => (
          <div 
            key={guide.id} 
            onClick={() => setSelectedGuide(guide)}
            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-start gap-4 hover:shadow-md hover:border-green-300 transition cursor-pointer"
          >
            <div className="bg-green-100 p-3 rounded-full mt-1">
              <BookOpen size={24} className="text-green-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{guide.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{guide.desc}</p>
              <p className="text-xs text-green-600 font-semibold mt-2">
                {lang === 'bn' ? 'বিস্তারিত পড়ুন →' : 'Read More →'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* NEW: AI Chat Banner for specific questions */}
      <div className="bg-[#1b5e20] rounded-2xl p-6 text-center shadow-md">
        <h3 className="text-white font-bold text-lg mb-2">
          {lang === 'bn' ? 'নির্দিষ্ট কোনো প্রশ্ন আছে?' : 'Have a specific question?'}
        </h3>
        <p className="text-green-100 text-sm mb-4">
          {lang === 'bn' ? 'আপনার ফসল বা চাষাবাদ সম্পর্কে এআই-এর সাথে সরাসরি কথা বলুন।' : 'Talk directly to our AI expert about your crops or farming.'}
        </p>
        <Link to="/chat" className="inline-flex items-center gap-2 bg-white text-green-800 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition shadow-sm">
          <MessageSquare size={20} />
          {lang === 'bn' ? 'এআই-কে জিজ্ঞাসা করুন' : 'Ask AI Now'}
        </Link>
      </div>

      {/* Modal for Reading Full Guide */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl relative animate-fade-in">
            <button 
              onClick={() => setSelectedGuide(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <X size={20} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3 mb-4 pr-10">
              <div className="bg-green-100 p-2 rounded-full">
                <BookOpen size={24} className="text-green-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{selectedGuide.title}</h2>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-700 leading-relaxed text-sm">
                {selectedGuide.fullText}
              </p>
            </div>

            <button 
              onClick={() => setSelectedGuide(null)}
              className="w-full mt-6 bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition"
            >
              {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmingGuidePage;