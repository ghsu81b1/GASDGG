import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { EmailAddressCard } from '../components/EmailAddressCard';
import { InboxView } from '../components/InboxView';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorks } from '../components/HowItWorks';
import { FaqSection } from '../components/FaqSection';
import { AdSlot } from '../components/AdSlot';
import { SeoHead } from '../components/SeoHead';
import { Shield, Lock, Trash2, Zap, HelpCircle, CheckCircle2, ArrowRight, EyeOff, Sparkles, Inbox } from 'lucide-react';

interface HomePageProps {
  onOpenNewModal: () => void;
  onOpenDeleteModal: () => void;
  onOpenQrModal: () => void;
  onOpenExtendModal: () => void;
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenNewModal,
  onOpenDeleteModal,
  onOpenQrModal,
  onOpenExtendModal,
  onNavigate,
}) => {
  return (
    <div className="space-y-10 pb-12">
      <SeoHead
        title="Disposable Temporary Email Service"
        description="Fast, secure, and free temporary disposable email addresses powered by Mail.tm. Receive verification codes, fight inbox spam, and protect your privacy."
        canonicalPath=""
        schemaType="WebApplication"
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Primary Application Workspace */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Main Email Address & Timer Controls */}
        <EmailAddressCard
          onOpenNewModal={onOpenNewModal}
          onOpenDeleteModal={onOpenDeleteModal}
          onOpenQrModal={onOpenQrModal}
          onOpenExtendModal={onOpenExtendModal}
        />

        {/* AdSlot between Generator and Inbox (strictly labeled & spaced) */}
        <AdSlot slotId="home-top-banner" format="horizontal" />

        {/* Real-time Polling Inbox */}
        <InboxView />
      </section>

      {/* Informative Value Section: What is Temporary Email & Why You Need It */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Complete Privacy Protection
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Why Use Disposable Temporary Email?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every time you sign up on an unfamiliar website, your primary email address is stored in corporate databases. TempMail Plus provides a disposable shield that prevents spam, data leaks, and intrusive tracking.
          </p>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Stop Promotional Spam</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never worry about unsubscribe links that don't work. Use a temporary mailbox for one-time registrations and keep your primary inbox spotless.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Shield Against Breaches</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If an obscure forum or service suffers a database hack, your real email address remains completely safe and unexposed.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Instant & Frictionless</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero registration forms, zero passwords, and zero verification delays. Addresses are generated instantly and receive incoming mail within seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Ad slot in content */}
      <AdSlot slotId="home-mid-banner" format="horizontal" />

      {/* How It Works interactive summary */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* Features overview */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* FAQ interactive accordion */}
      <div id="faq">
        <FaqSection />
      </div>

      {/* Learn More & Help Hub Bar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-start">
            <h3 className="text-lg font-bold text-white">Have questions about our service?</h3>
            <p className="text-xs text-slate-400">
              Read our full guides, check our FAQ, or get in touch with our team directly.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('faq')}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              Full FAQ
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
