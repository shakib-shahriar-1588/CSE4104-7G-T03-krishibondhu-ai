import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', phone: '', district: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register', formData);
      login(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'রেজিস্ট্রেশন করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-4 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-6"><Leaf size={48} className="text-green-700" /></div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">নতুন অ্যাকাউন্ট খুলুন</h2>
        {error && <p className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-3">
          <input type="text" name="full_name" placeholder="পুরো নাম" onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-green-700 outline-none" />
          <input type="email" name="email" placeholder="ইমেইল" onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-green-700 outline-none" />
          <input type="password" name="password" placeholder="পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)" minLength={6} onChange={handleChange} required className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-green-700 outline-none" />
          <input type="text" name="phone" placeholder="ফোন নম্বর" onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-green-700 outline-none" />
          <input type="text" name="district" placeholder="জেলা" onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:border-green-700 outline-none" />
          <button type="submit" disabled={loading} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition disabled:bg-gray-400 mt-2">
            {loading ? 'অপেক্ষা করুন...' : 'রেজিস্টার করুন'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          অ্যাকাউন্ট আছে? <Link to="/login" className="text-green-700 font-bold hover:underline">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;