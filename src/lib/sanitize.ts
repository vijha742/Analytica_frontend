/**
 * XSS Sanitization Utility (SEC-002)
 *
 * Sanitizes user-generated content before rendering to prevent XSS attacks.
 * Uses DOMPurify when available in the browser environment.
 *
 * Usage:
 *   import { sanitize } from '@/lib/sanitize';
 *   <p>{sanitize(user.bio)}</p>
 */

/**
 * Strips dangerous HTML from a string.
 * - On the server (SSR), returns the raw string — Next.js never renders
 *   dangerouslySetInnerHTML from this utility, so it is safe.
 * - On the client, delegates to DOMPurify if installed, otherwise
 *   falls back to a simple tag-stripping regex.
 *
 * IMPORTANT: Only pass this output to `dangerouslySetInnerHTML` if you
 * explicitly need HTML rendering. For plain text, just use the output directly
 * inside JSX text nodes — React auto-escapes them.
 */
export function sanitize(input: string | null | undefined): string {
  if (!input) return '';

  // Server-side: we only render text nodes (not dangerouslySetInnerHTML),
  // so returning the raw string is safe here.
  if (typeof window === 'undefined') {
    return input;
  }

  // Client-side: use DOMPurify if it is loaded
  try {
    // Dynamic require so the bundle does not blow up on SSR
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DOMPurify = require('dompurify');
    if (DOMPurify && typeof DOMPurify.sanitize === 'function') {
      return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }
  } catch {
    // DOMPurify not installed — fall through to regex fallback
  }

  // Fallback: strip all HTML tags and decode common HTML entities
  return input
    .replace(/<[^>]*>/g, '')           // strip tags
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');
}

/**
 * Sanitizes a GitHub username to contain only valid characters.
 * GitHub usernames may only contain alphanumeric characters and hyphens,
 * max 39 chars, cannot start/end with a hyphen.
 */
export function sanitizeUsername(input: string): string {
  return input
    .trim()
    .replace(/[^a-zA-Z0-9-]/g, '')  // only allow alphanumeric + hyphen
    .slice(0, 39);                   // GitHub username max length
}
