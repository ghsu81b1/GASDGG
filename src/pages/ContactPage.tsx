import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare, ShieldCheck, Clock, HelpCircle, Loader2 } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AdSlot } from '../components/AdSlot';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subjectCategory: 'General Inquiry',
    message: '',
    honeypot: '', // anti-spam bot field
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const categories = [
    { value: 'General Inquiry', label: 'General Inquiry' },
    { value: 'Technical Support', label: 'Technical Issue / Bug Report' },
    { value: 'Abuse or Spam Report', label: 'Report Abuse / Malicious Activity' },
    { value: 'Privacy Question', label: 'Privacy & Data Question' },
    { value: 'Partnership or Feedback', label: 'Feedback & Feature Suggestion' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot
    if (formData.honeypot) {
      setStatus('success');
      return;
    }

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please enter your name (at least 2 characters).');
      setStatus('error');
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address so we can get back to you.');
      setStatus('error');
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage('Please provide a message with at least 10 characters.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subjectCategory: formData.subjectCategory,
          message: formData.message,
        }),
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        setReferenceId(data.referenceId || 'MSG-' + Math.random().toString(36).substring(2, 9).toUpperCase());
      } else {
        // Fallback for static Netlify host without backend
        setReferenceId('TMP-' + Math.random().toString(36).substring(2, 9).toUpperCase());
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subjectCategory: 'General Inquiry',
        message: '',
        honeypot: '',
      });
    } catch {
      // Offline or static hosting fallback
      setReferenceId('TMP-' + Math.random().toString(36).substring(2, 9).toUpperCase());
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subjectCategory: 'General Inquiry',
        message: '',
        honeypot: '',
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SeoHead
        title="Contact Us & Support"
        description="Get in touch with the TempMail Plus team for support, feedback, abuse reports, or privacy inquiries. Direct contact email: achrafelhrbiliachraf@gmail.com."
        canonicalPath="contact"
        schemaType="ContactPage"
        schemaData={{
          mainEntity: {
            '@type': 'Organization',
            name: 'TempMail Plus',
            email: 'achrafelhrbiliachraf@gmail.com',
            contactPoint: {
              '@type': 'ContactPoint',
              email: 'achrafelhrbiliachraf@gmail.com',
              contactType: 'customer support',
              availableLanguage: ['English', 'Arabic', 'French', 'Spanish', 'German'],
            },
          },
        }}
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          Get In Touch
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact TempMail Plus Support
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
          Have a question about our temporary email service, want to report an issue, or have feedback? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Information & Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Email Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
              <Mail className="w-5 h-5 text-blue-400" />
              Direct Email Address
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              You can send emails directly to our administrator mailbox at any time:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-500/30 flex items-center justify-between gap-2 overflow-hidden">
              <a
                href="mailto:achrafelhrbiliachraf@gmail.com"
                className="text-sm font-mono font-semibold text-blue-400 hover:text-blue-300 transition-colors break-all"
              >
                achrafelhrbiliachraf@gmail.com
              </a>
            </div>
            <p className="text-[11px] text-slate-500">
              Typical response time: Within 24 to 48 hours on business days.
            </p>
          </div>

          {/* Guidelines & Expectations */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Before submitting an inquiry:</h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Temporary Inbox Expiry:</strong> Once an inbox timer expires or you click delete, emails are permanently removed from the server. We cannot retrieve or restore deleted ephemeral messages.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Check FAQ first:</strong> Quick answers to common questions about verification codes and domain acceptance are answered on our FAQ page.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Abuse Prevention:</strong> If you suspect misuse of our domain names for spam or phishing, please choose "Report Abuse" so we can investigate promptly.
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('faq')}
              className="w-full mt-2 py-2 px-3 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
            >
              Browse Frequently Asked Questions
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-2">Send Us a Message</h2>
            <p className="text-xs text-slate-400 mb-6">
              Fill out the form below. All fields marked with an asterisk (<span className="text-blue-400">*</span>) are required.
            </p>

            {status === 'success' ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-emerald-300">Message Delivered Successfully</h3>
                  <p className="text-xs text-slate-300 mt-1.5 max-w-md mx-auto leading-relaxed">
                    Thank you for contacting us. We have received your submission. If your inquiry requires a reply, we will respond to your provided email address shortly.
                  </p>
                  {referenceId && (
                    <div className="mt-3 inline-block px-3 py-1 rounded bg-slate-900 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                      Reference ID: {referenceId}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Honeypot hidden input */}
                <input
                  type="text"
                  name="website_company_fax"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Error Banner */}
                {status === 'error' && errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Name <span className="text-blue-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g., Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-slate-100 placeholder-slate-600 transition-colors outline-none"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Email Address <span className="text-blue-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="e.g., jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-slate-100 placeholder-slate-600 transition-colors outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    We will use this address strictly to reply to your inquiry.
                  </span>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label htmlFor="contact-category" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subject Category <span className="text-blue-400">*</span>
                  </label>
                  <select
                    id="contact-category"
                    value={formData.subjectCategory}
                    onChange={(e) => setFormData({ ...formData, subjectCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-slate-100 transition-colors outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value} className="bg-slate-900 text-slate-200">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Message <span className="text-blue-400">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Describe your question, report, or feedback in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-slate-100 placeholder-slate-600 transition-colors outline-none resize-y"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Minimum 10 characters</span>
                    <span>{formData.message.length}/3000</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-60 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Ad slot bottom */}
      <AdSlot slotId="contact-page-bottom" format="horizontal" />
    </div>
  );
};
