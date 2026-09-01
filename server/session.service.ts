import crypto from 'crypto';
import { mailtmService, MailtmApiError } from './mailtm.service.js';

export interface StoredSession {
  sessionId: string;
  address: string;
  domain: string;
  username: string;
  accountId: string;
  mailtmToken: string;
  createdAt: number;
  expiresAt: number;
  durationMinutes: number;
  lastActive: number;
}

const ADJECTIVES = [
  'blue', 'silent', 'cloud', 'fast', 'green', 'silver', 'swift', 'quiet', 'bright', 'shadow',
  'amber', 'crystal', 'cosmic', 'golden', 'velvet', 'mystic', 'polar', 'neon', 'iron', 'ruby',
  'solar', 'lunar', 'frost', 'blaze', 'alpha', 'nova', 'breeze', 'storm', 'ocean', 'forest'
];

const NOUNS = [
  'fox', 'moon', 'rabbit', 'mail', 'star', 'hawk', 'comet', 'river', 'wolf', 'eagle',
  'falcon', 'tiger', 'lion', 'bear', 'dolphin', 'phoenix', 'cedar', 'crest', 'beacon', 'shield',
  'orbit', 'pulsar', 'glider', 'spark', 'stride', 'echo', 'shadow', 'zenith', 'peak', 'drift'
];

// Maximum allowable lifetime: 7 days (10,080 minutes)
export const MAX_LIFETIME_MINUTES = 7 * 24 * 60;

class SessionStore {
  private sessions = new Map<string, StoredSession>();

  constructor() {
    // Periodic cleanup every 60 seconds
    setInterval(() => {
      this.cleanupExpired();
    }, 60000);
  }

  generateUsername(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(10 + Math.random() * 90);
    return `${adj}${noun}${num}`;
  }

  generatePassword(): string {
    return crypto.randomBytes(12).toString('hex') + 'A1!';
  }

  generateSessionId(): string {
    return crypto.randomBytes(24).toString('hex');
  }

  async createMailbox(options: {
    durationMinutes?: number;
    customUsername?: string;
    domain?: string;
  }): Promise<{ session: StoredSession; token: string }> {
    const durationMinutes = Math.min(
      Math.max(options.durationMinutes || 60, 5),
      MAX_LIFETIME_MINUTES
    );

    // 1. Fetch available domains
    const domains = await mailtmService.getDomains();
    if (!domains || domains.length === 0) {
      throw new MailtmApiError('No available domains found on Mail.tm service', 503);
    }

    let selectedDomain = options.domain?.trim().toLowerCase();
    if (!selectedDomain || !domains.some((d) => d.domain.toLowerCase() === selectedDomain)) {
      selectedDomain = domains[0].domain.toLowerCase();
    }

    // 2. Generate or sanitize username
    let username = options.customUsername
      ? options.customUsername.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '')
      : this.generateUsername();

    if (!username || username.length < 3) {
      username = this.generateUsername();
    }

    const address = `${username}@${selectedDomain}`;
    const password = this.generatePassword();

    // 3. Create Mail.tm account
    let account;
    try {
      account = await mailtmService.createAccount(address, password);
    } catch (err: any) {
      // If username is taken, append random salt and retry once
      if (err.statusCode === 422 || err.message?.includes('already exists') || err.message?.includes('taken')) {
        username = `${this.generateUsername()}${Math.floor(10 + Math.random() * 89)}`;
        const retryAddress = `${username}@${selectedDomain}`;
        account = await mailtmService.createAccount(retryAddress, password);
      } else {
        throw err;
      }
    }

    // 4. Authenticate to obtain token
    const tokenRes = await mailtmService.getToken(account.address, password);
    const now = Date.now();
    const expiresAt = now + durationMinutes * 60 * 1000;
    const sessionId = this.generateSessionId();

    const storedSession: StoredSession = {
      sessionId,
      address: account.address,
      domain: selectedDomain,
      username,
      accountId: account.id,
      mailtmToken: tokenRes.token,
      createdAt: now,
      expiresAt,
      durationMinutes,
      lastActive: now,
    };

    this.sessions.set(sessionId, storedSession);

    return {
      session: storedSession,
      token: tokenRes.token,
    };
  }

  getSession(sessionId: string): StoredSession | null {
    if (!sessionId) return null;
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const now = Date.now();
    if (now > session.expiresAt) {
      // Session has expired
      this.sessions.delete(sessionId);
      return null;
    }

    session.lastActive = now;
    return session;
  }

  extendSession(sessionId: string, addMinutes: number): StoredSession {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new MailtmApiError('Session not found or expired', 404);
    }

    const addMs = Math.max(addMinutes, 1) * 60 * 1000;
    const maxExpiry = session.createdAt + MAX_LIFETIME_MINUTES * 60 * 1000;
    const newExpiresAt = Math.min(session.expiresAt + addMs, maxExpiry);

    session.expiresAt = newExpiresAt;
    session.durationMinutes = Math.round((newExpiresAt - session.createdAt) / (60 * 1000));
    session.lastActive = Date.now();

    return session;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return true;

    try {
      // Best-effort remote deletion
      await mailtmService.deleteAccount(session.mailtmToken, session.accountId);
    } catch {
      // Ignore remote cleanup error if already deleted
    }

    this.sessions.delete(sessionId);
    return true;
  }

  private cleanupExpired() {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
      }
    }
  }
}

export const sessionStore = new SessionStore();
