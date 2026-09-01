import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MailboxSession, EmailMessageSummary, EmailMessageDetail, MailboxDomain } from '../types';
import { api, ApiError } from '../services/api';

interface MailboxContextType {
  session: MailboxSession | null;
  messages: EmailMessageSummary[];
  selectedMessage: EmailMessageDetail | null;
  domains: MailboxDomain[];
  isLoadingDomains: boolean;
  isCreating: boolean;
  isLoadingMessages: boolean;
  isLoadingDetail: boolean;
  isExtending: boolean;
  isExpired: boolean;
  soundEnabled: boolean;
  error: string | null;
  newEmailNotification: EmailMessageSummary | null;
  toggleSound: () => void;
  createMailbox: (durationMinutes?: number, customUsername?: string, domain?: string) => Promise<void>;
  refreshInbox: () => Promise<void>;
  extendLifetime: (addMinutes: number) => Promise<void>;
  deleteMailbox: () => Promise<void>;
  selectMessage: (messageId: string) => Promise<void>;
  clearSelectedMessage: () => void;
  deleteMessage: (messageId: string) => Promise<void>;
  clearNotification: () => void;
}

const MailboxContext = createContext<MailboxContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'tempmail_plus_session_id';
const SOUND_STORAGE_KEY = 'tempmail_plus_sound';

