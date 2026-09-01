import React from 'react';
import { FileText, CheckCircle2, XCircle, AlertTriangle, Shield, Mail, ArrowRight } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AdSlot } from '../components/AdSlot';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  const lastUpdated = 'September 1, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SeoHead
        title="Terms of Service"
        description="Terms of Service for TempMail Plus: Acceptable use guidelines, prohibited activities, temporary service disclaimers, and user responsibilities."
        canonicalPath="terms"
        schemaType="WebPage"
      />

      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          Terms & Conditions
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400">
          Last Updated: <span className="text-slate-200 font-semibold">{lastUpdated}</span>
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        {/* 1. Acceptance of Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the TempMail Plus website and disposable email service, you agree to be legally bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>
        </section>

        {/* 2. Nature of Temporary Email Service */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Nature of Ephemeral Service</h2>
          <p>
            TempMail Plus provides short-lived, disposable email addresses designed for temporary communication, verification receipt, and privacy protection. You acknowledge and agree that:
          </p>
          <ul className="list-disc ps-5 space-y-1.5 text-xs text-slate-400">
            <li>Addresses and received messages self-destruct upon session expiration or manual deletion.</li>
            <li>We cannot recover or restore messages after expiration has occurred.</li>
            <li>The service is strictly receive-only; sending outbound emails is not permitted.</li>
            <li>We do not guarantee that third-party websites or services will accept disposable domain names.</li>
          </ul>
        </section>

        {/* 3. Acceptable Use vs Prohibited Activities */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">3. Acceptable & Prohibited Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Permitted Uses
              </h3>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>• Receiving software trial activations.</li>
                <li>• Signing up for one-time download gates.</li>
                <li>• Software development & QA testing.</li>
                <li>• Protecting personal email from public spam.</li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-2">
              <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Strictly Prohibited Uses
              </h3>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>• Phishing, fraud, or identity deception.</li>
                <li>• Distributing malware, ransomware, or viruses.</li>
                <li>• Harassment, hate speech, or illicit trade.</li>
                <li>• Automated abusive scraping or DDoS attacks.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Ad slot in terms */}
        <AdSlot slotId="terms-page-mid" format="horizontal" />

        {/* 4. Disclaimer of Warranties */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            4. "As-Is" Warranty Disclaimer
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            TempMail Plus is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. We do not warrant that the service will be uninterrupted, error-free, immune to server delays, or that any specific email from a third party will be delivered successfully.
          </p>
        </section>

        {/* 5. Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Limitation of Liability</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            In no event shall TempMail Plus or its operators be liable for any direct, indirect, incidental, special, consequential, or exemplary damages—including but not limited to damages for loss of profits, account access loss, data corruption, or inability to retrieve expired verification messages—arising out of or in connection with your use of the service.
          </p>
        </section>

        {/* 6. Modification of Terms */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">6. Changes to Terms</h2>
          <p className="text-xs text-slate-400">
            We reserve the right to revise or modify these Terms of Service at any time. Any changes will be reflected with an updated "Last Updated" timestamp at the top of this page. Your continued use of the website following any changes constitutes your binding acceptance of the updated terms.
          </p>
        </section>

        {/* 7. Contact */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            7. Contact Information
          </h2>
          <p className="text-xs text-slate-400">
            For legal inquiries or questions regarding these terms, please contact:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400">
            <a href="mailto:achrafelhrbiliachraf@gmail.com">achrafelhrbiliachraf@gmail.com</a>
          </div>
        </section>
      </div>
    </div>
  );
};
