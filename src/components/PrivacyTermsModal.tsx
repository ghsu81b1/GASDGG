import React from 'react';
import { X, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyTermsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {t('privacy.title')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('brand.poweredBy')}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 pe-2 leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Data Minimization & Session Storage</span>
            </h4>
            <p className="text-slate-400">
              {t('privacy.disclaimer')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Mail.tm Infrastructure Disclaimer</span>
            </h4>
            <p className="text-slate-400">
              {t('privacy.mailtmNotice')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="font-bold text-white mb-1.5 flex items-center gap-1.5 text-xs sm:text-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('privacy.termsTitle')}</span>
            </h4>
            <p className="text-slate-400">
              {t('privacy.termsText')}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            {t('extend.close')}
          </button>
        </div>
      </div>
    </div>
  );
};
