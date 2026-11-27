import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Leaf, Calendar, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const MyCropsPage = () => {
  const { lang, toggleLang } = useLanguage();
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [cropName, setCropName] = useState('');
  const [fieldName, setFieldName] = useState('');
  const [area, setArea] = useState('');
  const [sowingDate, setSowingDate] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get('/records');
      setRecords(response.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    try {
      const newRecord = {
        crop_name: cropName, 
        field_name: fieldName,
        area_decimal: Number(area),
        sowing_date: sowingDate
      };
      await api.post('/records', newRecord);
      setShowForm(false);
      setCropName(''); setFieldName(''); setArea(''); setSowingDate('');
      fetchRecords();
    } catch (error) {
      alert(lang === 'bn' ? 'ফসল যোগ করতে সমস্যা হয়েছে।' : 'Failed to add crop.');
    }
  };

  // NEW: Delete Handler
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(lang === 'bn' ? 'আপনি কি এই রেকর্ডটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this record?');
    if (confirmDelete) {
      try {
        await api.delete(`/records/${id}`);
        setRecords(records.filter(record => record._id !== id));
      } catch (error) {
        alert(lang === 'bn' ? 'মুছে ফেলা সম্ভব হয়নি।' : 'Failed to delete.');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="p-2 border border-gray-300 rounded-lg bg-white"><ArrowLeft size={20} className="text-gray-700" /></Link>
        <h1 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'আমার ফসল' : 'My Crops'}</h1>
        <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white">{lang === 'bn' ? 'বাং | EN' : 'EN | বাং'}</button>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-green-800 transition mb-6">
          <Plus size={20} /> {lang === 'bn' ? 'নতুন ফসল যোগ করুন' : 'Add New Crop'}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleAddCrop} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
          <h3 className="font-bold text-lg mb-4">{lang === 'bn' ? 'নতুন ফসলের তথ্য' : 'New Crop Info'}</h3>
          <div className="space-y-3">
            <input type="text" placeholder={lang === 'bn' ? 'ফসলের নাম (যেমন: ধান)' : 'Crop name (e.g., Rice)'} value={cropName} onChange={e => setCropName(e.target.value)} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-green-700" />
            <input type="text" placeholder={lang === 'bn' ? 'জমির নাম (যেমন: উত্তর মাঠ)' : 'Field name (e.g., North Field)'} value={fieldName} onChange={e => setFieldName(e.target.value)} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-green-700" />
            <input type="number" placeholder={lang === 'bn' ? 'জমির পরিমাণ (শতক)' : 'Area (Decimal)'} value={area} onChange={e => setArea(e.target.value)} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-green-700" />
            <div>
              <label className="block text-sm text-gray-500 mb-1 ml-1">{lang === 'bn' ? 'বপনের তারিখ' : 'Sowing Date'}</label>
              <input type="date" value={sowingDate} onChange={e => setSowingDate(e.target.value)} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-green-700" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="flex-1 bg-green-700 text-white font-bold py-2.5 rounded-xl hover:bg-green-800">{lang === 'bn' ? 'সেভ করুন' : 'Save'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-300">{lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
        ) : records.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
            <Leaf size={48} className="mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">{lang === 'bn' ? 'আপনার কোনো ফসলের রেকর্ড নেই।' : 'You have no crop records.'}</p>
          </div>
        ) : (
          records.map((record) => (
            <div key={record._id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center relative group">
              <div>
                <h3 className="font-bold text-lg text-green-800">{record.crop_name || (lang === 'bn' ? 'অজানা ফসল' : 'Unknown Crop')}</h3>
                <p className="text-sm text-gray-600">{lang === 'bn' ? 'জমি:' : 'Field:'} {record.field_name} ({record.area_decimal} {lang === 'bn' ? 'শতক' : 'Decimal'})</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Calendar size={14} /> {lang === 'bn' ? 'বপন:' : 'Sowing:'} {new Date(record.sowing_date).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB')}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold">
                  {record.status === 'ACTIVE' ? (lang === 'bn' ? 'সক্রিয়' : 'Active') : (lang === 'bn' ? 'সম্পন্ন' : 'Completed')}
                </div>
                
                {/* NEW: Delete Button */}
                <button onClick={() => handleDelete(record._id)} className="text-red-400 hover:text-red-600 p-1 bg-red-50 rounded-md transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyCropsPage;