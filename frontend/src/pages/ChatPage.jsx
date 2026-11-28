import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Camera, X, MessageSquare, Plus, Loader2, Menu, Mic, ThumbsUp, ThumbsDown, Flag, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import imageCompression from 'browser-image-compression';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ChatPage = () => {
  const { lang, toggleLang } = useLanguage();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
      const savedSessionId = localStorage.getItem('activeChatSessionId');
      if (savedSessionId) {
        loadChat(savedSessionId);
      } else {
        setMessages([{ sender: 'ai', text: lang === 'bn' ? 'হ্যালো! আমি কৃষিবন্ধু এআই। আপনার ফসলের যেকোনো সমস্যা বা প্রশ্ন আমাকে জানান।' : 'Hello! I am KrishiBondhu AI. Ask me any farming question.' }]);
      }
    } else {
      setMessages([{ sender: 'ai', text: lang === 'bn' ? 'হ্যালো! আমি কৃষিবন্ধু এআই। আপনার ফসলের যেকোনো সমস্যা বা প্রশ্ন আমাকে জানান।' : 'Hello! I am KrishiBondhu AI. Ask me any farming question.' }]);
    }
  }, [user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert(lang === 'bn' ? 'আপনার ব্রাউজার ভয়েস ইনপুট সাপোর্ট করে না।' : 'Browser not supported');
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = lang === 'bn' ? 'bn-BD' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.start();
  };

  const fetchSessions = async () => {
    try { const res = await api.get('/chat/sessions'); setSessions(res.data); } catch (error) { console.error(error); }
  };

  const loadChat = async (sessionId) => {
    setCurrentSessionId(sessionId);
    localStorage.setItem('activeChatSessionId', sessionId);
    setIsSidebarOpen(false);
    setLoading(true);
    try {
      const res = await api.get(`/chat/session/${sessionId}`);
      const formattedMessages = res.data.map(msg => ({
        _id: msg._id, // Store ID for feedback
        sender: msg.sender === 'USER' ? 'user' : 'ai',
        text: msg.content,
        image: msg.image_url
      }));
      setMessages(formattedMessages);
    } catch (error) { 
      console.error(error); 
      localStorage.removeItem('activeChatSessionId');
      setCurrentSessionId(null);
      startNewChat();
    } finally { setLoading(false); }
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    localStorage.removeItem('activeChatSessionId');
    setIsSidebarOpen(false);
    setMessages([{ sender: 'ai', text: lang === 'bn' ? 'নতুন চ্যাট শুরু হয়েছে।' : 'New chat started.' }]);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1024, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        setSelectedImage(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
      } finally {
        setLoading(false);
      }
    }
  };

  // NEW: Handle feedback submission
  const handleFeedback = async (messageId, rating, isFlagged) => {
    if (!messageId) {
      return alert(lang === 'bn' ? "অনুগ্রহ করে একটু অপেক্ষা করুন..." : "Please wait a moment for the message to save...");
    }
    
    // Optional: Ask for a comment if flagging
    let comment = "";
    if (isFlagged) {
      comment = prompt(lang === 'bn' ? "কেন আপনি এটি ফ্ল্যাগ করছেন? (ঐচ্ছিক)" : "Why are you flagging this? (Optional)") || "User flagged this response.";
    }

    try {
      await api.post('/feedback', {
        message_id: messageId,
        rating: rating,
        is_flagged: isFlagged,
        comment: comment
      });
      
      alert(isFlagged 
        ? (lang === 'bn' ? "রেসপন্সটি অ্যাডমিনের কাছে ফ্ল্যাগ করা হয়েছে।" : "Response flagged for Admin review.") 
        : (lang === 'bn' ? "মতামতের জন্য ধন্যবাদ!" : "Thank you for your feedback!"));
    } catch (error) {
      console.error(error);
      alert(lang === 'bn' ? "মতামত জানাতে সমস্যা হয়েছে।" : "Failed to submit feedback.");
    }
  };

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() && !selectedImage) return;

    let displayText = messageText;
    let dbText = messageText;

    if (selectedImage && !messageText.trim()) {
      displayText = lang === 'bn' ? "[ছবি আপলোড করা হয়েছে]" : "[Image uploaded]";
      dbText = lang === 'bn' ? "ছবি বিশ্লেষণ করুন" : "Analyze image";
    }

    const newMessages = [...messages, { sender: 'user', text: displayText, image: imagePreview }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    let activeSessionId = currentSessionId;

    try {
      if (!activeSessionId && user) {
        const title = dbText.substring(0, 30) + (dbText.length > 30 ? '...' : '');
        const sessionRes = await api.post('/chat/session', { title });
        activeSessionId = sessionRes.data._id;
        setCurrentSessionId(activeSessionId);
        localStorage.setItem('activeChatSessionId', activeSessionId);
      }

      let aiReply = '';
      let savedImageUrl = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);
        const response = await api.post('/disease/scan', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        aiReply = response.data.ai_analysis;
        savedImageUrl = response.data.image_url;
      } else {
        const chatHistory = messages.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
        const response = await api.post('/ai/chat', { message: messageText, history: chatHistory });
        aiReply = response.data.reply;
      }

      // Save USER message
      if (activeSessionId && user) {
        await api.post('/chat/message', { 
          session_id: activeSessionId, sender: 'USER', content: dbText, image_url: savedImageUrl
        });
      }

      // Update UI with AI Reply (Temporarily without ID)
      setMessages((prev) => {
        const updated = [...prev];
        if (savedImageUrl) updated[updated.length - 1].image = savedImageUrl;
        updated.push({ sender: 'ai', text: aiReply }); 
        return updated;
      });

      // Save AI message to DB and get the ID
      if (activeSessionId && user) {
        const savedAiMsg = await api.post('/chat/message', { session_id: activeSessionId, sender: 'AI', content: aiReply });
        
        // Attach the DB ID to the message in UI so feedback buttons work
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1]._id = savedAiMsg.data._id; 
          return updated;
        });
        
        fetchSessions(); 
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'ai', text: lang === 'bn' ? 'দুঃখিত, একটি সমস্যা হয়েছে।' : 'Sorry, an error occurred.' }]);
    } finally {
      setLoading(false);
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const groupSessions = () => {
    const today = [], yesterday = [], older = [];
    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayDate = todayDate - (24 * 60 * 60 * 1000);
    sessions.forEach(session => {
      const date = new Date(session.updated_at || session.created_at).getTime();
      if (date >= todayDate) today.push(session);
      else if (date >= yesterdayDate) yesterday.push(session);
      else older.push(session);
    });
    return { today, yesterday, older };
  };

  const { today, yesterday, older } = groupSessions();

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-140px)] bg-[#fcfdfa] rounded-xl overflow-hidden relative border border-gray-200 shadow-sm">
      
      {/* SIDEBAR */}
      {user && (
        <div className={`absolute md:relative z-40 h-full bg-white border-r border-gray-200 flex flex-col w-64 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <button onClick={startNewChat} className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-xl font-bold hover:bg-green-100 transition mr-2">
              <Plus size={18} /> নতুন চ্যাট
            </button>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {today.length > 0 && (<div><p className="text-xs font-bold text-gray-400 mb-2 px-2 uppercase">আজ (Today)</p>{today.map(chat => (<button key={chat._id} onClick={() => loadChat(chat._id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 truncate ${currentSessionId === chat._id ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MessageSquare size={14} className="shrink-0" /> <span className="truncate">{chat.title}</span></button>))}</div>)}
            {yesterday.length > 0 && (<div><p className="text-xs font-bold text-gray-400 mb-2 px-2 uppercase">গতকাল (Yesterday)</p>{yesterday.map(chat => (<button key={chat._id} onClick={() => loadChat(chat._id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 truncate ${currentSessionId === chat._id ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MessageSquare size={14} className="shrink-0" /> <span className="truncate">{chat.title}</span></button>))}</div>)}
            {older.length > 0 && (<div><p className="text-xs font-bold text-gray-400 mb-2 px-2 uppercase">সাম্প্রতিক (Recent)</p>{older.map(chat => (<button key={chat._id} onClick={() => loadChat(chat._id)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 truncate ${currentSessionId === chat._id ? 'bg-green-100 text-green-800 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}><MessageSquare size={14} className="shrink-0" /> <span className="truncate">{chat.title}</span></button>))}</div>)}
          </div>
        </div>
      )}

      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="md:hidden fixed inset-0 bg-black/40 z-30"></div>
      )}

      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col h-full relative z-10 bg-[#fcfdfa]">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <Link to="/" className="md:hidden p-2 border border-gray-300 rounded-lg"><ArrowLeft size={20} className="text-gray-700" /></Link>
            {user && (
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-800 hidden md:block">AI সহায়ক</h1>
            <h1 className="text-lg font-bold text-gray-800 md:hidden">AI সহায়ক</h1>
          </div>
          <button onClick={toggleLang} className="border border-gray-300 px-3 py-1 rounded-lg text-sm font-semibold">{lang === 'bn' ? 'বাং | EN' : 'EN | বাং'}</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 md:pb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-[#1b5e20] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'}`}>
                {msg.image && <img src={msg.image} alt="Uploaded" className="w-full rounded-lg mb-2 max-h-48 object-cover" />}
                
                <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${msg.sender === 'user' ? 'prose-invert text-white' : 'text-gray-800'}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {/* FEEDBACK BUTTONS FOR AI MESSAGES */}
                {msg.sender === 'ai' && msg.text && msg.text !== "[ছবি আপলোড করা হয়েছে]" && (
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                    <button onClick={() => handleFeedback(msg._id, 'HELPFUL', false)} className="text-gray-400 hover:text-green-600 text-xs flex items-center gap-1 font-semibold transition">
                      <ThumbsUp size={14}/> Helpful
                    </button>
                    <button onClick={() => handleFeedback(msg._id, 'NOT_HELPFUL', false)} className="text-gray-400 hover:text-red-600 text-xs flex items-center gap-1 font-semibold transition">
                      <ThumbsDown size={14}/> Not Helpful
                    </button>
                    <button onClick={() => handleFeedback(msg._id, 'NOT_HELPFUL', true)} className="text-gray-400 hover:text-yellow-600 text-xs flex items-center gap-1 font-semibold transition">
                      <Flag size={14}/> Flag
                    </button>
                    <button className="text-gray-400 hover:text-blue-600 text-xs flex items-center gap-1 font-semibold transition">
                      <Bookmark size={14}/> Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-green-700 text-sm">
                <Loader2 size={16} className="animate-spin" /> এআই ভাবছে...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-3 md:p-4 pb-20 md:pb-4 flex flex-col gap-2 relative z-10">
          {imagePreview && (
            <div className="relative w-20 h-20 mb-2">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg border border-gray-300 shadow-sm" />
              <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"><X size={14} /></button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-gray-200 transition"><Camera size={20} /></button>
            <button onClick={handleVoiceInput} className={`p-3 rounded-xl transition ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><Mic size={20} /></button>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={isListening ? (lang === 'bn' ? 'শুনছি...' : 'Listening...') : (lang === 'bn' ? 'এখানে লিখুন...' : 'Type here...')} className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-700" />
            <button onClick={() => handleSend()} disabled={loading || (!input.trim() && !selectedImage)} className="bg-green-700 text-white p-3 rounded-xl shadow-md disabled:bg-gray-400 transition"><Send size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;