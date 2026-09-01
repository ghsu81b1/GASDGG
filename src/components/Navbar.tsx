import React, { useState, useRef, useEffect } from 'react';
import { Mail, Globe, Volume2, VolumeX, Plus, Check, Menu, X, HelpCircle, Shield, Info, Send, BookOpen, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMailbox } from '../context/MailboxContext';
import { Language } from '../types';

const LANGUAGES: { code: Language; label: string; flag: string; native: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦', native: 'العربية' },
  { code: 'fr', label: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'de', label: 'German', flag: '🇩🇪', native: 'Deutsch' },
];

export const Navbar: React.FC<{
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenNewModal: () => void;
  onOpenPrivacyModal: () => void;
}> = ({ currentPage, onNavigate, onOpenNewModal, onOpenPrivacyModal }) => {
  const { language, setLanguage, t } = useLanguage();
  const { soundEnabled, toggleSound, session } = useMailbox();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'how-it-works', label: 'How It Works', icon: BookOpen },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'about', label: 'About Us', icon: Info },
    { id: 'contact', label: 'Contact', icon: Send },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileNavOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Status */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group text-start focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/20 group-hover:border-blue-500/50 transition-all">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight">
                  Temp<span className="text-blue-400">Mail</span>
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  PLUS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {t('brand.poweredBy')}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === item.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Chime Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute notification chime' : 'Enable notification chime'}
            className="p-2 sm:p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-blue-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-200 text-sm font-medium transition-colors"
              aria-expanded={langMenuOpen}
              aria-haspopup="true"
            >
              <span className="text-base">{currentLang.flag}</span>
              <span className="hidden sm:inline">{currentLang.native}</span>
              <Globe className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute end-0 mt-2 w-44 rounded-xl border border-slate-800 bg-slate-900 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 border-b border-slate-800">
                  {t('nav.language')}
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors text-start ${
                      language === lang.code
                        ? 'bg-blue-600/15 text-blue-400 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.native}</span>
                    </div>
                    {language === lang.code && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick New Address Button */}
          <button
            onClick={onOpenNewModal}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav.newAddress')}</span>
            <span className="sm:hidden">{t('emailCard.newEmail')}</span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-start ${
                  currentPage === item.id
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                onNavigate('privacy');
                setMobileNavOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
            >
              Privacy Policy
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                onNavigate('terms');
                setMobileNavOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
            >
              Terms of Service
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                onNavigate('disclaimer');
                setMobileNavOpen(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
            >
              Disclaimer
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

