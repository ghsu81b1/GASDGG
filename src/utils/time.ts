import { Language } from '../types';

/**
 * Format remaining milliseconds into human-readable countdown string.
 * Supports "09:42", "59:32", "23:41:28", "4d 18h 32m" formats.
 */
export function formatCountdown(expiresAt: number): {
  formatted: string;
  isExpired: boolean;
  totalSecondsRemaining: number;
  percentage: number;
} {
  const now = Date.now();
  const diffMs = expiresAt - now;

  if (diffMs <= 0) {
    return {
      formatted: '00:00',
      isExpired: true,
      totalSecondsRemaining: 0,
      percentage: 0,
    };
  }

  const totalSecs = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  let formatted = '';

  if (days >= 1) {
    formatted = `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
  } else if (hours >= 1) {
    formatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return {
    formatted,
    isExpired: false,
    totalSecondsRemaining: totalSecs,
    percentage: 100, // Will be computed relative to initial duration in component
  };
}

/**
 * Format relative time (e.g. "2 min ago", "just now") in all 5 supported languages.
 */
export function formatRelativeTime(dateString: string, lang: Language = 'en'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffSeconds) || diffSeconds < 10) {
    switch (lang) {
      case 'ar': return 'الآن';
      case 'fr': return 'à l\'instant';
      case 'es': return 'ahora mismo';
      case 'de': return 'gerade eben';
      default: return 'just now';
    }
  }

  const minutes = Math.floor(diffSeconds / 60);
  const hours = Math.floor(diffSeconds / 3600);
  const days = Math.floor(diffSeconds / 86400);

  if (diffSeconds < 60) {
    switch (lang) {
      case 'ar': return `منذ ${diffSeconds} ثانية`;
      case 'fr': return `il y a ${diffSeconds} s`;
      case 'es': return `hace ${diffSeconds} seg`;
      case 'de': return `vor ${diffSeconds} Sek.`;
      default: return `${diffSeconds}s ago`;
    }
  }

  if (minutes < 60) {
    switch (lang) {
      case 'ar': return `منذ ${minutes} دقيقة`;
      case 'fr': return `il y a ${minutes} min`;
      case 'es': return `hace ${minutes} min`;
      case 'de': return `vor ${minutes} Min.`;
      default: return `${minutes} min ago`;
    }
  }

  if (hours < 24) {
    switch (lang) {
      case 'ar': return `منذ ${hours} ساعة`;
      case 'fr': return `il y a ${hours} h`;
      case 'es': return `hace ${hours} h`;
      case 'de': return `vor ${hours} Std.`;
      default: return `${hours} hr ago`;
    }
  }

  switch (lang) {
    case 'ar': return `منذ ${days} يوم`;
    case 'fr': return `il y a ${days} j`;
    case 'es': return `hace ${days} d`;
    case 'de': return `vor ${days} Tag(en)`;
    default: return `${days}d ago`;
  }
}

/**
 * Format full date string for email viewer
 */
export function formatFullDate(dateString: string, lang: Language = 'en'): string {
  try {
    const date = new Date(dateString);
    const localeMap: Record<Language, string> = {
      en: 'en-US',
      ar: 'ar-SA',
      fr: 'fr-FR',
      es: 'es-ES',
      de: 'de-DE',
    };
    return date.toLocaleString(localeMap[lang] || 'en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return dateString;
  }
}
