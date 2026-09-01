import React from 'react';
import { Mail, Inbox, Trash2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HowItWorks: React.FC = () => {
  const { isRtl, t } = useLanguage();

  const steps = [
    {
      num: '01',
      icon: Mail,
      title: t('howItWorks.step1Title'),
      desc: t('howItWorks.step1Desc'),
      color: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
    },
    {
      num: '02',
      icon: Inbox,
      title: t('howItWorks.step2Title'),
      desc: t('howItWorks.step2Desc'),
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
    },
    {
      num: '03',
      icon: Trash2,
      title: t('howItWorks.step3Title'),
      desc: t('howItWorks.step3Desc'),
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <section className="py-12 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('howItWorks.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} border flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
