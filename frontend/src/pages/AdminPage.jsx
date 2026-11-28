import { useState, useEffect } from 'react';
import { Users, ShieldAlert, FileText, CheckCircle, XCircle, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/axios';

const AdminPage = () => {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For submitting advisor notes
  const [activeFeedbackId, setActiveFeedbackId] = useState(null);
  const [advisorNote, setAdvisorNote] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'feedback') {
        const res = await api.get('/admin/feedback');
        setFeedbacks(res.data);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to fetch data. Are you an Admin?');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await api.put(`/admin/users/${id}/status`);
      fetchData(); // Refresh list
    } catch (error) {
      alert('Failed to change status');
    }
  };

  const handleReviewFeedback = async (id) => {
    if (!advisorNote) return alert('Please write a note before reviewing.');
    try {
      await api.put(`/admin/feedback/${id}`, { advisor_note: advisorNote });
      setActiveFeedbackId(null);
      setAdvisorNote('');
      fetchData(); // Refresh list
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</h1>
        <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
          <ShieldAlert size={16} /> Admin Access
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('users')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold whitespace-nowrap transition ${activeTab === 'users' ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Users size={18} /> {lang === 'bn' ? 'ইউজার ম্যানেজমেন্ট' : 'Users'}
        </button>
        <button onClick={() => setActiveTab('feedback')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold whitespace-nowrap transition ${activeTab === 'feedback' ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
          <FileText size={18} /> {lang === 'bn' ? 'ফ্ল্যাগড এআই রেসপন্স' : 'Flagged AI'}
        </button>
        <button onClick={() => setActiveTab('logs')} className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold whitespace-nowrap transition ${activeTab === 'logs' ? 'bg-green-700 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
          <Search size={18} /> {lang === 'bn' ? 'অ্যাক্টিভিটি লগ' : 'Logs'}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin"></div></div>
      ) : activeTab === 'users' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Name</th>
                <th className="p-4 font-semibold text-gray-600">Email</th>
                <th className="p-4 font-semibold text-gray-600">Role</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{u.full_name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{u.role}</span></td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${u.account_status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.account_status}</span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleToggleStatus(u._id)} 
                      className={`text-xs font-bold px-3 py-1 rounded-lg ${u.account_status === 'ACTIVE' ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}
                    >
                      {u.account_status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === 'feedback' ? (
        <div className="space-y-4">
          {feedbacks.length === 0 && <p className="text-center text-gray-500 py-10">No flagged feedback found.</p>}
          {feedbacks.map(fb => (
            <div key={fb._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-gray-500 font-bold mb-1">USER: {fb.user_id?.full_name} ({fb.user_id?.email})</p>
                  <p className="text-sm font-semibold text-red-600 bg-red-50 p-2 rounded-lg">Issue: {fb.comment}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${fb.review_status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                  {fb.review_status}
                </span>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-4 text-sm text-gray-700 italic border-l-4 border-gray-300">
                "{fb.message_id?.content}"
              </div>

              {fb.review_status === 'PENDING' ? (
                activeFeedbackId === fb._id ? (
                  <div className="flex flex-col gap-2">
                    <textarea value={advisorNote} onChange={e => setAdvisorNote(e.target.value)} placeholder="Write advisor note/correction here..." className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-green-700"></textarea>
                    <div className="flex gap-2">
                      <button onClick={() => handleReviewFeedback(fb._id)} className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Submit Note</button>
                      <button onClick={() => setActiveFeedbackId(null)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setActiveFeedbackId(fb._id)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-100">Add Advisor Note</button>
                )
              ) : (
                <div className="bg-green-50 p-4 rounded-xl text-sm text-green-800">
                  <strong className="block mb-1">Advisor Note:</strong>
                  {fb.advisor_note}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-4">
          <p className="text-sm text-gray-500">Note: Activity logs are currently mocked. You can connect them to the ActivityLog model in the future.</p>
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
             <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600"><FileText size={16} /></div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">AI_CHAT_FLAGGED</p>
                  <p className="text-xs text-gray-500">A user flagged an AI response for review.</p>
                </div>
             </div>
             <p className="text-xs text-gray-400">Just now</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;