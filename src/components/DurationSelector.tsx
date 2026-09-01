import React, { useState } from 'react';
import { Clock, Sliders, ChevronDown, Check, Loader2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMailbox } from '../context/MailboxContext';
import { LifetimeOption } from '../types';

export const DURATION_OPTIONS: LifetimeOption[] = [
  { labelKey: 'duration.d_10m', minutes: 10 },
  { labelKey: 'duration.d_30m', minutes: 30 },
  { labelKey: 'duration.d_1h', minutes: 60, badge: 'Popular' },
  { labelKey: 'duration.d_2h', minutes: 120 },
  { labelKey: 'duration.d_6h', minutes: 360 },
  { labelKey: 'duration.d_12h', minutes: 720 },
  { labelKey: 'duration.d_1d', minutes: 1440, badge: 'Recommended' },
  { labelKey: 'duration.d_2d', minutes: 2880 },
  { labelKey: 'duration.d_3d', minutes: 4320 },
  { labelKey: 'duration.d_4d', minutes: 5760 },
  { labelKey: 'duration.d_5d', minutes: 7200 },
];

export const DurationSelector: React.FC<{
  onCreated?: () => void;
  initialDuration?: number;
}> = ({ onCreated, initialDuration = 60 }) => {
  const { t } = useLanguage();
  const { createMailbox, isCreating, domains, isLoadingDomains } = useMailbox();

  const [selectedMinutes, setSelectedMinutes] = useState<number>(initialDuration);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customUsername, setCustomUsername] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  const handleCreate = async () => {
    try {
      await createMailbox(
        selectedMinutes,
        customUsername.trim() || undefined,
        selectedDomain || undefined
      );
      if (onCreated) {
        onCreated();
      }
    } catch {
      // Error handled by context
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
      {/* Title & Instructions */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>{t('duration.title')}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {t('duration.subtitle')}
          </p>
        </div>
      </div>

      {/* 11 Lifetime Option Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
        {DURATION_OPTIONS.map((opt) => {
          const isSelected = selectedMinutes === opt.minutes;
          return (
            <button
              key={opt.minutes}
              type="button"
              onClick={() => setSelectedMinutes(opt.minutes)}
              className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-white font-bold ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              {opt.badge && (
                <span
                  className={`absolute -top-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wider uppercase border ${
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {opt.badge}
                </span>
              )}
              <span className="text-xs sm:text-sm font-semibold">{t(opt.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Custom Options Toggle */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>{t('duration.customUsername')}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          />
        </button>

        {showAdvanced && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 animate-in fade-in duration-150">
            {/* Custom username */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {t('duration.usernamePlaceholder')}
              </label>
              <input
                type="text"
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                placeholder="e.g. bluefox82"
                maxLength={30}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Custom domain */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {t('duration.domainLabel')}
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                disabled={isLoadingDomains || domains.length === 0}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
              >
                <option value="">-- {t('brand.poweredBy')} (Auto) --</option>
                {domains.map((d) => (
                  <option key={d.id} value={d.domain}>
                    @{d.domain}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/20 active:scale-98 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>{t('duration.creating')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{t('duration.createBtn')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
