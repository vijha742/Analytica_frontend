/**
 * Application-wide constants (CODE-003)
 *
 * Replaces magic numbers scattered across the codebase with
 * named, self-documenting constants.
 */

// ─── Cache durations (milliseconds) ──────────────────────────────────────────

export const CACHE_DURATION_MS = {
  /** 5 minutes — suggested users list */
  SUGGESTED_USERS: 5 * 60 * 1000,
  /** 5 minutes — dashboard data */
  DASHBOARD: 5 * 60 * 1000,
  /** 5 minutes — profile data */
  PROFILE: 5 * 60 * 1000,
} as const;

// ─── Token / cookie TTLs (seconds) ───────────────────────────────────────────

export const TOKEN_TTL_SECONDS = {
  /** 24 hours — short-lived JWT */
  JWT: 24 * 60 * 60,
  /** 7 days — refresh token */
  REFRESH_TOKEN: 7 * 24 * 60 * 60,
} as const;

// ─── Pagination defaults ──────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_SEARCH_LIMIT: 10,
} as const;

// ─── Loading skeleton counts ──────────────────────────────────────────────────

export const SKELETON_COUNT = {
  HOME_USERS: 12,
  SEARCH_USERS: 3,
  DASHBOARD_CARDS: 3,
} as const;

// ─── Group defaults ───────────────────────────────────────────────────────────

export const DEFAULT_TEAMS = ['Classmates', 'Colleagues', 'Friends'] as const;
