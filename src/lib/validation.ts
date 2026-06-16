/**
 * Input Validation Schemas (SEC-003)
 *
 * Centralised validation for all user-facing inputs and API parameters.
 * Uses lightweight, dependency-free validators so no extra package is needed.
 *
 * Usage:
 *   import { validateUsername, validateSearchQuery } from '@/lib/validation';
 *   const result = validateUsername(input);
 *   if (!result.valid) throw new Error(result.error);
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

// GitHub username rules:
// - 1–39 chars
// - alphanumeric + hyphens only
// - cannot start or end with a hyphen
// - no consecutive hyphens
const USERNAME_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$|^[a-zA-Z0-9]$/;

/**
 * Validates a GitHub username.
 */
export function validateUsername(input: string | null | undefined): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Username is required.' };
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Username cannot be empty.' };
  }

  if (trimmed.length > 39) {
    return { valid: false, error: 'Username cannot exceed 39 characters.' };
  }

  if (!USERNAME_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Username may only contain letters, numbers, and hyphens, and cannot start or end with a hyphen.',
    };
  }

  if (trimmed.includes('--')) {
    return { valid: false, error: 'Username cannot contain consecutive hyphens.' };
  }

  return { valid: true, sanitized: trimmed };
}

/**
 * Validates a free-text search query (less strict — allows spaces etc.).
 */
export function validateSearchQuery(input: string | null | undefined): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Search query is required.' };
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Please enter a search term.' };
  }

  if (trimmed.length > 100) {
    return { valid: false, error: 'Search query is too long (max 100 characters).' };
  }

  // Strip potentially dangerous characters but keep the query meaningful
  const sanitized = trimmed.replace(/[<>"'`]/g, '');

  return { valid: true, sanitized };
}

/**
 * Validates a team/group name.
 * - 1–50 chars
 * - alphanumeric, spaces, hyphens, underscores
 */
export function validateGroupName(input: string | null | undefined): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Group name is required.' };
  }

  const trimmed = input.trim();

  if (trimmed.length === 0) {
    return { valid: false, error: 'Group name cannot be empty.' };
  }

  if (trimmed.length > 50) {
    return { valid: false, error: 'Group name cannot exceed 50 characters.' };
  }

  const GROUP_REGEX = /^[a-zA-Z0-9 _-]+$/;
  if (!GROUP_REGEX.test(trimmed)) {
    return {
      valid: false,
      error: 'Group name may only contain letters, numbers, spaces, hyphens, and underscores.',
    };
  }

  return { valid: true, sanitized: trimmed };
}
