/**
 * Structured logging utility (ERR-002 / MON-003)
 *
 * - In development: all levels print to the browser/Node console
 * - In production: only `warn` and `error` are emitted, keeping the
 *   console clean and avoiding accidental data leakage
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Fetching teams', { count: 3 });
 *   logger.error('Failed to refresh JWT', error);
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = process.env.NODE_ENV !== 'production';

function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

function log(level: LogLevel, message: string, ...args: unknown[]): void {
  // In production, suppress debug and info messages
  if (!isDev && (level === 'debug' || level === 'info')) return;

  const formatted = formatMessage(level, message);

  switch (level) {
    case 'debug':
      // eslint-disable-next-line no-console
      console.debug(formatted, ...args);
      break;
    case 'info':
      // eslint-disable-next-line no-console
      console.info(formatted, ...args);
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(formatted, ...args);
      break;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(formatted, ...args);
      break;
  }
}

export const logger = {
  debug: (message: string, ...args: unknown[]) => log('debug', message, ...args),
  info: (message: string, ...args: unknown[]) => log('info', message, ...args),
  warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
  error: (message: string, ...args: unknown[]) => log('error', message, ...args),
};
