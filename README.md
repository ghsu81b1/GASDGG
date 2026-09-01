# TempMail Plus — Disposable Temporary Email Service

A complete, modern, and production-ready Temporary Email website powered by the official **Mail.tm API**.

---

## Table of Contents

1. [Installation](#1-how-to-install-the-project)
2. [Running Locally](#2-how-to-run-it-locally)
3. [How the Mail.tm API Works](#3-how-the-mailtm-api-works)
4. [Mail.tm Integration Architecture](#4-how-the-mailtm-integration-is-implemented)
5. [Configuration](#5-how-to-configure-the-application)
6. [Deployment](#6-how-to-deploy-it)
7. [The Lifetime & Expiration System](#7-how-the-expiration-system-works)
8. [The Multilingual & RTL System](#8-how-the-multilingual-system-works)
9. [Changing Available Durations](#9-how-to-change-available-durations)
10. [Configuring Rate Limits & Abuse Protection](#10-how-to-configure-rate-limits)

---

## 1. How to Install the Project

Clone or copy the repository files and install the dependencies via npm:

```bash
# Install node dependencies
npm install
```

All essential dependencies (`express`, `react`, `lucide-react`, `dompurify`, `qrcode`, `motion`, `tailwindcss`) will be installed.

---

## 2. How to Run It Locally

To start the unified development server with hot reload and Express backend API routes on port `3000`:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 3. How the Mail.tm API Works

Mail.tm is a public REST API for temporary email services:

- **Base URL**: `https://api.mail.tm`
- **Dynamic Domains**: `GET https://api.mail.tm/domains` retrieves active domains available for new accounts.
- **Account Registration**: `POST https://api.mail.tm/accounts` creates an account with `{ address, password }`.
- **JWT Authentication**: `POST https://api.mail.tm/token` exchanges `{ address, password }` for an auth token.
- **Inbox Listing**: `GET https://api.mail.tm/messages` with `Authorization: Bearer <TOKEN>` fetches incoming messages.
- **Message Content**: `GET https://api.mail.tm/messages/{id}` fetches full HTML/plain-text content and attachments.
- **Deletion**: `DELETE https://api.mail.tm/messages/{id}` and `DELETE https://api.mail.tm/accounts/{id}` removes message/account from Mail.tm.

---

## 4. How the Mail.tm Integration is Implemented

### Backend Proxy Architecture

To safeguard API tokens and passwords from client exposure:

```
[Browser Client]
       │
       ▼ (Custom Session ID)
[Express Server /server.ts]
  ├── Session Store (server/session.service.ts)
  ├── Mail.tm Service (server/mailtm.service.ts)
  └── Rate Limiter (server/rate-limiter.ts)
       │
       ▼ (Bearer JWT & Crypto Passwords)
[Mail.tm API: https://api.mail.tm]
```

- Passwords and Mail.tm JWT tokens are **only** held in backend session memory.
- The client receives an opaque `sessionId`.
- All requests for messages, domains, and actions flow through `/api/mailbox/*` endpoints.

---

## 5. How to Configure the Application

Create a `.env` file from `.env.example`:

```env
PORT=3000
NODE_ENV=development
RATE_LIMIT_MAX=120
RATE_LIMIT_WINDOW_MS=60000
```

---

## 6. How to Deploy It

To build for production:

```bash
npm run build
```

This compiles the React frontend with Vite and bundles the Express server to `dist/server.cjs` via `esbuild`.

To launch in production:

```bash
npm start
```

---

## 7. How the Expiration System Works

1. **Duration Selection**: Users select from 11 preset durations (10m, 30m, 1h, 2h, 6h, 12h, 1d, 2d, 3d, 4d, 5d).
2. **Server-authoritative `expiresAt`**: Calculated as `Date.now() + durationMinutes * 60 * 1000`.
3. **Live UI Countdown**: Accurately rendered from `expiresAt - Date.now()`.
4. **Session Termination**: When `expiresAt` is reached, access to the mailbox is revoked and local sessions are cleared.
5. **Lifetime Extension**: Users can extend their active session (+1h, +2h, +1d, +3d) capped at a maximum of 7 days.

---

## 8. How the Multilingual System Works

The application provides full native translation across 5 languages:

1. 🇺🇸 **English** (`/src/locales/en.json`)
2. 🇸🇦 **Arabic** (`/src/locales/ar.json`) — with full native `dir="rtl"` support
3. 🇫🇷 **French** (`/src/locales/fr.json`)
4. 🇪🇸 **Spanish** (`/src/locales/es.json`)
5. 🇩🇪 **German** (`/src/locales/de.json`)

When Arabic is selected, the application automatically applies `dir="rtl"` to `<html>` and dynamically adjusts icons, cards, and text layout.

---

## 9. How to Change Available Durations

To modify duration options, update `DURATION_OPTIONS` in `/src/components/DurationSelector.tsx`:

```typescript
export const DURATION_OPTIONS = [
  { labelKey: 'duration.d_10m', minutes: 10 },
  { labelKey: 'duration.d_30m', minutes: 30 },
  { labelKey: 'duration.d_1h', minutes: 60, badge: 'Popular' },
  // Add or modify duration objects here
];
```

---

## 10. How to Configure Rate Limits

Rate limits are configured in `/server/rate-limiter.ts` and set via environment variables:

```typescript
createRateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  maxRequests: Number(process.env.RATE_LIMIT_MAX) || 120,
  message: 'Rate limit exceeded. Please wait a moment before retrying.',
});
```

---

## Security & HTML Sanitization

All incoming HTML emails are sanitized using **DOMPurify** before rendering in the browser. This prevents:
- Malicious JavaScript execution (`<script>`, `onerror`, `onload`)
- Phishing form submissions (`<form>`, `<input>`)
- Remote iframe hijacking (`<iframe>`, `<object>`, `<embed>`)
- Suspicious external resource injections
