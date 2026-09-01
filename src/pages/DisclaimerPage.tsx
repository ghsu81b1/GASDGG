import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, XCircle, Mail, ArrowRight } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AdSlot } from '../components/AdSlot';

interface DisclaimerPageProps {
  onNavigate: (page: string) => void;
}

export const DisclaimerPage: React.FC<DisclaimerPageProps> = ({ onNavigate }) => {
  const lastUpdated = 'September 1, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SeoHead
        title="Disclaimer"
        description="Important service disclaimers regarding the temporary, ephemeral nature of TempMail Plus disposable mailboxes."
        canonicalPath="disclaimer"
        schemaType="WebPage"
      />

      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          Service Disclaimer
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="text-xs text-slate-400">
          Last Updated: <span className="text-slate-200 font-semibold">{lastUpdated}</span>
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        {/* 1. General Informational Notice */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. General Notice & Informational Purpose</h2>
          <p>
            The information and tools provided on TempMail Plus are provided strictly for general informational, privacy protection, and software testing purposes. While we strive to maintain high uptime and dependable email delivery via the Mail.tm protocol, TempMail Plus makes no representations or warranties of any kind regarding completeness, reliability, or uninterrupted availability.
          </p>
        </section>

        {/* 2. Critical Account Warning */}
        <section className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 space-y-3">
          <h2 className="text-base font-bold text-rose-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            2. Do NOT Use for Critical or Financial Accounts
          </h2>
          <p className="text-xs text-slate-300">
            You must never use temporary email addresses for:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li>• Bank accounts, cryptocurrency exchanges, credit cards, or financial payment gateways.</li>
            <li>• Primary personal or business cloud credentials (such as Google, Apple, Microsoft accounts).</li>
            <li>• Legal, tax, medical, or government agency communication channels.</li>
            <li>• Any account where you will need to reset passwords or receive two-factor authentication in the future.</li>
          </ul>
          <p className="text-xs text-slate-400 mt-1">
            Because temporary inboxes expire permanently, <strong>we cannot recover any verification code or restore access to any account registered with an expired address.</strong>
          </p>
        </section>

        {/* 3. Third-Party Service Rejection Disclaimer */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Third-Party Acceptance Disclaimer</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Certain external websites, platforms, and email filters actively identify and reject known temporary or disposable email domains. TempMail Plus does not guarantee that our generated addresses will be accepted by all third-party websites. Users encountering rejection are advised to try another available domain or use their permanent email provider if necessary.
          </p>
        </section>

        {/* Ad slot */}
        <AdSlot slotId="disclaimer-page-mid" format="horizontal" />

        {/* 4. No Affiliation Disclaimer */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Independent Service Disclaimer</h2>
          <p className="text-xs text-slate-400">
            TempMail Plus is an independent service. We are not officially affiliated with, endorsed by, or sponsored by Google LLC, Mail.tm, or any other trademarked company mentioned descriptively on this website. All product names, logos, and brands are property of their respective owners.
          </p>
        </section>

        {/* 5. Contact */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            5. Contact Information
          </h2>
          <p className="text-xs text-slate-400">
            If you have questions regarding this disclaimer, reach us at:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400">
            <a href="mailto:achrafelhrbiliachraf@gmail.com">achrafelhrbiliachraf@gmail.com</a>
          </div>
        </section>
      </div>
    </div>
  );
};
