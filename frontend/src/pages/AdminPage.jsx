import { useState, useEffect } from 'react';
import { Users, Activity, ShieldAlert, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';

const AdminPage = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this from the backend
    // For now, we simulate with mock data
    setUsers([
      { _id: '1', full_name: 'Shakib Shahriar', email: 'shskib098@gmail.com', role: 'ADMIN', status: 'ACTIVE' },
      { _id: '2', full_name: 'Karim Ahmed', email: 'karim@test.com', role: 'FARMER', status: 'ACTIVE' },
      { _id: '3', full_name: 'Rahim Uddin', email: 'rahim@test.com', role: 'FARMER', status: 'SUSPENDED' },
    ]);
    setLogs([
      { _id: '1', action: 'LOGIN_SUCCESS', user: 'shakib@test.com', ip: '192.168.1.1', time: '10 mins ago' },
      { _id: '2', action: 'USER_REGISTERED', user: 'karim@test.com', ip: '103.143.1.21', time: '1 hour ago' },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</h1>
        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
          <ShieldAlert size={16} /> Admin Access
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition ${activeTab === 'users' ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Users size={18} /> {lang === 'bn' ? 'ইউজার ম্যানেজমেন্ট' : 'Users'}
        </button>
        <button onClick={() => setActiveTab('logs')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition ${activeTab === 'logs' ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Activity size={18} /> {lang === 'bn' ? 'অ্যাক্টিভিটি লগ' : 'Activity Logs'}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : activeTab === 'users' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{u.full_name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{u.role}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                  </td>
                  <td className="p-4">
                    <button className="text-blue-600 text-sm font-semibold hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-4">
          {logs.map(log => (
            <div key={log._id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><FileText size={16} /></div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{log.action}</p>
                  <p className="text-xs text-gray-500">User: {log.user} | IP: {log.ip}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400">{log.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;