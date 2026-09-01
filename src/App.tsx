import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { MailboxProvider, useMailbox } from './context/MailboxContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FaqPage } from './pages/FaqPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { NewAddressModal } from './components/NewAddressModal';
import { ExtendLifetimeModal } from './components/ExtendLifetimeModal';
import { QrCodeModal } from './components/QrCodeModal';
import { ConfirmModal } from './components/ConfirmModal';
import { EmailViewerModal } from './components/EmailViewerModal';
import { PrivacyTermsModal } from './components/PrivacyTermsModal';
import { Toast } from './components/Toast';
import { Mail, Clock, ArrowRight, Check } from 'lucide-react';

function MainAppContent() {
  const { session, messages, deleteMailbox } = useMailbox();

  // Page Routing State based on URL Hash
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (['how-it-works', 'faq', 'about', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer'].includes(hash)) {
        return hash;
      }
    }
    return 'home';
  });

  // Modals state
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete' | 'new';
  }>({
    isOpen: false,
    type: 'delete',
  });

  // Listen to hashchange events for browser forward/back buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
      if (['how-it-works', 'faq', 'about', 'contact', 'privacy', 'terms', 'cookies', 'disclaimer'].includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenNewModal = () => {
    if (messages.length > 0) {
      setConfirmModal({ isOpen: true, type: 'new' });
    } else {
      setIsNewAddressModalOpen(true);
    }
  };

  const handleOpenDeleteModal = () => {
    setConfirmModal({ isOpen: true, type: 'delete' });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.type === 'delete') {
      await deleteMailbox();
    } else if (confirmModal.type === 'new') {
      setIsNewAddressModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenNewModal={handleOpenNewModal}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* Floating Active Mailbox Notification Bar (Visible on non-home pages if mailbox active) */}
      {currentPage !== 'home' && session && (
        <div className="bg-blue-950/80 border-b border-blue-800/40 px-4 py-2.5 backdrop-blur-sm sticky top-16 z-30">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">Active Mailbox:</span>
              <span className="font-mono font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded border border-blue-500/30">
                {session.address}
              </span>
              {messages.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                </span>
              )}
            </div>

            <button
              onClick={() => navigateTo('home')}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>View Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onOpenNewModal={handleOpenNewModal}
            onOpenDeleteModal={handleOpenDeleteModal}
            onOpenQrModal={() => setIsQrModalOpen(true)}
            onOpenExtendModal={() => setIsExtendModalOpen(true)}
            onNavigate={navigateTo}
          />
        )}

        {currentPage === 'how-it-works' && <HowItWorksPage onNavigate={navigateTo} />}
        {currentPage === 'faq' && <FaqPage onNavigate={navigateTo} />}
        {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}
        {currentPage === 'contact' && <ContactPage onNavigate={navigateTo} />}
        {currentPage === 'privacy' && <PrivacyPage onNavigate={navigateTo} />}
        {currentPage === 'terms' && <TermsPage onNavigate={navigateTo} />}
        {currentPage === 'cookies' && <CookiePolicyPage onNavigate={navigateTo} />}
        {currentPage === 'disclaimer' && <DisclaimerPage onNavigate={navigateTo} />}
      </main>

      {/* Comprehensive Multi-Column Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
      />

      {/* GDPR / AdSense Cookie Consent Banner */}
      <CookieBanner onNavigate={navigateTo} />

      {/* Modals & Overlays */}
      <NewAddressModal
        isOpen={isNewAddressModalOpen}
        onClose={() => setIsNewAddressModalOpen(false)}
      />

      <ExtendLifetimeModal
        isOpen={isExtendModalOpen}
        onClose={() => setIsExtendModalOpen(false)}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      <PrivacyTermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
      />

      <EmailViewerModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MailboxProvider>
        <MainAppContent />
      </MailboxProvider>
    </LanguageProvider>
  );
}
