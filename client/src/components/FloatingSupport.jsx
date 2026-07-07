import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Clock, ShoppingBag, Truck, RefreshCw, CreditCard, X, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { supportAPI } from '../api';

const quickQuestions = [
  { icon: ShoppingBag, text: 'Pricing', message: 'What promotions do you have?' },
  { icon: Truck, text: 'Shipping', message: 'How long does shipping take?' },
  { icon: RefreshCw, text: 'Returns', message: 'What is the return policy?' },
  { icon: CreditCard, text: 'Payment', message: 'What payment methods are accepted?' },
];

export default function FloatingSupport({ isOpen, onClose }) {
  const { state, dispatch } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && state.chatHistory.length === 0) {
      setTimeout(() => {
        const welcomeMsg = {
          id: 'welcome',
          sender: 'ai',
          content: 'Hello! Welcome to DriveLine International. I am your dedicated support assistant. How can I help you today?',
          timestamp: new Date()
        };
        dispatch({ type: 'ADD_MESSAGE', payload: welcomeMsg });
      }, 500);
    }
  }, [isOpen]);

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
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: data.aiReply,
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: aiMsg });
    } catch (err) {
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: 'Sorry, our support system is temporarily unavailable. Please try again later.',
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMsg });
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

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] max-h-[70vh] bg-white rounded-2xl border border-dark-200 shadow-2xl flex flex-col overflow-hidden animate-slide-up z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-secondary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white">AI Assistant</h3>
            <p className="text-xs text-white/80">Online Support</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-blue-50/30">
        {state.chatHistory.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-slide-up ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              msg.sender === 'user'
                ? 'bg-gradient-to-br from-accent to-primary'
                : 'bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20'
            }`}>
              {msg.sender === 'user' ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[80%] ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block px-3 py-2 rounded-xl ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/20'
                  : 'bg-white border border-dark-200 rounded-tl-sm shadow-sm'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              <div className={`flex items-center gap-1 mt-1 text-xs text-dark-400 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                <Clock size={10} />
                {formatTime(msg.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3 animate-slide-up">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot size={16} className="text-white" />
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
          {quickQuestions.map((q, index) => {
            const Icon = q.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickQuestion(q.message)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg text-xs text-dark-600 hover:bg-primary/5 hover:text-primary border border-dark-200 transition-colors"
              >
                <Icon size={12} />
                {q.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-dark-200">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="w-full px-3 py-2.5 pr-10 rounded-xl bg-white border border-dark-200 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
            />
            <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/50" size={14} />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 btn-glow flex items-center gap-2"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
