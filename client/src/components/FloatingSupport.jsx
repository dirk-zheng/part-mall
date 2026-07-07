import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, User, Sparkles, Clock, ShoppingBag, Truck, RefreshCw,
  CreditCard, X, MessageCircle, ArrowLeft, Users, UserPlus, MessageSquare
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { supportAPI, imAPI, wsClient } from '../api';

// ─── Quick Questions for AI Tab ──────────────────
const quickQuestions = [
  { icon: ShoppingBag, text: 'Pricing', message: 'What promotions do you have?' },
  { icon: Truck, text: 'Shipping', message: 'How long does shipping take?' },
  { icon: RefreshCw, text: 'Returns', message: 'What is the return policy?' },
  { icon: CreditCard, text: 'Payment', message: 'What payment methods are accepted?' },
];

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ─── AI Chat View ────────────────────────────────
function AIChatView({ state, dispatch, onClose }) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const welcomeSent = useRef(false);
  useEffect(() => {
    if (state.chatHistory.length === 0 && !welcomeSent.current) {
      welcomeSent.current = true;
      setTimeout(() => {
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: 'welcome',
            sender: 'ai',
            content: 'Hello! Welcome to DriveLine International. I am your dedicated support assistant. How can I help you today?',
            timestamp: new Date()
          }
        });
      }, 500);
    }
  }, [state.chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatHistory]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    setInputValue('');
    setIsTyping(true);
    try {
      const data = await supportAPI.chat(inputValue.trim());
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: data.aiReply,
          timestamp: new Date()
        }
      });
    } catch {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: 'Sorry, our support system is temporarily unavailable. Please try again later.',
          timestamp: new Date()
        }
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (message) => {
    setInputValue(message);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-blue-50/30">
        {state.chatHistory.map((msg, index) => (
          <div key={msg.id} className={`flex gap-3 animate-slide-up ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}>
            {msg.sender === 'user' ? (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-accent to-primary">
                <User size={16} className="text-white" />
              </div>
            ) : (
              <div className="flex-shrink-0 relative w-8 h-8">
                <img src="/bot-avatar.png" alt="Miss Lin"
                  className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-primary/20" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
            )}
            <div className={`max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block px-3 py-2 rounded-xl ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/20'
                  : 'bg-white border border-dark-200 rounded-tl-sm shadow-sm'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              <div className={`flex items-center gap-1 mt-1 text-xs text-dark-400 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                <Clock size={10} />{formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3 animate-slide-up">
            <div className="flex-shrink-0 relative w-8 h-8">
              <img src="/bot-avatar.png" alt="Miss Lin"
                className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-primary/20" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="bg-white border border-dark-200 px-3 py-2 rounded-xl rounded-tl-sm shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-3 py-2 border-t border-dark-100 bg-dark-50/50">
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, i) => {
            const Icon = q.icon;
            return (
              <button key={i} onClick={() => handleQuickQuestion(q.message)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg text-xs text-dark-600 hover:bg-primary/5 hover:text-primary border border-dark-200 transition-colors">
                <Icon size={12} />{q.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-dark-200">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input ref={inputRef} type="text" value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="w-full px-3 py-2.5 pr-10 rounded-xl bg-white border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm" />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50" size={14} />
          </div>
          <button onClick={handleSend} disabled={!inputValue.trim()}
            className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 btn-glow flex items-center gap-2">
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

// ─── IM Chat View ────────────────────────────────
function IMChatView({ room, messages: initialMessages, onBack }) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(initialMessages || []);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Listen for real-time incoming messages
  useEffect(() => {
    const unsub = wsClient.on('im.message', (data) => {
      if (data.roomId === room.roomId) {
        setMessages(prev => [...prev, data]);
      }
    });
    return unsub;
  }, [room.roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;
    const content = inputValue.trim();
    setInputValue('');
    setSending(true);
    try {
      await imAPI.sendMessage(content, room.roomId);
    } catch (err) {
      // Failed to send, add error indicator
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        roomId: room.roomId,
        senderId: user.id,
        senderName: user.name,
        content,
        timestamp: new Date().toISOString(),
        failed: true
      }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-blue-50/30">
        {messages.length === 0 && (
          <div className="text-center py-12 text-dark-400">
            <MessageSquare size={32} className="mx-auto mb-2 text-dark-300" />
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium text-white ${
                isMe ? 'bg-accent' : 'bg-primary'
              }`}>
                {(msg.senderName || '?')[0].toUpperCase()}
              </div>
              <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                {!isMe && <p className="text-xs text-dark-500 mb-0.5 ml-1">{msg.senderName}</p>}
                <div className={`inline-block px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                  isMe
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-white border border-dark-200 rounded-tl-sm shadow-sm'
                } ${msg.failed ? 'opacity-50' : ''}`}>
                  {msg.content}
                  {msg.failed && <span className="text-red-400 text-xs ml-2">Failed</span>}
                </div>
                <div className={`flex items-center gap-1 mt-0.5 text-xs text-dark-400 ${isMe ? 'justify-end' : ''}`}>
                  <Clock size={10} />{formatTime(msg.timestamp)}
                  {isMe && !msg.failed && (
                    <svg className="w-3 h-3 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-dark-200">
        <div className="flex gap-2">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown} disabled={sending}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2.5 rounded-xl bg-white border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm" />
          <button onClick={handleSend} disabled={!inputValue.trim() || sending}
            className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20">
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Sales Picker ────────────────────────────────
function SalesPicker({ onSelect, onBack }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    imAPI.getSales()
      .then(data => setSales(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-heading font-bold text-dark-900 mb-4 flex items-center gap-2">
          <Users size={18} className="text-primary" />
          Select a Sales Representative
        </h3>
        {loading && <p className="text-dark-400 text-sm text-center py-8">Loading...</p>}
        {error && <p className="text-red-500 text-sm text-center py-8">{error}</p>}
        {!loading && sales.length === 0 && (
          <p className="text-dark-400 text-sm text-center py-8">No sales staff online right now.</p>
        )}
        <div className="space-y-2">
          {sales.map(s => (
            <button key={s.id} onClick={() => onSelect(s)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/5 border border-dark-100 hover:border-primary/30 transition-colors text-left">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                {(s.name || s.username)[0].toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-dark-900 text-sm">{s.name || s.username}</p>
                <p className="text-xs text-dark-400">Sales Representative</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Room List ───────────────────────────────────
function RoomList({ onSelectRoom, onNewChat }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const loadRooms = useCallback(async () => {
    try {
      const data = await imAPI.getRooms();
      setRooms(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  // Refresh rooms when a new message arrives
  useEffect(() => {
    const unsub = wsClient.on('im.message', () => {
      loadRooms();
    });
    return unsub;
  }, [loadRooms]);

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-100">
          <h3 className="font-heading font-bold text-dark-900 flex items-center gap-2">
            <MessageCircle size={18} className="text-primary" />
            Messages
          </h3>
          {user?.role !== 'admin' && (
            <button onClick={onNewChat}
              className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">
              <UserPlus size={14} />New
            </button>
          )}
        </div>

        {loading && <p className="text-dark-400 text-sm text-center py-12">Loading...</p>}
        {error && <p className="text-red-500 text-sm text-center py-8">{error}</p>}
        {!loading && rooms.length === 0 && (
          <div className="text-center py-12 px-4">
            <MessageSquare size={32} className="mx-auto mb-3 text-dark-300" />
            <p className="text-dark-500 text-sm mb-3">No conversations yet</p>
            {user?.role !== 'admin' && (
              <button onClick={onNewChat}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                <UserPlus size={16} />Contact Sales
              </button>
            )}
          </div>
        )}
        {!loading && rooms.map(room => (
          <button key={room.roomId} onClick={() => onSelectRoom(room)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 border-b border-dark-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(room.otherUser?.name || '?')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-dark-900 text-sm truncate">
                  {room.otherUser?.name || room.otherUser?.username || 'Unknown'}
                </p>
                <span className="text-xs text-dark-400 flex-shrink-0 ml-2">
                  {formatTime(room.updatedAt)}
                </span>
              </div>
              <p className="text-xs text-dark-400 truncate mt-0.5">
                {room.otherUser?.role === 'admin' ? 'Sales Representative' : 'Customer'}
              </p>
              <p className="text-xs text-dark-400 truncate mt-0.5">{room.lastMessage || 'Start a conversation'}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

// ─── Main Component ──────────────────────────────
export default function FloatingSupport({ isOpen, onClose }) {
  const { state, dispatch } = useStore();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'im'
  const [imView, setImView] = useState('rooms');   // 'rooms' | 'chat' | 'sales'
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Reset view when panel opens
  useEffect(() => {
    if (isOpen) {
      setImView('rooms');
      setSelectedRoom(null);
    }
  }, [isOpen]);

  const handleSelectRoom = async (room) => {
    setSelectedRoom(room);
    setImView('chat');
    setLoadingMessages(true);
    try {
      const msgs = await imAPI.getMessages(room.roomId);
      setChatMessages(msgs);
    } catch {
      setChatMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSelectSales = async (salesUser) => {
    // Create a new room or navigate to it
    try {
      // Send a greeting message to create the room
      await imAPI.sendMessage('Hi, I need some help!', '', salesUser.id);
      setImView('rooms');
    } catch (err) {
      alert('Failed to start conversation: ' + err.message);
    }
  };

  const handleBackToRooms = () => {
    setImView('rooms');
    setSelectedRoom(null);
    setChatMessages([]);
  };

  // Get header content based on view
  const getHeaderContent = () => {
    if (activeTab === 'im' && imView === 'chat' && selectedRoom) {
      return (
        <>
          <button onClick={handleBackToRooms} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
              {(selectedRoom.otherUser?.name || '?')[0].toUpperCase()}
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-sm">{selectedRoom.otherUser?.name || 'Unknown'}</h3>
              <p className="text-xs text-white/80">Online</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X size={18} className="text-white" />
          </button>
        </>
      );
    }

    if (activeTab === 'im' && imView === 'sales') {
      return (
        <>
          <button onClick={() => setImView('rooms')} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <ArrowLeft size={18} className="text-white" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-sm">New Conversation</h3>
              <p className="text-xs text-white/80">Choose a sales rep</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
            <X size={18} className="text-white" />
          </button>
        </>
      );
    }

    // Default header with tabs
    return (
      <>
        <div className="flex items-center gap-3">
          {activeTab === 'ai' ? (
            <div className="relative w-10 h-10">
              <img src="/bot-avatar.png" alt="Miss Lin"
                className="w-10 h-10 rounded-xl object-cover" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-white" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircle size={22} className="text-white" />
            </div>
          )}
          <div>
            <h3 className="font-heading font-bold text-white">
              {activeTab === 'ai' ? 'Miss Lin' : 'Messages'}
            </h3>
            <p className="text-xs text-white/80">Online Support</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {user?.token && (
            <button onClick={() => setActiveTab(activeTab === 'ai' ? 'im' : 'ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'ai' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white/20 text-white hover:bg-white/30'
              }`}>
              {activeTab === 'ai' ? 'Messages' : 'AI'}
            </button>
          )}
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors ml-1">
            <X size={18} className="text-white" />
          </button>
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] max-h-[70vh] bg-white rounded-2xl border border-dark-200 shadow-2xl flex flex-col overflow-hidden animate-slide-up z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-secondary">
        {getHeaderContent()}
      </div>

      {/* Content */}
      {activeTab === 'ai' ? (
        <AIChatView state={state} dispatch={dispatch} onClose={onClose} />
      ) : imView === 'chat' && selectedRoom ? (
        loadingMessages ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-dark-400 text-sm">Loading messages...</p>
          </div>
        ) : (
          <IMChatView room={selectedRoom} messages={chatMessages} onBack={handleBackToRooms} />
        )
      ) : imView === 'sales' ? (
        <SalesPicker onSelect={handleSelectSales} onBack={() => setImView('rooms')} />
      ) : (
        <RoomList onSelectRoom={handleSelectRoom} onNewChat={() => setImView('sales')} />
      )}
    </div>
  );
}
