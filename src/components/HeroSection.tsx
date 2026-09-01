import React from 'react';
import { ShieldCheck, Zap, Clock, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="pt-8 pb-4 text-center">
      <div className="max-w-4xl mx-auto px-4">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Highlight Feature Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('hero.badgeNoSignup')}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('hero.badgeRealtime')}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('hero.badgeAutoDestruct')}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('hero.badgeCleanHtml')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
