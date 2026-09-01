import React from 'react';
import { Shield, Lock, Trash2, Mail, CheckCircle2, ArrowRight, Server, EyeOff, AlertTriangle } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AdSlot } from '../components/AdSlot';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SeoHead
        title="About Us & Our Mission"
        description="Learn about TempMail Plus — our mission to protect personal privacy from inbox clutter, spam, and unsolicited trackers with fast, ephemeral temporary email addresses."
        canonicalPath="about"
        schemaType="AboutPage"
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          About TempMail Plus
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Protecting Your Inboxes, One Email at a Time
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          TempMail Plus is an independent, free, privacy-first temporary email service designed to keep your primary inbox clean, secure, and spam-free.
        </p>
      </div>

      {/* Primary Mission Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-blue-400" />
          Our Mission & Core Purpose
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          In today's interconnected digital landscape, almost every website, forum, online store, and download portal requires an email address before granting access. Unfortunately, providing your real, personal email frequently results in endless newsletters, promotional spam, data sharing with third-party brokers, and security risks in the event of database breaches.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          TempMail Plus was built to provide an instant, frictionless, disposable alternative. We believe privacy shouldn't require complex software installations or paid subscriptions. You can generate an anonymous temporary email address in one click, receive verification codes or activation links, and dispose of the mailbox when you are finished.
        </p>
      </div>

      {/* How It Operates */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <Server className="w-5 h-5 text-blue-400" />
          How Our Service Operates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
              <EyeOff className="w-4 h-4" />
              <span>Zero Registration Required</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never ask for your real name, phone number, password, or payment details. Anyone can access temporary mailboxes immediately.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <Trash2 className="w-4 h-4" />
              <span>Automatic Message Purging</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Temporary mailboxes feature live countdown timers. Once the timer elapses, or when you explicitly click "Delete", messages and account tokens are securely erased.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-Time Polling & Notifications</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our interface polls your active ephemeral inbox continuously, playing an optional audio chime as soon as new verification emails land.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <Shield className="w-4 h-4" />
              <span>Sanitized HTML Viewer</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Incoming email bodies are actively sanitized with rigorous security filters before rendering to prevent malicious tracking pixels and script injection.
            </p>
          </div>
        </div>
      </div>

      {/* Ad slot in content */}
      <AdSlot slotId="about-page-mid" format="horizontal" />

      {/* Important Usage Boundaries / What Temp Mail is NOT for */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          Responsible Use & Limitations
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Temporary email services are strictly designed for ephemeral, non-critical purposes (such as testing web applications, signing up for trial tools, or participating in public forums).
        </p>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>Never use for financial accounts or banking:</strong> If an account ever requires a password reset after your temporary address expires, you will permanently lose access.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>No Outgoing Email:</strong> To prevent abuse, spamming, and phishing, our service is strictly receive-only. You cannot send outgoing emails from temporary mailboxes.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 font-bold">•</span>
            <span><strong>External Service Acceptance:</strong> Some high-security platforms maintain lists of known disposable domains and may reject them during registration. This is standard industry behavior.</span>
          </li>
        </ul>
      </div>

      {/* Transparency & Contact */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-4">
        <h3 className="text-base font-bold text-white">Need to reach out to us?</h3>
        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          We welcome questions, security disclosures, and general feedback. You can reach out directly via email at{' '}
          <a
            href="mailto:achrafelhrbiliachraf@gmail.com"
            className="text-blue-400 hover:text-blue-300 font-mono underline underline-offset-2"
          >
            achrafelhrbiliachraf@gmail.com
          </a>{' '}
          or through our interactive contact form.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Open Contact Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Go to Temporary Mailbox
          </button>
        </div>
      </div>
    </div>
  );
};