export const MailboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<MailboxSession | null>(null);
  const [messages, setMessages] = useState<EmailMessageSummary[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessageDetail | null>(null);
  const [domains, setDomains] = useState<MailboxDomain[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newEmailNotification, setNewEmailNotification] = useState<EmailMessageSummary | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SOUND_STORAGE_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  const pollingTimerRef = useRef<any>(null);
  const previousMessageIdsRef = useRef<Set<string>>(new Set());

  // Subtle Web Audio notification chime
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880.0, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio not permitted without interaction
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Load available Mail.tm domains
  const loadDomains = useCallback(async () => {
    try {
      setIsLoadingDomains(true);
      const fetchedDomains = await api.getDomains();
      setDomains(fetchedDomains);
    } catch (err: any) {
      console.warn('Could not fetch domains:', err.message);
    } finally {
      setIsLoadingDomains(false);
    }
  }, []);

  // Fetch messages for active session
  const fetchInbox = useCallback(
    async (sessionId: string, isManual = false) => {
      if (!sessionId || isExpired) return;

      if (isManual) {
        setIsLoadingMessages(true);
      }

      try {
        const res = await api.getMessages(sessionId);
        const newMessages = res.messages || [];

        // Check for newly arrived messages
        const prevIds = previousMessageIdsRef.current;
        const brandNew = newMessages.filter((m) => !prevIds.has(m.id));

        if (prevIds.size > 0 && brandNew.length > 0) {
          playChime();
          setNewEmailNotification(brandNew[0]);
        }

        previousMessageIdsRef.current = new Set(newMessages.map((m) => m.id));
        setMessages(newMessages);

        // Update expiresAt if received from server
        if (res.expiresAt && session) {
          setSession((prev) => (prev ? { ...prev, expiresAt: res.expiresAt } : null));
        }
      } catch (err: any) {
        if (err.statusCode === 404 || err.code === 'SESSION_EXPIRED') {
          setIsExpired(true);
        } else if (isManual) {
          setError(err.message || 'Failed to refresh inbox');
        }
      } finally {
        if (isManual) {
          setIsLoadingMessages(false);
        }
      }
    },
    [isExpired, playChime, session]
  );

  // Create temporary mailbox
  const createMailbox = useCallback(
    async (durationMinutes: number = 60, customUsername?: string, domain?: string) => {
      try {
        setIsCreating(true);
        setError(null);
        setIsExpired(false);
        setSelectedMessage(null);
        previousMessageIdsRef.current.clear();

        const newSession = await api.createMailbox({
          durationMinutes,
          customUsername,
          domain,
        });

        setSession(newSession);
        setMessages([]);
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, newSession.sessionId);
        } catch {
          // Ignore
        }

        // Immediately fetch inbox for new session
        await fetchInbox(newSession.sessionId, false);
      } catch (err: any) {
        setError(err.message || 'Failed to generate temporary email address');
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [fetchInbox]
  );

  // Extend active session lifetime
  const extendLifetime = useCallback(
    async (addMinutes: number) => {
      if (!session) return;
      try {
        setIsExtending(true);
        setError(null);
        const updated = await api.extendLifetime(session.sessionId, addMinutes);
        setSession(updated);
        setIsExpired(false);
      } catch (err: any) {
        setError(err.message || 'Failed to extend session lifetime');
        throw err;
      } finally {
        setIsExtending(false);
      }
    },
    [session]
  );

  // Delete entire mailbox
  const deleteMailbox = useCallback(async () => {
    if (!session) return;
    try {
      await api.deleteMailbox(session.sessionId);
    } catch {
      // Ignore
    } finally {
      setSession(null);
      setMessages([]);
      setSelectedMessage(null);
      previousMessageIdsRef.current.clear();
      setIsExpired(false);
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  }, [session]);

  // Select and read a message
  const selectMessage = useCallback(
    async (messageId: string) => {
      if (!session) return;
      try {
        setIsLoadingDetail(true);
        setError(null);
        const detail = await api.getMessageDetail(session.sessionId, messageId);
        setSelectedMessage(detail);

        // Mark as seen locally
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, seen: true } : m))
        );
      } catch (err: any) {
        setError(err.message || 'Failed to load email message');
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [session]
  );

  const clearSelectedMessage = () => {
    setSelectedMessage(null);
  };

  // Delete single message
  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!session) return;
      try {
        await api.deleteMessage(session.sessionId, messageId);
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(null);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete message');
      }
    },
    [session, selectedMessage]
  );

  const refreshInbox = useCallback(async () => {
    if (session) {
      await fetchInbox(session.sessionId, true);
    }
  }, [session, fetchInbox]);

  const clearNotification = () => {
    setNewEmailNotification(null);
  };

  // Initial load: restore session from storage or create fresh immediately
  useEffect(() => {
    loadDomains();

    const init = async () => {
      let savedSessionId: string | null = null;
      try {
        savedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);
      } catch {
        // Ignore
      }

      if (savedSessionId) {
        try {
          const restoredSession = await api.getSession(savedSessionId);
          if (restoredSession && Date.now() < restoredSession.expiresAt) {
            setSession(restoredSession);
            await fetchInbox(restoredSession.sessionId, false);
            return;
          }
        } catch {
          // Session expired or invalid on server, fall through to create new
        }
      }

      // Default: create a new disposable email immediately with 1 hour duration
      try {
        await createMailbox(60);
      } catch {
        // Will show error in UI with manual retry button
      }
    };

    init();
  }, [loadDomains]);

  // Polling loop: check for new messages every 6 seconds
  useEffect(() => {
    if (!session || isExpired) {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
      return;
    }

    pollingTimerRef.current = setInterval(() => {
      // Verify client-side expiration
      if (Date.now() >= session.expiresAt) {
        setIsExpired(true);
        clearInterval(pollingTimerRef.current);
        return;
      }
      fetchInbox(session.sessionId, false);
    }, 6000);

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [session, isExpired, fetchInbox]);

  return (
    <MailboxContext.Provider
      value={{
        session,
        messages,
        selectedMessage,
        domains,
        isLoadingDomains,
        isCreating,
        isLoadingMessages,
        isLoadingDetail,
        isExtending,
        isExpired,
        soundEnabled,
        error,
        newEmailNotification,
        toggleSound,
        createMailbox,
        refreshInbox,
        extendLifetime,
        deleteMailbox,
        selectMessage,
        clearSelectedMessage,
        deleteMessage,
        clearNotification,
      }}
    >
      {children}
    </MailboxContext.Provider>
  );
};

export function useMailbox(): MailboxContextType {
  const context = useContext(MailboxContext);
  if (!context) {
    throw new Error('useMailbox must be used within a MailboxProvider');
  }
  return context;
}
