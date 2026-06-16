/**
 * STATE-004: Window Cache Cleanup Utility
 *
 * Provides a single function to wipe all in-memory window caches used by
 * the app. Call this on logout so stale profile/dashboard data doesn't
 * leak between users or sessions.
 *
 * Caches cleared:
 *   - window.__profileCache   (profile/page.tsx)
 *   - window.__dashboardCache (dashboard/page.tsx)
 *   - window.__suggestedUsersCache (useSuggestedUsersHome.ts)
 */

import { logger } from './logger';

/**
 * Clears all app-level window caches.
 * Safe to call from both client and SSR contexts (no-ops on the server).
 */
export function clearAllWindowCaches(): void {
  if (typeof window === 'undefined') return;

  const cacheKeys: Array<keyof Window> = [
    '__profileCache',
    '__dashboardCache',
    '__suggestedUsersCache',
  ];

  let cleared = 0;
  for (const key of cacheKeys) {
    if (key in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any)[key];
      cleared++;
    }
  }

  logger.info(`clearAllWindowCaches: cleared ${cleared} cache(s)`);
}
