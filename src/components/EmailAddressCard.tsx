import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  RefreshCw,
  PlusCircle,
  Trash2,
  QrCode,
  Clock,
  Hourglass,
  CalendarPlus,
  AlertTriangle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMailbox } from '../context/MailboxContext';
import { formatCountdown } from '../utils/time';

export const EmailAddressCard: React.FC<{
  onOpenNewModal: () => void;
  onOpenDeleteModal: () => void;
  onOpenQrModal: () => void;
  onOpenExtendModal: () => void;
}> = ({ onOpenNewModal, onOpenDeleteModal, onOpenQrModal, onOpenExtendModal }) => {
  const { t } = useLanguage();
  const {
    session,
    refreshInbox,
    isLoadingMessages,
    isCreating,
    isExpired,
  } = useMailbox();

  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<{
    formatted: string;
    isExpired: boolean;
  }>({
    formatted: '--:--',
    isExpired: false,
  });

  // Calculate live countdown timer every second
  useEffect(() => {
    if (!session) return;

    const updateTimer = () => {
      const res = formatCountdown(session.expiresAt);
      setCountdown({
        formatted: res.formatted,
        isExpired: res.isExpired,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const handleCopy = async () => {
    if (!session?.address) return;
    try {
      await navigator.clipboard.writeText(session.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = session.address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!session) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">{t('duration.creating')}</h3>
      </div>
    );
  }

  const isActuallyExpired = isExpired || countdown.isExpired;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -end-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -start-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {isActuallyExpired ? (
        /* Expired State Display */
        <div className="text-center py-6 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {t('emailCard.expiredTitle')}
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
            {t('emailCard.expiredDesc')}
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={onOpenNewModal}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{t('emailCard.createNew')}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active State Main Card */
        <div>
          {/* Card Top: Label & Status Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('emailCard.label')}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                {t('emailCard.activeBadge')}
              </span>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-mono font-bold text-amber-400">
              <Hourglass className="w-3.5 h-3.5 animate-pulse" />
              <span>{t('emailCard.remaining')}:</span>
              <span className="text-white text-sm">{countdown.formatted}</span>
            </div>
          </div>

          {/* Email Address Display Bar */}
          <div className="relative group flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-inner">
            <div className="flex items-center gap-3 px-2 overflow-hidden">
              <span className="font-mono text-base sm:text-xl md:text-2xl font-extrabold text-white tracking-tight break-all select-all">
                {session.address}
              </span>
            </div>

            {/* Large Copy Email Button */}
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all shrink-0 cursor-pointer active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-600/25 ring-2 ring-emerald-400'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 hover:shadow-blue-500/40'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>{t('emailCard.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>{t('emailCard.copy')}</span>
                </>
              )}
            </button>
          </div>

          {/* Action Buttons Row */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {/* Refresh Button */}
            <button
              onClick={() => refreshInbox()}
              disabled={isLoadingMessages}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-blue-400 ${isLoadingMessages ? 'animate-spin' : ''}`}
              />
              <span>{isLoadingMessages ? t('emailCard.refreshing') : t('emailCard.refresh')}</span>
            </button>

            {/* Extend Lifetime Button */}
            <button
              onClick={onOpenExtendModal}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <CalendarPlus className="w-4 h-4 text-emerald-400" />
              <span>{t('emailCard.extendLifetime')}</span>
            </button>

            {/* QR Code Button */}
            <button
              onClick={onOpenQrModal}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>{t('emailCard.qrCode')}</span>
            </button>

            {/* Delete / Reset Button */}
            <button
              onClick={onOpenDeleteModal}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>{t('emailCard.deleteEmail')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
