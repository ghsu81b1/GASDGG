export type Language = 'en' | 'ar' | 'fr' | 'es' | 'de';

export interface MailboxSession {
  sessionId: string;
  address: string;
  domain: string;
  username: string;
  createdAt: number; // timestamp in ms
  expiresAt: number; // timestamp in ms
  durationMinutes: number;
  isExpired?: boolean;
}

export interface MailboxDomain {
  id: string;
  domain: string;
  isActive: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailSenderRecipient {
  address: string;
  name: string;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  contentType: string;
  disposition: string;
  transferEncoding?: string;
  related?: boolean;
  size: number;
  downloadUrl?: string;
}

export interface EmailMessageSummary {
  id: string;
  accountId: string;
  msgid: string;
  from: EmailSenderRecipient;
  to: EmailSenderRecipient[];
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailMessageDetail extends EmailMessageSummary {
  text?: string;
  html?: string[];
  attachments?: EmailAttachment[];
}

export interface CreateMailboxRequest {
  durationMinutes: number;
  customUsername?: string;
  domain?: string;
}

export interface ExtendLifetimeRequest {
  sessionId: string;
  addMinutes: number;
}

export interface LifetimeOption {
  labelKey: string;
  minutes: number;
  badge?: string;
}

export interface FaqItem {
  questionKey: string;
  answerKey: string;
}
