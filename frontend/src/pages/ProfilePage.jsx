import { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, LogOut, Edit2, Save, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';

const ProfilePage = () => {
  const { lang, toggleLang } = useLanguage();
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    district: user?.district || '',
    upazila: user?.upazila || ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.put('/auth/profile', formData);
      updateProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;
  const initial = user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="p-2 border border-gray-300 rounded-lg bg-white"><ArrowLeft size={20} className="text-gray-700" /></Link>
        <h1 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'প্রোফাইল' : 'Profile'}</h1>
        <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white">{lang === 'bn' ? 'বাং | EN' : 'EN | বাং'}</button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{error}</div>}

      <div className="animate-fade-in">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-6 relative">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition z-10"><Edit2 size={18} /></button>
          )}

          <div className="h-32 bg-gradient-to-r from-green-700 to-green-500 relative">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-white">
                <span className="text-4xl font-bold text-green-700">{initial}</span>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-6 px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">{user.full_name}</h2>
            <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1"><Shield size={14} className="text-green-600" /> {user.role === 'FARMER' ? (lang === 'bn' ? 'কৃষক' : 'Farmer') : user.role}</p>
          </div>

          <div className="border-t border-gray-100 px-6 py-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="bg-gray-50 p-3 rounded-full"><Mail size={20} className="text-gray-600" /></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase">{lang === 'bn' ? 'ইমেইল' : 'Email'}</p>
                <p className="text-gray-800 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gray-50 p-3 rounded-full"><User size={20} className="text-gray-600" /></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase">{lang === 'bn' ? 'পুরো নাম' : 'Full Name'}</p>
                {isEditing ? <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-1.5 mt-1 focus:outline-none focus:border-green-700" /> : <p className="text-gray-800 font-medium">{user.full_name}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gray-50 p-3 rounded-full"><Phone size={20} className="text-gray-600" /></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase">{lang === 'bn' ? 'ফোন' : 'Phone'}</p>
                {isEditing ? <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX" className="w-full border border-gray-300 rounded-lg px-3 py-1.5 mt-1 focus:outline-none focus:border-green-700" /> : <p className="text-gray-800 font-medium">{user.phone || (lang === 'bn' ? 'প্রদান করা হয়নি' : 'Not provided')}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-gray-50 p-3 rounded-full"><MapPin size={20} className="text-gray-600" /></div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase">{lang === 'bn' ? 'জেলা' : 'District'}</p>
                {isEditing ? <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="e.g. Khulna" className="w-full border border-gray-300 rounded-lg px-3 py-1.5 mt-1 focus:outline-none focus:border-green-700" /> : <p className="text-gray-800 font-medium">{user.district || (lang === 'bn' ? 'প্রদান করা হয়নি' : 'Not provided')}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {isEditing ? (
            <div className="flex gap-3">
              <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-300 transition"><X size={20} /> {lang === 'bn' ? 'বাতিল' : 'Cancel'}</button>
              <button onClick={handleSave} disabled={loading} className="flex-1 bg-green-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-800 transition disabled:bg-gray-400"><Save size={20} /> {loading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          ) : (
            <button onClick={() => { logout(); navigate('/login'); }} className="w-full bg-red-50 text-red-600 font-bold py-3.5 rounded-xl border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition"><LogOut size={20} /> {lang === 'bn' ? 'লগআউট করুন' : 'Logout'}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;