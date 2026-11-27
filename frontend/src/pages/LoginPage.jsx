import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'লগইন করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-6"><Leaf size={48} className="text-green-700" /></div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">লগইন করুন</h2>
        {error && <p className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-700" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-700" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition disabled:bg-gray-400">
            {loading ? 'অপেক্ষা করুন...' : 'লগইন করুন'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          অ্যাকাউন্ট নেই? <Link to="/register" className="text-green-700 font-bold hover:underline">রেজিস্টার করুন</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;