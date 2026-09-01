import React from 'react';
import { Mail, Shield, ExternalLink, HelpCircle, FileText, Lock, Cookie, AlertTriangle, Send, Info, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../types';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenPrivacyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
  ];

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/95 pt-12 pb-8 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Multi-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">
                Temp<span className="text-blue-400">Mail</span> PLUS
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Free, instant, and secure temporary disposable email service. Protect your personal inbox from promotional spam, marketing newsletters, and unwanted online trackers.
            </p>
            <div className="pt-1">
              <div className="text-xs text-slate-500">
                Support & Contact:{' '}
                <a
                  href="mailto:achrafelhrbiliachraf@gmail.com"
                  className="text-blue-400 hover:text-blue-300 font-mono underline underline-offset-2"
                >
                  achrafelhrbiliachraf@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links & Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  Temporary Inbox
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  About Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Privacy & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cookies')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Cookie className="w-3.5 h-3.5 text-slate-500" />
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('disclaimer')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
                  Service Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Help & Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                  Contact Us
                </button>
              </li>
              <li>
                <a
                  href="https://api.mail.tm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Mail.tm API Docs</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Languages</span>
              <div className="flex flex-wrap gap-1.5">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                      language === l.code
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance Disclaimer */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TempMail Plus. All rights reserved.</p>
          <p className="text-center sm:text-end text-[11px] text-slate-500 max-w-xl">
            Independent disposable email utility. Not officially affiliated with Google, Mail.tm, or third-party email providers. Disposable mailboxes are ephemeral and not intended for sensitive banking, government, or permanent recovery credentials.
          </p>
        </div>
      </div>
    </footer>
  );
};
