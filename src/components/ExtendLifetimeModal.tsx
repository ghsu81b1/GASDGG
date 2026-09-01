import React, { useState } from 'react';
import { X, CalendarPlus, Check, Loader2, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMailbox } from '../context/MailboxContext';

const EXTEND_OPTIONS = [
  { labelKey: 'extend.opt1h', minutes: 60 },
  { labelKey: 'extend.opt2h', minutes: 120 },
  { labelKey: 'extend.opt1d', minutes: 1440 },
  { labelKey: 'extend.opt3d', minutes: 4320 },
];

export const ExtendLifetimeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { session, extendLifetime, isExtending } = useMailbox();
  const [selectedMinutes, setSelectedMinutes] = useState<number>(60);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen || !session) return null;

  const handleExtend = async () => {
    try {
      await extendLifetime(selectedMinutes);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1500);
    } catch {
      // Error handled in context
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CalendarPlus className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white text-center mb-1">
          {t('extend.title')}
        </h3>
        <p className="text-xs text-slate-400 text-center mb-5">
          {t('extend.desc')}
        </p>

        {successMessage ? (
          <div className="py-8 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">{t('extend.success')}</p>
          </div>
        ) : (
          <>
            {/* Extension Options Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {EXTEND_OPTIONS.map((opt) => {
                const isSelected = selectedMinutes === opt.minutes;
                return (
                  <button
                    key={opt.minutes}
                    type="button"
                    onClick={() => setSelectedMinutes(opt.minutes)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600/20 border-emerald-500 text-white font-bold ring-2 ring-emerald-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-semibold">{t(opt.labelKey)}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800 mb-5">
              <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t('extend.maxNote')}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                {t('extend.close')}
              </button>

              <button
                type="button"
                onClick={handleExtend}
                disabled={isExtending}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {isExtending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{t('emailCard.extendLifetime')}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
