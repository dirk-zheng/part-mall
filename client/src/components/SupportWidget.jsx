import { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import wsClient from '../api/ws';
import FloatingSupport from './FloatingSupport';

const CLICKED_KEY = 'part_mall_support_clicked';

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDot, setShowDot] = useState(false);
  const [unreadSenders, setUnreadSenders] = useState(new Set());
  const { user } = useAuth();
  const isOpenRef = useRef(false);

  isOpenRef.current = isOpen; // always current

  const isCustomer = !user || user.role !== 'admin';
  const isAdmin = user?.role === 'admin';

  // Customer: check localStorage on mount / when user loads
  useEffect(() => {
    if (isCustomer && user) {
      const hasClicked = localStorage.getItem(CLICKED_KEY);
      if (!hasClicked) {
        setShowDot(true);
      }
    }
  }, [user?.id]); // re-check when user changes

  // Sales: listen for incoming IM messages
  useEffect(() => {
    if (!isAdmin) return;

    const unsub = wsClient.on('im.message', (data) => {
      if (!isOpenRef.current) {
        setShowDot(true);
        setUnreadSenders(prev => {
          const next = new Set(prev);
          next.add(data.senderId);
          return next;
        });
      }
    });

    return unsub;
  }, [isAdmin]);

  const handleToggle = useCallback(() => {
    const opening = !isOpen;
    setIsOpen(opening);

    if (opening) {
      // Clear dot for customer
      if (isCustomer) {
        localStorage.setItem(CLICKED_KEY, 'true');
      }
      setShowDot(false);
      setUnreadSenders(new Set());
    }
  }, [isOpen, isCustomer]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Don't re-show the customer dot after close (already clicked)
    // Sales dot may re-appear on next incoming message
  }, []);

  const unreadCount = unreadSenders.size;

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30 flex items-center justify-center z-50 transition-all hover:scale-110 hover:shadow-xl hover:shadow-primary/40 ${
          isOpen ? 'rotate-90' : ''
        }`}
        title={isAdmin ? 'Customer Messages' : 'Support & Chat'}
      >
        {/* Big Red Dot */}
        {showDot && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-[20px] bg-red-500 rounded-full border-[3px] border-white shadow-lg animate-pulse">
            {isAdmin && unreadCount > 0 ? (
              <span className="text-white text-[10px] font-bold leading-none px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            ) : null}
          </span>
        )}

        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <MessageCircle size={26} className="text-white" />
        )}
      </button>

      {/* Chat Panel */}
      <FloatingSupport isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
