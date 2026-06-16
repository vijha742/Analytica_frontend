"use client";
import { SessionProvider } from "next-auth/react";
import { useCallback } from "react";
import { TokenExpiryWatcher } from "@/components/TokenExpiryWatcher";
import { useToast, ToastContainer } from "@/components/ui/toast";

/**
 * Inner component: has access to SessionProvider context.
 * AUTH-003: mounts the token expiry watcher so warnings appear on every page.
 */
function AppWithWatcher({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast, showWarning, showError } = useToast();

  const handleWarn = useCallback(
    (message: string) => showWarning(message),
    [showWarning]
  );

  const handleExpired = useCallback(
    (message: string) => showError(message),
    [showError]
  );

  return (
    <>
      {/* Root-level toast container for session expiry warnings */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <TokenExpiryWatcher onWarn={handleWarn} onExpired={handleExpired} />
      {children}
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AppWithWatcher>{children}</AppWithWatcher>
    </SessionProvider>
  );
}

