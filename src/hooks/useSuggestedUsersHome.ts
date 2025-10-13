'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getSuggestedUsers } from '@/lib/api-client';
import { GithubUser } from '@/types/github';

declare global {
    interface Window {
        __suggestedUsersCache?: Record<string, {
            data: GithubUser[],
            timestamp: number,
            expiresAt: number
        }>;
    }
}

// Cache expiration time (5 minutes)
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000;

function getSuggestedUsersCache(group: string): GithubUser[] | null {
    if (typeof window !== 'undefined') {
        const cache = window.__suggestedUsersCache || {};
        const cachedData = cache[group];

        if (cachedData && Date.now() < cachedData.expiresAt) {
            return cachedData.data;
        }

        // Clean up expired cache
        if (cachedData && Date.now() >= cachedData.expiresAt) {
            delete cache[group];
        }
    }
    return null;
}

function setSuggestedUsersCache(group: string, users: GithubUser[]) {
    if (typeof window !== 'undefined') {
        if (!window.__suggestedUsersCache) {
            window.__suggestedUsersCache = {};
        }
        const now = Date.now();
        window.__suggestedUsersCache[group] = {
            data: users,
            timestamp: now,
            expiresAt: now + CACHE_EXPIRATION_TIME
        };
    }
}

function clearSuggestedUsersCache(group?: string) {
    if (typeof window !== 'undefined') {
        if (group) {
            delete window.__suggestedUsersCache?.[group];
        } else {
            window.__suggestedUsersCache = {};
        }
    }
}

export function useSuggestedUsersHome(group: string = 'Classmates') {
    const pathname = usePathname();
    const isHomePage = pathname === '/home';

    const cached = getSuggestedUsersCache(group) || [];
    const [users, setUsers] = useState<GithubUser[]>(cached);
    const [isLoading, setIsLoading] = useState(false);
    // Track loading skeletons for individual user suggestions
    const [loadingSkeletons, setLoadingSkeletons] = useState<Set<string>>(new Set());

    // Track current request to handle race conditions
    const currentRequestRef = useRef<string | null>(null);

    const fetchSuggestedUsers = useCallback(async (bypassCache = false) => {
        // Only fetch if we're on the home page
        if (!isHomePage) return;

        // Create unique request ID to handle race conditions
        const requestId = `${group}-${Date.now()}`;
        currentRequestRef.current = requestId;

        setIsLoading(true);

        // Check cache first unless bypassing
        if (!bypassCache) {
            const cachedData = getSuggestedUsersCache(group);
            if (cachedData && cachedData.length > 0) {
                // Only update if this is still the current request
                if (currentRequestRef.current === requestId) {
                    setUsers(cachedData);
                    setIsLoading(false);
                }
                return;
            }
        }

        try {
            const fetchedUsers = await getSuggestedUsers(group);

            // Only update if this is still the current request (prevents race conditions)
            if (currentRequestRef.current === requestId) {
                if (Array.isArray(fetchedUsers)) {
                    setSuggestedUsersCache(group, fetchedUsers);
                    setUsers(fetchedUsers);
                } else {
                    // If fetch fails or returns empty, set empty array for this group
                    setUsers([]);
                    setSuggestedUsersCache(group, []); // Cache empty result to avoid repeated requests
                }
            }
        } catch (error) {
            console.error('Failed to fetch suggested users:', error);
            // Only update if this is still the current request
            if (currentRequestRef.current === requestId) {
                setUsers([]);
                // Don't cache error results to allow retry
            }
        } finally {
            // Only update loading state if this is still the current request
            if (currentRequestRef.current === requestId) {
                setIsLoading(false);
            }
        }
    }, [group, isHomePage]);

    useEffect(() => {
        if (!isHomePage) {
            // Clear loading state when not on home page
            setIsLoading(false);
            return;
        }

        // Immediately show cached data if available
        const cachedForGroup = getSuggestedUsersCache(group) || [];
        setUsers(cachedForGroup);

        // Fetch data when on home page and group changes or on initial load
        if (cachedForGroup.length === 0) {
            fetchSuggestedUsers(false);
        } else {
            setIsLoading(false);
        }
    }, [group, isHomePage, fetchSuggestedUsers]);

    const refetch = useCallback(() => {
        if (isHomePage) {
            return fetchSuggestedUsers(true);
        }
    }, [fetchSuggestedUsers, isHomePage]);

    const clearCache = useCallback(() => {
        clearSuggestedUsersCache(group);
    }, [group]);

    const removeUser = useCallback((userId: string) => {
        setUsers(prevUsers => {
            const updatedUsers = prevUsers.filter(user => user.id !== userId);
            // Update cache with the new filtered list
            setSuggestedUsersCache(group, updatedUsers);
            return updatedUsers;
        });
    }, [group]);

    const addUser = useCallback((user: GithubUser) => {
        setUsers(prevUsers => {
            // Check if user already exists to prevent duplicates
            const userExists = prevUsers.some(u => u.githubUsername === user.githubUsername);
            if (userExists) {
                return prevUsers;
            }
            const updatedUsers = [...prevUsers, user];
            // Update cache with the new user added
            setSuggestedUsersCache(group, updatedUsers);
            return updatedUsers;
        });
    }, [group]);

    const updateUser = useCallback((updatedUser: GithubUser) => {
        setUsers(prevUsers => {
            const updatedUsers = prevUsers.map(user =>
                user.githubUsername === updatedUser.githubUsername ? updatedUser : user
            );
            setSuggestedUsersCache(group, updatedUsers);
            return updatedUsers;
        });
    }, [group]);

    const addLoadingSkeleton = useCallback((identifier: string) => {
        setLoadingSkeletons(prev => new Set([...prev, identifier]));
    }, []);

    const removeLoadingSkeleton = useCallback((identifier: string) => {
        setLoadingSkeletons(prev => {
            const newSet = new Set(prev);
            newSet.delete(identifier);
            return newSet;
        });
    }, []);

    return {
        users: isHomePage ? users : [],
        isLoading: isHomePage ? isLoading : false,
        loadingSkeletons: isHomePage ? loadingSkeletons : new Set(),
        refetch,
        clearCache,
        removeUser,
        addUser,
        updateUser,
        addLoadingSkeleton,
        removeLoadingSkeleton
    };
}

// Export utility functions for external use
export { clearSuggestedUsersCache, getSuggestedUsersCache };
