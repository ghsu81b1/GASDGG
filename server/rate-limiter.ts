import type { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipBuckets = new Map<string, RateLimitRecord>();

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipBuckets.entries()) {
    if (now > record.resetTime) {
      ipBuckets.delete(ip);
    }
  }
}, 300000);

export function createRateLimiter(options: {
  windowMs?: number;
  maxRequests?: number;
  message?: string;
}) {
  const windowMs = options.windowMs || 60000; // 1 minute
  const maxRequests = options.maxRequests || 120; // 120 requests per minute
  const message = options.message || 'Too many requests, please slow down.';

  return (req: Request, res: Response, next: NextFunction) => {
    // Skip rate limiter for static assets or health checks
    if (req.path.startsWith('/assets') || req.path === '/api/health') {
      return next();
    }

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    let record = ipBuckets.get(clientIp);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      ipBuckets.set(clientIp, record);
    } else {
      record.count += 1;
    }

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > maxRequests) {
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
}
