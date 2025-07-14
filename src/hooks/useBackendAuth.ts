"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useBackendAuth() {
    const { data: session, status } = useSession();
    const [isBackendAuthenticated, setIsBackendAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const exchangeTokens = async () => {
            if (session?.githubAccessToken && !isBackendAuthenticated) {
                setIsLoading(true);
                try {
                    const response = await fetch('/api/auth/backend-jwt', {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (response.ok) {
                        setIsBackendAuthenticated(true);
                    } else {
                        console.error('Failed to exchange tokens with backend');
                    }
                } catch (error) {
                    console.error('Error exchanging tokens:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (status === 'authenticated') {
            exchangeTokens();
        }
    }, [session, status, isBackendAuthenticated]);

    return {
        isBackendAuthenticated,
        isLoading: isLoading || status === 'loading',
        session,
        status,
    };
}
