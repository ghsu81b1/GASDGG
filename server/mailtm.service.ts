/**
 * Mail.tm API Core Service
 * Handles all direct communication with the official Mail.tm REST API.
 */

const MAILTM_BASE_URL = 'https://api.mail.tm';

export interface MailtmDomain {
  id: string;
  domain: string;
  isActive: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MailtmDomainsResponse {
  'hydra:member': MailtmDomain[];
  'hydra:totalItems': number;
}

export interface MailtmAccountResponse {
  id: string;
  address: string;
  quota: number;
  used: number;
  isDisabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MailtmTokenResponse {
  token: string;
  id: string;
}

export interface MailtmSenderRecipient {
  address: string;
  name: string;
}

export interface MailtmAttachment {
  id: string;
  filename: string;
  contentType: string;
  disposition: string;
  transferEncoding?: string;
  related?: boolean;
  size: number;
  downloadUrl?: string;
}

export interface MailtmMessageSummary {
  id: string;
  accountId: string;
  msgid: string;
  from: MailtmSenderRecipient;
  to: MailtmSenderRecipient[];
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

export interface MailtmMessagesResponse {
  'hydra:member': MailtmMessageSummary[];
  'hydra:totalItems': number;
}

export interface MailtmMessageDetail extends MailtmMessageSummary {
  text?: string;
  html?: string[];
  attachments?: MailtmAttachment[];
}

export class MailtmApiError extends Error {
  statusCode: number;
  data?: any;

  constructor(message: string, statusCode: number = 500, data?: any) {
    super(message);
    this.name = 'MailtmApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

async function requestMailtm<T>(
  endpoint: string,
  options: {
    method?: string;
    token?: string;
    body?: any;
  } = {}
): Promise<T> {
  const url = `${MAILTM_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get('content-type') || '';
    let responseData: any = null;

    if (contentType.includes('application/json') || contentType.includes('application/ld+json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (responseData && typeof responseData === 'object' && (responseData['hydra:description'] || responseData.message || responseData.error)) ||
        `Mail.tm API error with status ${response.status}`;
      throw new MailtmApiError(errorMessage, response.status, responseData);
    }

    return responseData as T;
  } catch (error: any) {
    if (error instanceof MailtmApiError) {
      throw error;
    }
    if (error.name === 'AbortError') {
      throw new MailtmApiError('Mail.tm API request timed out', 504);
    }
    throw new MailtmApiError(error.message || 'Failed to communicate with Mail.tm API', 502);
  }
}

export const mailtmService = {
  /**
   * Fetch available active domains from Mail.tm
   */
  async getDomains(page: number = 1): Promise<MailtmDomain[]> {
    const data = await requestMailtm<any>(`/domains?page=${page}`);
    const members: MailtmDomain[] = Array.isArray(data)
      ? data
      : (data && data['hydra:member']) || [];
    return members.filter((d) => d.isActive !== false);
  },

  /**
   * Create a new temporary Mail.tm account
   */
  async createAccount(address: string, password: string): Promise<MailtmAccountResponse> {
    return await requestMailtm<MailtmAccountResponse>('/accounts', {
      method: 'POST',
      body: {
        address: address.trim().toLowerCase(),
        password: password,
      },
    });
  },

  /**
   * Get JWT auth token for Mail.tm account
   */
  async getToken(address: string, password: string): Promise<MailtmTokenResponse> {
    return await requestMailtm<MailtmTokenResponse>('/token', {
      method: 'POST',
      body: {
        address: address.trim().toLowerCase(),
        password: password,
      },
    });
  },

  /**
   * Retrieve incoming messages list for an authenticated account
   */
  async getMessages(token: string, page: number = 1): Promise<MailtmMessageSummary[]> {
    const data = await requestMailtm<any>(`/messages?page=${page}`, {
      token,
    });
    return Array.isArray(data) ? data : (data && data['hydra:member']) || [];
  },

  /**
   * Retrieve single message details (including text, HTML, and attachments)
   */
  async getMessage(token: string, messageId: string): Promise<MailtmMessageDetail> {
    return await requestMailtm<MailtmMessageDetail>(`/messages/${encodeURIComponent(messageId)}`, {
      token,
    });
  },

  /**
   * Delete a message from the Mail.tm mailbox
   */
  async deleteMessage(token: string, messageId: string): Promise<boolean> {
    await requestMailtm(`/messages/${encodeURIComponent(messageId)}`, {
      method: 'DELETE',
      token,
    });
    return true;
  },

  /**
   * Delete an account from Mail.tm
   */
  async deleteAccount(token: string, accountId: string): Promise<boolean> {
    try {
      await requestMailtm(`/accounts/${encodeURIComponent(accountId)}`, {
        method: 'DELETE',
        token,
      });
      return true;
    } catch {
      return false;
    }
  },
};
