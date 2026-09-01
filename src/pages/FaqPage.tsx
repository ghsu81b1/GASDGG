import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search, ArrowRight, ShieldCheck, Mail, Zap } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { AdSlot } from '../components/AdSlot';

interface FaqPageProps {
  onNavigate: (page: string) => void;
}

interface FaqItemData {
  id: string;
  category: 'General' | 'Features & Usage' | 'Privacy & Security' | 'Troubleshooting';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItemData[] = [
  {
    id: 'what-is-temp-mail',
    category: 'General',
    question: 'What is a temporary email address?',
    answer:
      'A temporary email (also known as disposable email, temp mail, or throwaway email) is a short-lived inbox that allows you to receive emails without exposing your personal or business email address. It is automatically created on demand and self-destructs after a predetermined period or when you manually delete it.',
  },
  {
    id: 'how-does-it-work',
    category: 'General',
    question: 'How does TempMail Plus work?',
    answer:
      'TempMail Plus dynamically provisions an ephemeral mailbox on active domain servers via the Mail.tm protocol. When someone sends an email to your temporary address, our system receives the message and displays it in your browser inbox in real-time. Once the timer expires, the mailbox and all associated messages are deleted permanently.',
  },
  {
    id: 'is-it-free',
    category: 'General',
    question: 'Is TempMail Plus completely free to use?',
    answer:
      'Yes, TempMail Plus is 100% free with no hidden charges, trial periods, or subscription walls. We support the infrastructure through clean, non-intrusive advertisements.',
  },
  {
    id: 'do-i-need-to-register',
    category: 'General',
    question: 'Do I need to sign up or create an account to use this service?',
    answer:
      'No. You do not need to register, create a password, or submit any personal information. You get instant access to an active mailbox immediately upon visiting the website.',
  },
  {
    id: 'how-to-copy-and-use',
    category: 'Features & Usage',
    question: 'How do I copy and use my temporary email address?',
    answer:
      'Simply click the "Copy" button on the main email card to copy the address to your clipboard. Alternatively, you can click "QR Code" to scan and open the address directly on a mobile phone or tablet.',
  },
  {
    id: 'inbox-refresh-rate',
    category: 'Features & Usage',
    question: 'How often does the inbox refresh for new messages?',
    answer:
      'Our application automatically polls the server every few seconds in the background. You can also click the "Refresh" button at any time to force an immediate check. If you have sound enabled, an audio chime will notify you when a new email arrives.',
  },
  {
    id: 'how-long-does-it-last',
    category: 'Features & Usage',
    question: 'How long does a temporary email address last?',
    answer:
      'By default, you can choose mailbox lifetimes of 10 minutes, 60 minutes, or 24 hours. A live countdown timer is visible at all times. If you need more time, you can click "Extend" before the timer expires to add extra time to your session.',
  },
  {
    id: 'can-i-send-emails',
    category: 'Features & Usage',
    question: 'Can I send outgoing emails or reply to messages?',
    answer:
      'No. TempMail Plus is strictly a receive-only email service. Outgoing email capabilities are disabled to prevent spamming, harassment, phishing, and abuse of our shared domain names.',
  },
  {
    id: 'can-i-recover-expired',
    category: 'Privacy & Security',
    question: 'Can I recover an expired or deleted mailbox?',
    answer:
      'No. For security and privacy reasons, once a temporary mailbox expires or is manually deleted, all tokens, messages, and attachments are permanently erased from the server. They cannot be recovered by you or by our support team.',
  },
  {
    id: 'is-temp-mail-safe',
    category: 'Privacy & Security',
    question: 'Is temporary email safe and secure?',
    answer:
      'Yes, temporary email is an effective tool to protect your primary inbox from data breaches, unwanted marketing newsletters, spam, and cross-site tracking. Furthermore, all HTML emails rendered in TempMail Plus are actively sanitized to strip malicious JavaScript and tracking pixels.',
  },
  {
    id: 'why-email-not-received',
    category: 'Troubleshooting',
    question: "Why didn't I receive an expected email or verification code?",
    answer:
      'Most emails arrive within 5 to 30 seconds. However, delays can occur if the sender’s mail server is experiencing queue congestion or rate limits. Also, check that you copied the exact address. If an email has not arrived after a few minutes, click the manual Refresh button or try generating a new address with a different domain name.',
  },
  {
    id: 'why-website-rejected',
    category: 'Troubleshooting',
    question: 'Why did a third-party website reject my temporary email address?',
    answer:
      'Certain high-security platforms (such as banks, government portals, or strict social networks) maintain blocklists of known disposable email domains. If a website rejects a specific domain, try creating a new address using one of our other available domains from the dropdown list.',
  },
  {
    id: 'can-i-use-for-important-accounts',
    category: 'Privacy & Security',
    question: 'Can I use temporary email for important or permanent accounts?',
    answer:
      'We strongly advise against using temporary email for critical services like banking, government portals, or primary social accounts. Because disposable inboxes expire permanently, you will not be able to receive future password resets or security alerts for those accounts.',
  },
  {
    id: 'what-happens-on-delete',
    category: 'Privacy & Security',
    question: 'What happens when I click the "Delete" button?',
    answer:
      'When you delete a mailbox, the session authentication token is immediately invalidated and the server purges all associated messages and inbox records. A new, clean temporary address will be generated for your next session.',
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'what-is-temp-mail': true,
    'how-does-it-work': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = ['All', 'General', 'Features & Usage', 'Privacy & Security', 'Troubleshooting'];

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SeoHead
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about TempMail Plus: how temporary email works, lifetime extensions, security, message delivery, and troubleshooting."
        canonicalPath="faq"
        schemaType="FAQPage"
        schemaData={{
          mainEntity: FAQ_ITEMS.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }}
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          Help & Answers
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about TempMail Plus disposable temporary email addresses.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-500 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. 'verification code', 'expiration', 'safety')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-11 pe-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-slate-100 placeholder-slate-500 transition-colors outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/40 text-slate-400 space-y-2">
            <p className="text-sm">No matching questions found for "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs text-blue-400 hover:underline"
            >
              Reset search filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOpen = openItems[item.id] || false;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-start flex items-center justify-between gap-4 select-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-200">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Ad slot */}
      <AdSlot slotId="faq-page-mid" format="horizontal" />

      {/* Still need help? */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-white">Still have questions?</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          If your question was not answered here, please feel free to reach out to our team directly.
        </p>
        <div className="pt-1">
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all inline-flex items-center gap-1.5"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
