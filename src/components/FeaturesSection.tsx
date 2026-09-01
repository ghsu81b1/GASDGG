import React from 'react';
import {
  Server,
  Clock,
  RefreshCw,
  ShieldCheck,
  QrCode,
  Languages,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Server,
      title: t('features.f1Title'),
      desc: t('features.f1Desc'),
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      icon: Clock,
      title: t('features.f2Title'),
      desc: t('features.f2Desc'),
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      icon: RefreshCw,
      title: t('features.f3Title'),
      desc: t('features.f3Desc'),
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: ShieldCheck,
      title: t('features.f4Title'),
      desc: t('features.f4Desc'),
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: QrCode,
      title: t('features.f5Title'),
      desc: t('features.f5Desc'),
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Languages,
      title: t('features.f6Title'),
      desc: t('features.f6Desc'),
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <section className="py-12 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('features.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${feat.color} border flex items-center justify-center mb-3`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
