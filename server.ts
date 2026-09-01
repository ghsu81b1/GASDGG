import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { mailtmService, MailtmApiError } from './server/mailtm.service.js';
import { sessionStore } from './server/session.service.js';
import { createRateLimiter } from './server/rate-limiter.js';

dotenv.config();

const app = express();
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Basic JSON parsing & security headers
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Rate limiting middleware
app.use(
  createRateLimiter({
    windowMs: 60000,
    maxRequests: Number(process.env.RATE_LIMIT_MAX) || 120,
    message: 'Rate limit exceeded. Please wait a moment before retrying.',
  })
);

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TempMail Plus Backend',
    timestamp: new Date().toISOString(),
  });
});

// Fetch active domains from Mail.tm
app.get('/api/domains', async (req, res) => {
  try {
    const domains = await mailtmService.getDomains();
    res.json({ domains });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || 'Failed to fetch domains from Mail.tm',
      code: 'DOMAINS_FETCH_FAILED',
    });
  }
});

// Create a new temporary mailbox session
app.post('/api/mailbox/create', async (req, res) => {
  try {
    const { durationMinutes, customUsername, domain } = req.body || {};
    const { session } = await sessionStore.createMailbox({
      durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 60,
      customUsername,
      domain,
    });

    // Safe public response without Mail.tm token or password
    res.status(201).json({
      sessionId: session.sessionId,
      address: session.address,
      domain: session.domain,
      username: session.username,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      durationMinutes: session.durationMinutes,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || 'Failed to create temporary mailbox',
      code: 'MAILBOX_CREATE_FAILED',
    });
  }
});

// Check/verify active session
app.get('/api/mailbox/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = sessionStore.getSession(sessionId);

  if (!session) {
    return res.status(404).json({
      error: 'Mailbox session is expired or not found',
      code: 'SESSION_EXPIRED',
    });
  }

  res.json({
    sessionId: session.sessionId,
    address: session.address,
    domain: session.domain,
    username: session.username,
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    durationMinutes: session.durationMinutes,
  });
});

// Extend lifetime of an active session (supports both POST body and param formats)
app.post(['/api/mailbox/extend', '/api/mailbox/:sessionId/extend'], (req, res) => {
  try {
    const sessionId = req.params.sessionId || req.body?.sessionId;
    const addMinutes = req.body?.addMinutes || 60;
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = sessionStore.extendSession(sessionId, parseInt(addMinutes, 10) || 60);

    res.json({
      sessionId: session.sessionId,
      address: session.address,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      durationMinutes: session.durationMinutes,
    });
  } catch (error: any) {
    const status = error.statusCode || 400;
    res.status(status).json({
      error: error.message || 'Failed to extend session lifetime',
      code: 'SESSION_EXTEND_FAILED',
    });
  }
});

// Fetch messages list for active session
app.get('/api/mailbox/:sessionId/messages', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessionStore.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Mailbox session has expired or does not exist',
        code: 'SESSION_EXPIRED',
      });
    }

    const page = parseInt(req.query.page as string, 10) || 1;
    const messages = await mailtmService.getMessages(session.mailtmToken, page);

    res.json({
      messages,
      total: messages.length,
      address: session.address,
      expiresAt: session.expiresAt,
    });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || 'Failed to fetch messages from Mail.tm',
      code: 'MESSAGES_FETCH_FAILED',
    });
  }
});

// Fetch single message detail
app.get('/api/mailbox/:sessionId/messages/:messageId', async (req, res) => {
  try {
    const { sessionId, messageId } = req.params;
    const session = sessionStore.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Mailbox session has expired or does not exist',
        code: 'SESSION_EXPIRED',
      });
    }

    const message = await mailtmService.getMessage(session.mailtmToken, messageId);
    res.json({ message });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || 'Failed to fetch message details',
      code: 'MESSAGE_FETCH_FAILED',
    });
  }
});

// Delete single message
app.delete('/api/mailbox/:sessionId/messages/:messageId', async (req, res) => {
  try {
    const { sessionId, messageId } = req.params;
    const session = sessionStore.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Mailbox session has expired or does not exist',
        code: 'SESSION_EXPIRED',
      });
    }

    await mailtmService.deleteMessage(session.mailtmToken, messageId);
    res.json({ success: true, messageId });
  } catch (error: any) {
    const status = error.statusCode || 500;
    res.status(status).json({
      error: error.message || 'Failed to delete message',
      code: 'MESSAGE_DELETE_FAILED',
    });
  }
});

// Delete entire mailbox session
app.post('/api/mailbox/:sessionId/delete', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await sessionStore.deleteSession(sessionId);
    res.json({ success: true, message: 'Mailbox deleted successfully' });
  } catch (error: any) {
    res.status(500).json({
      error: error.message || 'Failed to delete mailbox',
      code: 'MAILBOX_DELETE_FAILED',
    });
  }
});

// Contact form handler
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subjectCategory: string;
  message: string;
  createdAt: string;
  ip?: string;
}

const contactMessages: ContactMessage[] = [];

app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subjectCategory, message } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address so we can reply.' });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long.' });
    }

    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substring(2, 11),
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 150),
      subjectCategory: (subjectCategory && typeof subjectCategory === 'string') ? subjectCategory.slice(0, 50) : 'General Inquiry',
      message: message.trim().slice(0, 3000),
      createdAt: new Date().toISOString(),
      ip: (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '').slice(0, 45),
    };

    contactMessages.push(newMessage);
    // Keep max 500 messages in memory
    if (contactMessages.length > 500) {
      contactMessages.shift();
    }

    console.log(`[Contact Form] New message received from ${newMessage.name} <${newMessage.email}> - Category: ${newMessage.subjectCategory}`);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. Your message has been received, and we will review it shortly.',
      referenceId: newMessage.id,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'An unexpected error occurred while submitting your message. Please email us directly at achrafelhrbiliachraf@gmail.com.',
    });
  }
});

// SEO: robots.txt and sitemap.xml dynamically generated based on host
app.get('/robots.txt', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`);
});

app.get('/sitemap.xml', (req, res) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const now = new Date().toISOString().split('T')[0];

  const routes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'how-it-works', priority: '0.9', changefreq: 'weekly' },
    { path: 'faq', priority: '0.9', changefreq: 'weekly' },
    { path: 'about', priority: '0.8', changefreq: 'monthly' },
    { path: 'contact', priority: '0.8', changefreq: 'monthly' },
    { path: 'privacy', priority: '0.7', changefreq: 'monthly' },
    { path: 'terms', priority: '0.7', changefreq: 'monthly' },
    { path: 'cookies', priority: '0.7', changefreq: 'monthly' },
    { path: 'disclaimer', priority: '0.7', changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${baseUrl}/${r.path ? `#${r.path}` : ''}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// ----------------------------------------------------
// FRONTEND MIDDLEWARE (Vite in Dev / Static in Prod)
// ----------------------------------------------------
async function bootstrap() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TempMail Plus server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
