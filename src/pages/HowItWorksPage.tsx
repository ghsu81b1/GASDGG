import React from 'react';
import { Mail, Clock, RefreshCw, Copy, Shield, Trash2, ArrowRight, Zap, CheckCircle2, AlertOctagon } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AdSlot } from '../components/AdSlot';

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Generate or Customize Your Address',
      icon: Mail,
      description:
        'When you open TempMail Plus, a unique temporary email address is automatically generated for you on an active domain. You can also customize your username prefix and pick any available domain from the active list, choosing durations from 10 minutes to 24 hours.',
      details: [
        'No signup, passwords, or personal credentials needed.',
        'Choose from dynamically retrieved Mail.tm domains.',
        'Set custom expiration countdowns (10m, 60m, 24h).',
      ],
    },
    {
      number: '02',
      title: 'Copy & Paste into the Target Website',
      icon: Copy,
      description:
        'Click the Copy button or scan the generated QR code on mobile. Paste your temporary email address into any website, app signup form, download gate, or forum registration.',
      details: [
        'Single-click copy to clipboard with immediate feedback.',
        'QR Code scanning allows instant transfer to your phone or tablet.',
        'Keeps your personal inbox completely isolated from marketing tracking.',
      ],
    },
    {
      number: '03',
      title: 'Receive & Read Emails in Real-Time',
      icon: RefreshCw,
      description:
        'Incoming messages arrive in seconds. Our system automatically polls the inbox every few seconds. When an email arrives, an optional audio chime alerts you, and the email is displayed in your clean inbox list.',
      details: [
        'Instant message previews with sender, subject, and timestamp.',
        'Full HTML/plain text viewer with security sanitization.',
        'Direct download support for email attachments.',
      ],
    },
    {
      number: '04',
      title: 'Extend Lifetime or Delete Instantly',
      icon: Trash2,
      description:
        'Need more time to receive a delayed verification code? Click "Extend" to add 60 minutes or 24 hours to your session. Done with your task? Click "Delete" to purge the mailbox and its contents immediately.',
      details: [
        'Live countdown timer ensures full transparency.',
        'One-click extension keeps the mailbox active as long as needed.',
        'Immediate manual deletion removes the inbox permanently.',
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <SeoHead
        title="How It Works - Step-by-Step Guide"
        description="Detailed guide on how temporary email works: generate disposable addresses, receive verification codes instantly, extend lifetimes, and protect your privacy."
        canonicalPath="how-it-works"
        schemaType="WebPage"
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          Complete Walkthrough
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How TempMail Plus Works
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Understand how disposable email addresses function, why they protect your online identity, and how to get the most out of your ephemeral inboxes.
        </p>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4 hover:border-slate-700/80 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
                      Step {step.number}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                      {step.title}
                    </h2>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {step.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {step.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ad slot in content */}
      <AdSlot slotId="how-it-works-mid" format="horizontal" />

      {/* Best Practices vs Misuse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recommended Use Cases */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Recommended Use Cases
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Free Software & Trials:</strong> Signing up for software trials or gated whitepapers without getting on permanent promotional lists.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Testing & Development:</strong> Software engineers testing user registration flows and email delivery in test environments.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>Public Wi-Fi Portals:</strong> Accessing coffee shop, airport, or hotel captive portals that ask for an email to connect.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span><strong>One-Time Downloads:</strong> Obtaining coupons, guides, or files from sites requiring email verification.</span>
            </li>
          </ul>
        </div>

        {/* When NOT to use */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6 space-y-3">
          <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5" />
            When NOT to Use Temp Mail
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span><strong>Banking & Financial Services:</strong> Financial institutions require long-term identity verification and password recovery.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span><strong>Primary Social Media Accounts:</strong> If you lose account access, password resets will be permanently unreachable.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span><strong>Government & Legal Documents:</strong> Official agencies need durable contact channels.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">✗</span>
              <span><strong>E-commerce Order Tracking:</strong> For expensive purchases where you need shipping updates or warranty receipts.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Call to action */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Ready to create a secure temporary inbox?</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Start receiving emails immediately with zero registration.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all"
        >
          <span>Go to Temporary Inbox</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
