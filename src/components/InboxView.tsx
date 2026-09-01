import React from 'react';
import {
  Inbox,
  RefreshCw,
  Mail,
  MailOpen,
  Paperclip,
  Trash2,
  Clock,
  Radio,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMailbox } from '../context/MailboxContext';
import { formatRelativeTime } from '../utils/time';
import { EmailMessageSummary } from '../types';

export const InboxView: React.FC = () => {
  const { language, isRtl, t } = useLanguage();
  const {
    messages,
    isLoadingMessages,
    refreshInbox,
    selectMessage,
    deleteMessage,
    isExpired,
  } = useMailbox();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-sm">
      {/* Inbox Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {t('inbox.title')}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-extrabold">
                {messages.length} {t('inbox.messagesCount')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
              {t('inbox.subtitle')}
            </p>
          </div>
        </div>

        {/* Polling indicator & Manual Refresh */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-medium text-slate-300">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>{t('inbox.autoRefresh')}</span>
          </div>

          <button
            onClick={() => refreshInbox()}
            disabled={isLoadingMessages || isExpired}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-blue-400 ${isLoadingMessages ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:inline">{t('emailCard.refresh')}</span>
          </button>
        </div>
      </div>

      {/* Messages List or Empty State */}
      <div className="mt-4">
        {messages.length === 0 ? (
          /* Empty State */
          <div className="py-12 sm:py-16 text-center px-4">
            <div className="relative w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-400 animate-pulse" />
              <span className="absolute -top-1 -end-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {t('inbox.emptyTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
              {t('inbox.emptyDesc')}
            </p>
          </div>
        ) : (
          /* Message List Items */
          <div className="divide-y divide-slate-800/80">
            {messages.map((msg: EmailMessageSummary) => {
              const isUnread = !msg.seen;
              return (
                <div
                  key={msg.id}
                  onClick={() => selectMessage(msg.id)}
                  className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl transition-all cursor-pointer ${
                    isUnread
                      ? 'bg-blue-950/20 hover:bg-blue-900/30 border-s-4 border-blue-500'
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    {/* Status Icon */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isUnread
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isUnread ? (
                        <Mail className="w-4 h-4" />
                      ) : (
                        <MailOpen className="w-4 h-4" />
                      )}
                    </div>

                    {/* Sender & Subject details */}
                    <div className="min-w-0 flex-1 pe-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs sm:text-sm truncate ${
                            isUnread ? 'font-bold text-white' : 'font-semibold text-slate-300'
                          }`}
                        >
                          {msg.from.name || msg.from.address}
                        </span>
                        {isUnread && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                            {t('inbox.unread')}
                          </span>
                        )}
                        {msg.hasAttachments && (
                          <span className="flex items-center gap-0.5 text-slate-400" title="Has attachment">
                            <Paperclip className="w-3 h-3" />
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5">
                        <p
                          className={`text-xs sm:text-sm truncate ${
                            isUnread ? 'text-slate-200 font-medium' : 'text-slate-400'
                          }`}
                        >
                          {msg.subject || t('inbox.noSubject')}
                        </p>
                        {msg.intro && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {msg.intro}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Time & Quick Delete */}
                  <div className="flex items-center gap-3 shrink-0 ms-2">
                    <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{formatRelativeTime(msg.createdAt, language)}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(msg.id);
                      }}
                      title={t('viewer.deleteMessage')}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
