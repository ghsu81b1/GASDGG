import React from 'react';
import { Shield, Lock, Eye, Server, Cookie, UserCheck, Mail, ArrowRight } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AdSlot } from '../components/AdSlot';

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  const lastUpdated = 'September 1, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SeoHead
        title="Privacy Policy"
        description="TempMail Plus Privacy Policy: Learn how we protect your privacy, handle ephemeral temporary email messages, manage cookies, and respect your data rights."
        canonicalPath="privacy"
        schemaType="WebPage"
      />

      {/* Header */}
      <div className="space-y-3 border-b border-slate-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          Legal & Compliance
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">
          Last Updated: <span className="text-slate-200 font-semibold">{lastUpdated}</span>
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        {/* Section 1: Overview & Philosophy */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            1. Overview & Privacy-First Philosophy
          </h2>
          <p>
            At TempMail Plus ("we", "us", or "our"), your privacy is our foundational priority. We built this disposable email service specifically so that users can protect their personal email addresses from unwanted marketing spam, aggressive tracking scripts, and data breach vulnerabilities.
          </p>
          <p>
            This Privacy Policy explains how our service operates, what limited information is processed, how temporary inboxes are handled, and how third-party advertising partners (such as Google AdSense) operate on our platform.
          </p>
        </section>

        {/* Section 2: Information We DO NOT Collect */}
        <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3">
          <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            2. Information We DO NOT Collect
          </h2>
          <p className="text-xs text-slate-300">
            Because TempMail Plus is an anonymous disposable utility, we do NOT require or collect:
          </p>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li>• Your real legal name, telephone number, or physical address.</li>
            <li>• Passwords, personal account credentials, or security question answers.</li>
            <li>• Credit card, debit card, or financial billing details.</li>
            <li>• Social security, national identity, or passport numbers.</li>
          </ul>
        </section>

        {/* Section 3: Information Processed During Temporary Mailbox Usage */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            3. Information Processed During Service Operation
          </h2>
          <p>
            When you use TempMail Plus, the following technical data is processed transiently to deliver your ephemeral mailbox:
          </p>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-slate-200">Temporary Email Session Identifiers:</strong>
              <p className="text-slate-400">
                When a mailbox is generated, a temporary session token and address are generated via Mail.tm API. This allows your browser to poll for incoming messages during your active session.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-slate-200">Incoming Message Content:</strong>
              <p className="text-slate-400">
                Emails sent to your temporary address (including sender header, subject line, text body, sanitized HTML body, and attachments) are stored transiently solely for the duration of your mailbox lifetime. Once the timer expires or you manually click "Delete", messages are permanently purged from the server.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <strong className="text-slate-200">Server Logs & Rate Limiting:</strong>
              <p className="text-slate-400">
                To prevent distributed denial-of-service (DDoS) attacks, brute-force abuse, and bot spam, our server temporarily processes standard HTTP request headers, user agent information, and IP addresses. These logs are maintained strictly for operational security and are not combined with personal profiles.
              </p>
            </div>
          </div>
        </section>

        {/* Ad slot in policy */}
        <AdSlot slotId="privacy-policy-mid" format="horizontal" />

        {/* Section 4: Cookies & Local Storage */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-blue-400" />
            4. Cookies & Browser Local Storage
          </h2>
          <p>
            We use client-side <code>localStorage</code> to store:
          </p>
          <ul className="list-disc ps-5 space-y-1 text-xs text-slate-400">
            <li>Your active temporary mailbox session ID (so your inbox persists if you refresh the browser).</li>
            <li>Your language preference (English, Arabic, French, Spanish, German).</li>
            <li>Your notification sound preference (muted or unmuted).</li>
            <li>Your cookie consent decision.</li>
          </ul>
          <p className="text-xs text-slate-400 mt-2">
            You can clear your browser’s cache and local storage at any time through your browser settings, which will immediately remove all stored session keys.
          </p>
        </section>

        {/* Section 5: Third-Party Advertising & Google AdSense Disclosures */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            5. Third-Party Advertising Partners (Google AdSense)
          </h2>
          <p className="text-xs text-slate-300">
            To keep TempMail Plus free for everyone, we display advertisements provided by third-party ad networks, including Google AdSense.
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>
              • <strong>Third-party vendors, including Google</strong>, use cookies to serve ads based on a user's prior visits to this website or other websites.
            </li>
            <li>
              • <strong>Google's use of advertising cookies</strong> enables it and its partners to serve ads to users based on their visit to your sites and/or other sites on the Internet.
            </li>
            <li>
              • Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Google Ads Settings
              </a>{' '}
              or by visiting{' '}
              <a
                href="https://www.aboutads.info/choices"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                AboutAds.info
              </a>.
            </li>
          </ul>
        </section>

        {/* Section 6: Data Retention & Permanent Deletion */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            6. Data Retention & Erasure Policy
          </h2>
          <p className="text-xs text-slate-300">
            Temporary inboxes are strictly ephemeral. We do not maintain historical archives of expired temporary mailboxes. When a session expires according to the countdown or when the user invokes the "Delete Mailbox" action:
          </p>
          <ul className="list-disc ps-5 space-y-1 text-xs text-slate-400">
            <li>The mailbox authentication token is invalidated.</li>
            <li>All associated received messages, headers, and attachments are permanently removed.</li>
            <li>No backups or cached copies of message contents are retained.</li>
          </ul>
        </section>

        {/* Section 7: User Rights (GDPR & CCPA/CPRA) */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-400" />
            7. Your Privacy Rights (GDPR, CCPA & Global Regulations)
          </h2>
          <p className="text-xs text-slate-300">
            Depending on your jurisdiction, you possess specific legal rights regarding personal data processing:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <strong className="text-slate-200">Right to Erasure:</strong>
              <p className="text-slate-400 mt-1">You can delete your temporary mailbox and all associated messages immediately at any time with one click.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <strong className="text-slate-200">Right to Object / Opt-Out:</strong>
              <p className="text-slate-400 mt-1">You can opt out of personalized cookies and analytics at any time via our Cookie Preferences or browser settings.</p>
            </div>
          </div>
        </section>

        {/* Section 8: Children's Privacy */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            8. Children's Online Privacy Protection
          </h2>
          <p className="text-xs text-slate-400">
            Our service is not directed at children under the age of 13 (or under 16 in the European Union). We do not knowingly collect personal identifying information from children. If you believe a child has submitted personal details through our contact form, please contact us immediately so we can remove the record.
          </p>
        </section>

        {/* Section 9: Contact Information */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            9. Privacy Inquiries & Contact Details
          </h2>
          <p className="text-xs text-slate-400">
            If you have any questions, requests, or concerns regarding this Privacy Policy or our data practices, please contact us directly at:
          </p>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-blue-400">
            Email: <a href="mailto:achrafelhrbiliachraf@gmail.com" className="hover:underline">achrafelhrbiliachraf@gmail.com</a>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <span>Go to Contact Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
