import React from 'react';
import { Cookie, CheckCircle2, Shield, Settings, Mail, ArrowRight } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AdSlot } from '../components/AdSlot';

interface CookiePolicyPageProps {
  onNavigate: (page: string) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onNavigate }) => {
  const lastUpdated = 'September 1, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SeoHead
        title="Cookie Policy"
        description="Learn how TempMail Plus uses cookies and local storage for essential session handling, language settings, and third-party advertising partners like Google AdSense."
        canonicalPath="cookies"
        schemaType="WebPage"
      />

      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Cookie className="w-3.5 h-3.5" />
          Transparency
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-xs text-slate-400">
          Last Updated: <span className="text-slate-200 font-semibold">{lastUpdated}</span>
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        {/* 1. What Are Cookies */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. What Are Cookies and Local Storage?</h2>
          <p>
            Cookies are small text files placed on your device by websites that you visit. Browser Local Storage (<code>localStorage</code>) is a similar web technology that stores data directly within your browser without sending it with every HTTP request.
          </p>
          <p>
            TempMail Plus utilizes both minimal essential local storage and standard third-party advertising cookies to ensure optimal functionality and sustain our free service.
          </p>
        </section>

        {/* 2. Breakdown of Storage Items */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">2. Storage Technologies We Use</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">Essential Functional Storage</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Strictly Necessary
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Stores your temporary mailbox session ID (so your active inbox doesn't vanish if you refresh or switch tabs), your chosen language, audio notification state, and cookie consent preferences.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white text-xs">Google AdSense & Advertising Cookies</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                  Advertising & Analytics
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Third-party ad networks (including Google AdSense) use cookies to serve non-intrusive ads based on your visits to this and other websites, measure ad impressions, and prevent fraud.
              </p>
            </div>
          </div>
        </section>

        {/* Ad slot */}
        <AdSlot slotId="cookie-policy-mid" format="horizontal" />

        {/* 3. Managing and Disabling Cookies */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            3. How to Manage or Disable Cookies
          </h2>
          <p className="text-xs text-slate-400">
            You have the complete right to accept or decline cookies. You can manage your preferences through:
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              • <strong>Your Browser Settings:</strong> You can configure Chrome, Firefox, Safari, or Edge to block third-party cookies or alert you when cookies are sent.
            </li>
            <li>
              • <strong>Google Ad Personalization:</strong> You can opt out of personalized ads at{' '}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Google Ads Settings
              </a>.
            </li>
            <li>
              • <strong>Industry Opt-Out Portals:</strong> You can opt out of many ad networks at{' '}
              <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                AboutAds.info Choices
              </a>{' '}
              or{' '}
              <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Your Online Choices (EU)
              </a>.
            </li>
          </ul>
        </section>

        {/* 4. Contact */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            4. Questions About Cookies?
          </h2>
          <p className="text-xs text-slate-400">
            For questions regarding our cookie practices, reach out to us at:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400">
            <a href="mailto:achrafelhrbiliachraf@gmail.com">achrafelhrbiliachraf@gmail.com</a>
          </div>
        </section>
      </div>
    </div>
  );
};
