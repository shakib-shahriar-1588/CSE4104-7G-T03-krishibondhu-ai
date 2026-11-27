import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Image as ImageIcon, Bookmark, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';

const DiseasePage = () => {
  const { lang, toggleLang } = useLanguage();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null); 
    }
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      const response = await api.post('/disease/scan', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      setTimeout(() => {
        setResult({ 
          imageUrl: response.data.image_url, 
          analysis: response.data.ai_analysis 
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      alert(lang === 'bn' ? 'ছবি বিশ্লেষণ করতে সমস্যা হয়েছে।' : 'Error analyzing image.');
      setLoading(false);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="p-2 border border-gray-300 rounded-lg bg-white"><ArrowLeft size={20} className="text-gray-700" /></Link>
        <h1 className="text-xl font-bold text-gray-800">{result ? (lang === 'bn' ? 'ফলাফল' : 'Result') : (lang === 'bn' ? 'রোগ শনাক্ত' : 'Disease Scan')}</h1>
        <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white">বাং | EN</button>
      </div>

      {!result && !loading && (
        <div className="animate-fade-in">
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
          <button onClick={() => fileInputRef.current.click()} className="w-full bg-[#1b5e20] text-white p-6 rounded-3xl mb-4 flex items-center gap-4 shadow-md hover:bg-green-800 transition">
            <div className="bg-white/20 p-3 rounded-full"><Camera size={32} className="text-yellow-300" /></div>
            <div className="text-left"><h2 className="text-2xl font-bold">{lang === 'bn' ? 'ছবি তুলুন' : 'Take Photo'}</h2><p className="text-sm text-gray-200 mt-1">{lang === 'bn' ? 'ক্যামেরা চালু হবে' : 'Camera will open'}</p></div>
          </button>
          <button onClick={() => fileInputRef.current.click()} className="w-full bg-white border border-gray-300 text-gray-800 p-4 rounded-2xl mb-6 flex items-center justify-center gap-2 font-semibold shadow-sm hover:bg-gray-50 transition">
            <ImageIcon size={20} className="text-green-700" /> {lang === 'bn' ? 'গ্যালারি থেকে নিন' : 'Select from Gallery'}
          </button>

          {imagePreview && (
            <div className="mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <img src={imagePreview} alt="Selected" className="w-full h-48 object-cover rounded-xl mb-4" />
              <button onClick={handleScan} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition">{lang === 'bn' ? 'রোগ বিশ্লেষণ শুরু করুন' : 'Start Analysis'}</button>
            </div>
          )}

          <div className="bg-white border border-gray-200 p-5 rounded-2xl mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3">{lang === 'bn' ? 'ভালো ছবির টিপস' : 'Tips for good photos'}</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm">
              <li>{lang === 'bn' ? 'কাছ থেকে তুলুন' : 'Take from close'}</li>
              <li>{lang === 'bn' ? 'পর্যাপ্ত আলো রাখুন' : 'Ensure good lighting'}</li>
              <li>{lang === 'bn' ? 'একটি পাতা ফ্রেমে রাখুন' : 'Keep one leaf in frame'}</li>
            </ul>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mb-4"></div>
          <h3 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'এআই বিশ্লেষণ করছে...' : 'AI is analyzing...'}</h3>
        </div>
      )}

      {result && !loading && (
        <div className="animate-fade-in pb-10">
          <div className="w-full h-56 bg-[#e8f5e9] rounded-2xl mb-4 overflow-hidden">
            {result.imageUrl ? (
              <img src={result.imageUrl} alt="Scanned" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">Image not available</div>
            )}
          </div>
          
          <div className="bg-white border border-gray-200 p-5 rounded-2xl mb-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">{lang === 'bn' ? 'বিস্তারিত পরামর্শ' : 'Detailed Advice'}</h3>
            <div className="text-gray-700 text-sm leading-relaxed prose prose-sm max-w-none prose-headings:text-green-800 prose-strong:text-gray-900">
              <ReactMarkdown>{result.analysis}</ReactMarkdown>
            </div>
          </div>
          
          {/* REMOVED LISTEN BUTTON HERE */}

          <div className="flex gap-3 mb-6">
            <button className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-sm">
              <Bookmark size={18} className="text-green-700" /> {lang === 'bn' ? 'সংরক্ষণ' : 'Save'}
            </button>
            <Link to="/chat" className="flex-1 bg-white border border-gray-300 text-gray-800 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-sm">
              <MessageSquare size={18} className="text-green-700" /> {lang === 'bn' ? 'AI-কে বলুন' : 'Tell AI'}
            </Link>
          </div>
          <button onClick={() => setResult(null)} className="w-full text-center text-gray-500 text-sm underline mt-2">{lang === 'bn' ? 'নতুন ছবি স্ক্যান করুন' : 'Scan new image'}</button>
        </div>
      )}
    </div>
  );
};

export default DiseasePage;