import React from 'react';
import { AlertTriangle, Trash2, PlusCircle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ConfirmModal: React.FC<{
  isOpen: boolean;
  type: 'delete' | 'new';
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}> = ({ isOpen, type, onClose, onConfirm, isLoading = false }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const isDelete = type === 'delete';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
            isDelete
              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
              : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
          }`}
        >
          {isDelete ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          {isDelete ? t('modals.deleteTitle') : t('modals.newConfirmTitle')}
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {isDelete ? t('modals.deleteDesc') : t('modals.newConfirmDesc')}
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            {t('modals.cancel')}
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            disabled={isLoading}
            className={`flex-1 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
              isDelete
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
            }`}
          >
            {isDelete ? t('modals.confirmDelete') : t('modals.confirmNew')}
          </button>
        </div>
      </div>
    </div>
  );
};
