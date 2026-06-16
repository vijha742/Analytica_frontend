'use client';

/**
 * AUTH-003: Token Expiration UI Handling
 *
 * Watches the NextAuth session for impending JWT expiry and shows a toast
 * notification prompting the user to re-authenticate before they hit a hard
 * 401 wall.
 *
 * Mount this once inside your root Providers component (client boundary).
 *
 * Strategy:
 *  - The NextAuth session `backendJWT` is a standard JWT with an `exp` claim.
 *  - We decode the claim client-side (no signature verification needed here —
 *    we're just checking time, not trusting the payload for auth decisions).
 *  - When <60 s remain, we show a persistent warning toast.
 *  - When the token has expired, we show an error toast and redirect to sign-in.
 */

import { useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { logger } from '@/lib/logger';

interface DecodedJwtPayload {
  exp?: number;
  sub?: string;
}

function safeDecodeJwt(token: string): DecodedJwtPayload | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    // Replace URL-safe base64 chars and pad to multiple of 4
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(atob(padded)) as DecodedJwtPayload;
  } catch {
    return null;
  }
}

interface TokenExpiryWatcherProps {
  /** Called when the token has <60 s remaining — show a warning toast. */
  onWarn: (message: string) => void;
  /** Called when the token has fully expired — show an error toast. */
  onExpired: (message: string) => void;
  /** Warning threshold in seconds before expiry (default: 60) */
  warnThresholdSeconds?: number;
}

export function TokenExpiryWatcher({
  onWarn,
  onExpired,
  warnThresholdSeconds = 60,
}: TokenExpiryWatcherProps) {
  const { data: session } = useSession();
  const warnFiredRef = useRef(false);
  const expiredFiredRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Reset state when session changes (e.g., after re-auth)
    warnFiredRef.current = false;
    expiredFiredRef.current = false;

    const jwt = session?.backendJWT;
    if (!jwt) return;

    const decoded = safeDecodeJwt(jwt);
    if (!decoded?.exp) return;

    const checkExpiry = () => {
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = decoded.exp! - now;

      if (secondsLeft <= 0 && !expiredFiredRef.current) {
        expiredFiredRef.current = true;
        logger.warn('Backend JWT has expired — prompting user to re-authenticate');
        onExpired('Your session has expired. Please sign in again to continue.');
        // Automatically redirect to sign-in after a brief delay
        setTimeout(() => {
          signIn();
        }, 3000);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else if (secondsLeft <= warnThresholdSeconds && secondsLeft > 0 && !warnFiredRef.current) {
        warnFiredRef.current = true;
        logger.warn(`Backend JWT expiring in ${secondsLeft}s — warning user`);
        onWarn(
          `Your session will expire in about ${Math.ceil(secondsLeft / 60)} minute${secondsLeft < 120 ? '' : 's'}. Save your work.`
        );
      }
    };

    // Check immediately and then every 15 seconds
    checkExpiry();
    intervalRef.current = setInterval(checkExpiry, 15_000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session?.backendJWT, onWarn, onExpired, warnThresholdSeconds]);

  // This component renders nothing — it's purely a side-effect hook wrapper
  return null;
}

export default TokenExpiryWatcher;
