import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, QrCode as QrIcon, Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMailbox } from '../context/MailboxContext';

export const QrCodeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const { session } = useMailbox();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && session?.address) {
      QRCode.toDataURL(session.address, {
        width: 280,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR code', err));
    }
  }, [isOpen, session?.address]);

  if (!isOpen || !session) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(session.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <QrIcon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          {t('emailCard.qrCode')}
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          {t('emailCard.scanQr')}
        </p>

        {/* QR Code Canvas Frame */}
        <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto mb-4">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 mx-auto rounded-lg" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
              Generating QR Code...
            </div>
          )}
        </div>

        {/* Address pill */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono mb-4">
          <span className="truncate pe-2">{session.address}</span>
          <button
            onClick={handleCopy}
            className="p-1 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
        >
          {t('extend.close')}
        </button>
      </div>
    </div>
  );
};
