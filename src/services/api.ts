import {
  MailboxDomain,
  MailboxSession,
  EmailMessageSummary,
  EmailMessageDetail,
} from '../types';

export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

const MAILTM_DIRECT_URL = 'https://api.mail.tm';
const CLIENT_STORAGE_PREFIX = 'tempmail_client_session_';

interface StoredClientSession {
  sessionId: string;
  address: string;
  domain: string;
  username: string;
  createdAt: number;
  expiresAt: number;
  durationMinutes: number;
  token: string;
  accountId: string;
  password?: string;
}

function getStoredClientSession(sessionId: string): StoredClientSession | null {
  try {
    const raw = localStorage.getItem(CLIENT_STORAGE_PREFIX + sessionId);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveStoredClientSession(session: StoredClientSession) {
  try {
    localStorage.setItem(CLIENT_STORAGE_PREFIX + session.sessionId, JSON.stringify(session));
  } catch {
    // Ignore
  }
}

function removeStoredClientSession(sessionId: string) {
  try {
    localStorage.removeItem(CLIENT_STORAGE_PREFIX + sessionId);
  } catch {
    // Ignore
  }
}

function generateRandomString(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

// Direct Mail.tm Fetch Helper
async function fetchMailtmDirect<T>(
  endpoint: string,
  options: {
    method?: string;
    token?: string;
    body?: any;
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(`${MAILTM_DIRECT_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 204) {
    return {} as T;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data && (data['hydra:description'] || data.message || data.error)) ||
      `Mail.tm API error (${res.status})`;
    throw new ApiError(msg, res.status);
  }

  return data as T;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      data.error || `Request failed with status ${res.status}`,
      res.status,
      data.code
    );
  }
  return data as T;
}

export const api = {
  /**
   * Fetch list of active Mail.tm domains
   */
  async getDomains(): Promise<MailboxDomain[]> {
    try {
      const res = await fetch('/api/domains');
      if (res.ok) {
        const data = await handleResponse<{ domains: MailboxDomain[] }>(res);
        if (data.domains && data.domains.length > 0) {
          return data.domains;
        }
      }
    } catch {
      // Fallback to direct client call
    }

    // Direct client fallback for Netlify static deployment
    const directData = await fetchMailtmDirect<any>('/domains?page=1');
    const list = Array.isArray(directData)
      ? directData
      : (directData && directData['hydra:member']) || [];
    return list.filter((d: any) => d.isActive !== false);
  },

  /**
   * Create a new temporary mailbox session
   */
  async createMailbox(params: {
    durationMinutes: number;
    customUsername?: string;
    domain?: string;
  }): Promise<MailboxSession> {
    try {
      const res = await fetch('/api/mailbox/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        return await handleResponse<MailboxSession>(res);
      }
    } catch {
      // Fallback to direct client creation
    }

    // Direct client fallback
    let domainName = params.domain;
    if (!domainName) {
      const domains = await this.getDomains();
      if (!domains || domains.length === 0) {
        throw new ApiError('No active domains available', 503);
      }
      domainName = domains[0].domain;
    }

    const username = (params.customUsername || generateRandomString(10)).toLowerCase().trim();
    const address = `${username}@${domainName}`;
    const password = generateRandomString(16) + 'Aa1!';

    // 1. Create account
    const acc = await fetchMailtmDirect<{ id: string; address: string }>('/accounts', {
      method: 'POST',
      body: { address, password },
    });

    // 2. Obtain Token
    const tok = await fetchMailtmDirect<{ token: string; id: string }>('/token', {
      method: 'POST',
      body: { address, password },
    });

    const sessionId = generateRandomString(24);
    const now = Date.now();
    const durationMinutes = params.durationMinutes || 60;
    const expiresAt = now + durationMinutes * 60 * 1000;

    const clientSession: StoredClientSession = {
      sessionId,
      address,
      domain: domainName,
      username,
      createdAt: now,
      expiresAt,
      durationMinutes,
      token: tok.token,
      accountId: acc.id,
      password,
    };

    saveStoredClientSession(clientSession);

    return {
      sessionId: clientSession.sessionId,
      address: clientSession.address,
      domain: clientSession.domain,
      username: clientSession.username,
      createdAt: clientSession.createdAt,
      expiresAt: clientSession.expiresAt,
      durationMinutes: clientSession.durationMinutes,
    };
  },

  /**
   * Validate existing session
   */
  async getSession(sessionId: string): Promise<MailboxSession> {
    try {
      const res = await fetch(`/api/mailbox/session/${encodeURIComponent(sessionId)}`);
      if (res.ok) {
        return await handleResponse<MailboxSession>(res);
      }
    } catch {
      // Fallback
    }

    const stored = getStoredClientSession(sessionId);
    if (!stored) {
      throw new ApiError('Session not found', 404, 'SESSION_EXPIRED');
    }

    if (Date.now() >= stored.expiresAt) {
      removeStoredClientSession(sessionId);
      throw new ApiError('Session expired', 404, 'SESSION_EXPIRED');
    }

    return {
      sessionId: stored.sessionId,
      address: stored.address,
      domain: stored.domain,
      username: stored.username,
      createdAt: stored.createdAt,
      expiresAt: stored.expiresAt,
      durationMinutes: stored.durationMinutes,
    };
  },

  /**
   * Extend active mailbox lifetime
   */
  async extendLifetime(sessionId: string, addMinutes: number): Promise<MailboxSession> {
    try {
      const res = await fetch('/api/mailbox/extend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, addMinutes }),
      });
      if (res.ok) {
        return await handleResponse<MailboxSession>(res);
      }
    } catch {
      // Fallback
    }

    const stored = getStoredClientSession(sessionId);
    if (!stored) {
      throw new ApiError('Session not found', 404, 'SESSION_EXPIRED');
    }

    const maxLifetime = 7 * 24 * 60 * 60 * 1000; // 7 days max
    const newExpiresAt = Math.min(
      Date.now() + addMinutes * 60 * 1000,
      stored.createdAt + maxLifetime
    );

    stored.expiresAt = newExpiresAt;
    stored.durationMinutes += addMinutes;
    saveStoredClientSession(stored);

    return {
      sessionId: stored.sessionId,
      address: stored.address,
      domain: stored.domain,
      username: stored.username,
      createdAt: stored.createdAt,
      expiresAt: stored.expiresAt,
      durationMinutes: stored.durationMinutes,
    };
  },

  /**
   * Fetch incoming messages for active session
   */
  async getMessages(sessionId: string): Promise<{
    messages: EmailMessageSummary[];
    total: number;
    address: string;
    expiresAt: number;
  }> {
    try {
      const res = await fetch(`/api/mailbox/${encodeURIComponent(sessionId)}/messages`);
      if (res.ok) {
        return await handleResponse<{
          messages: EmailMessageSummary[];
          total: number;
          address: string;
          expiresAt: number;
        }>(res);
      }
    } catch {
      // Fallback
    }

    const stored = getStoredClientSession(sessionId);
    if (!stored) {
      throw new ApiError('Session not found', 404, 'SESSION_EXPIRED');
    }

    if (Date.now() >= stored.expiresAt) {
      throw new ApiError('Session expired', 404, 'SESSION_EXPIRED');
    }

    const messagesData = await fetchMailtmDirect<any>('/messages?page=1', {
      token: stored.token,
    });

    const list: EmailMessageSummary[] = Array.isArray(messagesData)
      ? messagesData
      : (messagesData && messagesData['hydra:member']) || [];

    return {
      messages: list,
      total: list.length,
      address: stored.address,
      expiresAt: stored.expiresAt,
    };
  },

  /**
   * Fetch full message detail
   */
  async getMessageDetail(sessionId: string, messageId: string): Promise<EmailMessageDetail> {
    try {
      const res = await fetch(
        `/api/mailbox/${encodeURIComponent(sessionId)}/messages/${encodeURIComponent(messageId)}`
      );
      if (res.ok) {
        const data = await handleResponse<{ message: EmailMessageDetail }>(res);
        return data.message;
      }
    } catch {
      // Fallback
    }

    const stored = getStoredClientSession(sessionId);
    if (!stored) {
      throw new ApiError('Session not found', 404, 'SESSION_EXPIRED');
    }

    const detail = await fetchMailtmDirect<EmailMessageDetail>(
      `/messages/${encodeURIComponent(messageId)}`,
      {
        token: stored.token,
      }
    );

    return detail;
  },

  /**
   * Delete specific message
   */
  async deleteMessage(sessionId: string, messageId: string): Promise<boolean> {
    try {
      const res = await fetch(
        `/api/mailbox/${encodeURIComponent(sessionId)}/messages/${encodeURIComponent(messageId)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        return true;
      }
    } catch {
      // Fallback
    }

    const stored = getStoredClientSession(sessionId);
    if (stored) {
      await fetchMailtmDirect(`/messages/${encodeURIComponent(messageId)}`, {
        method: 'DELETE',
        token: stored.token,
      });
    }
    return true;
  },

  /**
   * Delete entire temporary mailbox
   */
  async deleteMailbox(sessionId: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/mailbox/${encodeURIComponent(sessionId)}/delete`, {
        method: 'POST',
      });
      if (res.ok) {
        removeStoredClientSession(sessionId);
        return true;
      }
    } catch {
      // Fallback
    }

    const stored = getStoredClientSession(sessionId);
    if (stored) {
      try {
        await fetchMailtmDirect(`/accounts/${encodeURIComponent(stored.accountId)}`, {
          method: 'DELETE',
          token: stored.token,
        });
      } catch {
        // Ignore
      }
      removeStoredClientSession(sessionId);
    }
    return true;
  },
};
