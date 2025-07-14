"use client";

import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AuthGuardProps {
    children: ReactNode;
    fallback?: ReactNode;
    redirectTo?: string;
}

export default function AuthGuard({ children, fallback, redirectTo = "/auth/signin" }: AuthGuardProps) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        if (status !== "loading") {
            setIsInitializing(false);

            if (status === "unauthenticated") {
                // Redirect to sign-in with callback URL
                const currentUrl = window.location.href;
                const signInUrl = `${redirectTo}?callbackUrl=${encodeURIComponent(currentUrl)}`;
                router.push(signInUrl);
            }
        }
    }, [status, router, redirectTo]);

    // Show loading spinner while NextAuth is initializing
    if (status === "loading" || isInitializing) {
        return <LoadingSpinner message="Initializing authentication..." />;
    }

    // Show loading spinner while session is being established
    if (status === "authenticated" && !session) {
        return <LoadingSpinner message="Loading session..." />;
    }

    // User is not authenticated
    if (status === "unauthenticated") {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
                    <p className="text-muted-foreground">Redirecting to sign-in page...</p>
                </div>
            </div>
        );
    }

    // User is authenticated - show the protected content
    return <>{children}</>;
}
