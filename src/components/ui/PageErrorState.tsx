'use client';

/**
 * ERR-004: Reusable fallback UI for page-level error states.
 *
 * Renders a styled card with an error icon, a message, and an optional retry button.
 *
 * Usage:
 *   <PageErrorState
 *     message="Failed to load user data."
 *     onRetry={() => fetchAllData(username)}
 *   />
 */

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';

interface PageErrorStateProps {
  /** User-facing error message */
  message: string;
  /** Called when the user clicks "Try again". Omit to hide the button. */
  onRetry?: () => void;
  /** Optional heading; defaults to "Something went wrong" */
  title?: string;
  className?: string;
}

export function PageErrorState({
  message,
  onRetry,
  title = 'Something went wrong',
  className = '',
}: PageErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center min-h-[200px] p-8 rounded-2xl border border-destructive/30 bg-destructive/5 text-center gap-4 ${className}`}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="flex items-center gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );
}

export default PageErrorState;
