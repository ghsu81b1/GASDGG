import DOMPurify from 'dompurify';

/**
 * Sanitize incoming HTML email body to prevent XSS, malicious scripts,
 * iframes, and rogue stylesheets while preserving email layout.
 */
export function sanitizeEmailHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== 'string') {
    return '';
  }

  // Configure DOMPurify
  const clean = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'a', 'b', 'blockquote', 'br', 'center', 'code', 'div', 'em', 'font', 'h1',
      'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'pre',
      'small', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot',
      'th', 'thead', 'tr', 'u', 'ul', 'section', 'article', 'header', 'footer'
    ],
    ALLOWED_ATTR: [
      'align', 'alt', 'bgcolor', 'border', 'cellpadding', 'cellspacing', 'cite',
      'class', 'color', 'colspan', 'dir', 'face', 'height', 'href', 'hspace',
      'id', 'lang', 'rowspan', 'size', 'src', 'style', 'title', 'valign',
      'vspace', 'width', 'target', 'rel'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|data:image\/):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'base', 'meta', 'link'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'formaction'],
    ADD_ATTR: ['target'],
  });

  // Ensure all links open in new tab with noopener noreferrer
  return clean.replace(/<a\s+(?:[^>]*?\s+)?href=/gi, '<a target="_blank" rel="noopener noreferrer" href=');
}

/**
 * Format plain text emails into clean paragraphs and linkify URLs.
 */
export function formatPlainTextEmail(text: string): string {
  if (!text) return '';
  
  // Escape HTML characters
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Linkify URLs
  const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  const linkified = escaped.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">$1</a>');

  return linkified.replace(/\n/g, '<br />');
}
