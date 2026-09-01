import React, { useState } from 'react';
import {
  ArrowLeft,
  Trash2,
  Printer,
  Download,
  Paperclip,
  ShieldCheck,
  Code,
  FileText,
  Eye,
  Loader2,
  Calendar,
  User,
  Send,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMailbox } from '../context/MailboxContext';
import { sanitizeEmailHtml, formatPlainTextEmail } from '../utils/sanitize';
import { formatFullDate } from '../utils/time';

export const EmailViewerModal: React.FC = () => {
  const { language, isRtl, t } = useLanguage();
  const {
    selectedMessage,
    clearSelectedMessage,
    deleteMessage,
    isLoadingDetail,
  } = useMailbox();

  const [viewMode, setViewMode] = useState<'html' | 'text' | 'raw'>('html');
  const [isDeleting, setIsDeleting] = useState(false);

  if (!selectedMessage && !isLoadingDetail) {
    return null;
  }

  const handleDelete = async () => {
    if (!selectedMessage) return;
    setIsDeleting(true);
    try {
      await deleteMessage(selectedMessage.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!selectedMessage) return;
    const content = `From: ${selectedMessage.from.name ? `${selectedMessage.from.name} <${selectedMessage.from.address}>` : selectedMessage.from.address}
To: ${selectedMessage.to.map((t) => t.address).join(', ')}
Date: ${selectedMessage.createdAt}
Subject: ${selectedMessage.subject || 'No Subject'}

${selectedMessage.text || (selectedMessage.html ? selectedMessage.html.join('\n') : '')}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-${selectedMessage.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const htmlContent =
    selectedMessage?.html && selectedMessage.html.length > 0
      ? selectedMessage.html.join('\n')
      : '';
  const sanitizedHtml = sanitizeEmailHtml(htmlContent);
  const plainContent = selectedMessage?.text || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {isLoadingDetail ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading message details...</p>
          </div>
        ) : selectedMessage ? (
          <>
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
              <button
                onClick={clearSelectedMessage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                <span>{t('viewer.back')}</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={handlePrint}
                  title={t('viewer.print')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDownload}
                  title={t('viewer.download')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  title={t('viewer.deleteMessage')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">
                    {isDeleting ? t('viewer.deleting') : t('viewer.deleteMessage')}
                  </span>
                </button>
              </div>
            </div>

            {/* Email Header Details */}
            <div className="p-4 sm:p-6 bg-slate-900/50 border-b border-slate-800 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {selectedMessage.subject || t('inbox.noSubject')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="text-slate-400">{t('viewer.from')}:</span>
                  <span className="font-semibold text-white truncate">
                    {selectedMessage.from.name
                      ? `${selectedMessage.from.name} <${selectedMessage.from.address}>`
                      : selectedMessage.from.address}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-slate-400">{t('viewer.to')}:</span>
                  <span className="font-mono text-slate-300 truncate">
                    {selectedMessage.to.map((t) => t.address).join(', ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-400">{t('viewer.date')}:</span>
                  <span>{formatFullDate(selectedMessage.createdAt, language)}</span>
                </div>
              </div>

              {/* View Switcher Tabs & Sanitization Warning */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  {htmlContent && (
                    <button
                      onClick={() => setViewMode('html')}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        viewMode === 'html'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('viewer.viewHtml')}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setViewMode('text')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'text' || !htmlContent
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{t('viewer.viewText')}</span>
                  </button>

                  <button
                    onClick={() => setViewMode('raw')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'raw'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>{t('viewer.viewRaw')}</span>
                  </button>
                </div>

                {viewMode === 'html' && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('viewer.sanitizedNotice')}</span>
                    <span className="sm:hidden">Sanitized HTML</span>
                  </div>
                )}
              </div>
            </div>

            {/* Attachments Section if present */}
            {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
              <div className="p-3 sm:p-4 bg-slate-950/70 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('viewer.attachments')} ({selectedMessage.attachments.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMessage.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
                    >
                      <span className="font-medium truncate max-w-[180px]">{att.filename}</span>
                      <span className="text-[10px] text-slate-400">({Math.round(att.size / 1024)} KB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Body Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950 text-slate-200 min-h-[250px]">
              {viewMode === 'html' && htmlContent ? (
                <div
                  className="prose prose-invert max-w-none text-slate-200 email-html-container overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
              ) : viewMode === 'text' || (!htmlContent && viewMode === 'html') ? (
                <div
                  className="font-sans text-sm leading-relaxed whitespace-pre-wrap text-slate-200"
                  dangerouslySetInnerHTML={{
                    __html: formatPlainTextEmail(plainContent || 'No message content available.'),
                  }}
                />
              ) : (
                <pre className="font-mono text-xs text-slate-400 whitespace-pre-wrap overflow-x-auto bg-slate-900 p-4 rounded-xl border border-slate-800">
                  {JSON.stringify(selectedMessage, null, 2)}
                </pre>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
