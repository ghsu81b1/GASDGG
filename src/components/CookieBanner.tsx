import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Check, X } from 'lucide-react';

interface CookieBannerProps {
  onNavigate: (page: string) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('tempmail_cookie_consent');
      if (!consent) {
        // Small delay for smooth entry
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('tempmail_cookie_consent', JSON.stringify({
        essential: true,
        analytics: true,
        advertising: true,
        timestamp: Date.now(),
      }));
    } catch {}
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    try {
      localStorage.setItem('tempmail_cookie_consent', JSON.stringify({
        essential: true,
        analytics: false,
        advertising: false,
        timestamp: Date.now(),
      }));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Preferences"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto rounded-2xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl shadow-2xl p-5 sm:p-6 pointer-events-auto text-slate-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                We value your privacy and trust
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                We use strictly essential local storage to remember your temporary inbox session, audio chime, and language preferences. With your consent, we and our advertising partners (such as Google AdSense) may also use cookies to serve personalized or non-personalized ads and analyze aggregated traffic.
              </p>
              <div className="pt-1 flex items-center gap-3 text-xs">
                <button
                  onClick={() => onNavigate('cookies')}
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  Cookie Policy
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <button
              onClick={handleAcceptEssential}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
