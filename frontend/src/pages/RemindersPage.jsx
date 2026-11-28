import { useState } from 'react';
import { ArrowLeft, Bell, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const RemindersPage = () => {
  const { lang, toggleLang } = useLanguage();
  const [reminders, setReminders] = useState([
    { id: 1, title: 'সেচ দেওয়া', date: '2026-12-01', done: false },
    { id: 2, title: 'ইউরিয়া সার প্রয়োগ', date: '2026-12-05', done: false },
  ]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const addReminder = (e) => {
    e.preventDefault();
    if (!title || !date) return;
    setReminders([...reminders, { id: Date.now(), title, date, done: false }]);
    setTitle(''); setDate('');
  };

  const deleteReminder = (id) => setReminders(reminders.filter(r => r.id !== id));
  const toggleDone = (id) => setReminders(reminders.map(r => r.id === id ? { ...r, done: !r.done } : r));

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="p-2 border border-gray-300 rounded-lg bg-white"><ArrowLeft size={20} className="text-gray-700" /></Link>
        <h1 className="text-xl font-bold text-gray-800">{lang === 'bn' ? 'রিমাইন্ডার' : 'Reminders'}</h1>
        <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold text-gray-700 bg-white">বাং | EN</button>
      </div>

      <form onSubmit={addReminder} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 mb-6 flex gap-2 flex-col sm:flex-row">
        <input type="text" placeholder="কাজের নাম (e.g. সেচ)" value={title} onChange={e => setTitle(e.target.value)} required className="flex-1 border border-gray-300 rounded-lg p-2 outline-none focus:border-green-700" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="border border-gray-300 rounded-lg p-2 outline-none focus:border-green-700" />
        <button type="submit" className="bg-green-700 text-white p-2 rounded-lg hover:bg-green-800"><Plus size={20}/></button>
      </form>

      <div className="space-y-3">
        {reminders.map(r => (
          <div key={r.id} className={`bg-white p-4 rounded-2xl shadow-sm border flex justify-between items-center ${r.done ? 'border-gray-200 opacity-60' : 'border-green-200'}`}>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={r.done} onChange={() => toggleDone(r.id)} className="w-5 h-5 accent-green-700" />
              <div>
                <p className={`font-bold text-gray-800 ${r.done ? 'line-through' : ''}`}>{r.title}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><Bell size={12}/> {r.date}</p>
              </div>
            </div>
            <button onClick={() => deleteReminder(r.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={18}/></button>
          </div>
        ))}
        {reminders.length === 0 && <p className="text-center text-gray-500 py-10">কোনো রিমাইন্ডার নেই।</p>}
      </div>
    </div>
  );
};
export default RemindersPage;