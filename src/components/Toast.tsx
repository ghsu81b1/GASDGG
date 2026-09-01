import React, { useEffect } from 'react';
import { Mail, X, ArrowRight, AlertCircle } from 'lucide-react';
import { useMailbox } from '../context/MailboxContext';
import { useLanguage } from '../context/LanguageContext';

export const Toast: React.FC = () => {
  const { newEmailNotification, clearNotification, selectMessage, error } = useMailbox();
  const { isRtl } = useLanguage();

  useEffect(() => {
    if (newEmailNotification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [newEmailNotification, clearNotification]);

  if (!newEmailNotification && !error) {
    return null;
  }

  return (
    <div className="fixed bottom-5 end-5 z-50 flex flex-col gap-2 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-200">
      {/* New incoming email toast */}
      {newEmailNotification && (
        <div
          onClick={() => {
            selectMessage(newEmailNotification.id);
            clearNotification();
          }}
          className="relative flex items-center gap-3 p-4 rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-600/40 border border-blue-400/40 cursor-pointer hover:bg-blue-500 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-white animate-bounce" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-blue-100">New Email Received!</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotification();
                }}
                className="text-white/60 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs font-semibold truncate text-white">
              {newEmailNotification.from.name || newEmailNotification.from.address}
            </p>
            <p className="text-[11px] text-blue-100/80 truncate">
              {newEmailNotification.subject || '(No subject)'}
            </p>
          </div>
        </div>
      )}

      {/* Global Error Banner if present */}
      {error && !newEmailNotification && (
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-950/90 text-rose-200 border border-rose-800 shadow-xl text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}
    </div>
  );
};
