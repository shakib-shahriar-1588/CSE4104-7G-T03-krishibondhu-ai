import { useState } from 'react';
import { ArrowLeft, Sprout, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';

const CropRecPage = () => {
  const { lang, toggleLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [form, setForm] = useState({ district: 'খুলনা', season: 'শীতকাল', soil: 'দোআঁশ' });

  const handleAsk = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const prompt = `Act as an agricultural expert. The farmer lives in ${form.district}, Bangladesh. The season is ${form.season} and the soil is ${form.soil}. Suggest 3 suitable crops to grow. Reply in ${lang === 'bn' ? 'Bangla' : 'English'}. Do not use greetings.`;
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
        <h1 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'ফসল নির্দেশনা' : 'Crop Recommendation'}</h1>
        <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white">বাং | EN</button>
      </div>

      <form onSubmit={handleAsk} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6 space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">জেলা (District)</label>
          <input type="text" value={form.district} onChange={e => setForm({...form, district: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 mt-1 outline-none focus:border-green-700" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">মৌসুম (Season)</label>
            <input type="text" value={form.season} onChange={e => setForm({...form, season: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 mt-1 outline-none focus:border-green-700" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">মাটি (Soil)</label>
            <input type="text" value={form.soil} onChange={e => setForm({...form, soil: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 mt-1 outline-none focus:border-green-700" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-800 transition disabled:bg-gray-400">
          {loading ? 'খোঁজা হচ্ছে...' : <><Sparkles size={18}/> ফসল খুঁজুন (Find Crops)</>}
        </button>
      </form>

      {result && (
        <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2"><Sprout size={18} className="text-green-700"/> উপযুক্ত ফসল</h3>
          <div className="text-sm text-gray-700 prose prose-sm max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};
export default CropRecPage;