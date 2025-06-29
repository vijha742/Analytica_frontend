import { useState, useEffect } from 'react';
import { fetchUserData } from '@/lib/api-client';
import { GithubUser } from '@/types/github';

export function useUserData(username: string) {
    const [data, setData] = useState<GithubUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const result = await fetchUserData(username);
                if (result) {
                    setData(result);
                    setError(null);
                } else {
                    setData(null);
                    setError(new Error('Failed to load user data'));
                }
            } catch (error) {
                console.error('Error in useUserData:', error);
                setData(null);
                setError(error instanceof Error ? error : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        }

        if (username) {
            loadData();
        } else {
            setData(null);
            setIsLoading(false);
        }
    }, [username]);

    return { data, isLoading, error, isUsingFallback: error !== null };
}
