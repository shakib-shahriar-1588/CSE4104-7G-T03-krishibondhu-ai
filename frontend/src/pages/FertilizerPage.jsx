import { useState } from 'react';
import { ArrowLeft, FlaskConical, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';

const FertilizerPage = () => {
  const { lang, toggleLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [form, setForm] = useState({ crop: 'ধান', soil: 'দোআঁশ', stage: 'বীজতলা', area: '১' });

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prompt = `Act as an agricultural expert. The farmer is growing ${form.crop} in ${form.soil} soil. The growth stage is ${form.stage} and the area is ${form.area} decimal. Provide a short fertilizer recommendation (type, quantity, timing). Reply in ${lang === 'bn' ? 'Bangla' : 'English'}. Do not use greetings.`;
      const response = await api.post('/ai/chat', { message: prompt });
      setResult(response.data.reply);
    } catch (error) {
      alert('Error getting advice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="p-2 border border-gray-300 rounded-lg bg-white"><ArrowLeft size={20} className="text-gray-700" /></Link>
        <h1 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'সার পরামর্শ' : 'Fertilizer Advice'}</h1>
        <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white">বাং | EN</button>
      </div>

      <form onSubmit={handleAsk} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">ফসল (Crop)</label>
            <input type="text" value={form.crop} onChange={e => setForm({...form, crop: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 mt-1 outline-none focus:border-green-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">মাটি (Soil)</label>
            <input type="text" value={form.soil} onChange={e => setForm({...form, soil: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 mt-1 outline-none focus:border-green-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">ধাপ (Stage)</label>
            <input type="text" value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 mt-1 outline-none focus:border-green-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">পরিমাণ (Area)</label>
            <input type="text" value={form.area} onChange={e => setForm({...form, area: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 mt-1 outline-none focus:border-green-700" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-800 transition disabled:bg-gray-400">
          {loading ? 'বিশ্লেষণ হচ্ছে...' : <><Sparkles size={18}/> পরামর্শ নিন (Get Advice)</>}
        </button>
      </form>

      {result && (
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2"><FlaskConical size={18} className="text-green-700"/> AI পরামর্শ</h3>
          <div className="text-sm text-gray-700 prose prose-sm max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
export default FertilizerPage;