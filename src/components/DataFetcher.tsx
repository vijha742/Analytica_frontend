
'use client';

declare global {
  interface Window {
    __suggestedUsersCache?: Record<string, {
      data: GithubUser[],
      timestamp: number,
      expiresAt: number
    }>;
  }
}

import { useEffect, useState, useCallback } from 'react';
import { getSuggestedUsers } from '@/lib/api-client';
import { GithubUser } from '@/types/github';

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


export function useSuggestedUsers(group: string = 'Classmates') {
  const cached = getSuggestedUsersCache(group) || [];
  const [users, setUsers] = useState<GithubUser[]>(cached);
  const [isLoading, setIsLoading] = useState(cached.length === 0);

  const fetchSuggestedUsers = useCallback(async (isInitial = false, bypassCache = false) => {
    if (isInitial || users.length === 0) setIsLoading(true);

    // Check cache first unless bypassing
    if (!bypassCache) {
      const cachedData = getSuggestedUsersCache(group);
      if (cachedData && cachedData.length > 0) {
        setUsers(cachedData);
        setIsLoading(false);
        return;
      }
    }

    try {
      const fetchedUsers = await getSuggestedUsers(group);
      if (Array.isArray(fetchedUsers)) {
        setSuggestedUsersCache(group, fetchedUsers);
        setUsers(fetchedUsers);
      } else {
        // If fetch fails or returns empty, set empty array for this group
        setUsers([]);
        setSuggestedUsersCache(group, []); // Cache empty result to avoid repeated requests
      }
    } catch (error) {
      console.error('Failed to fetch suggested users:', error);
      setUsers([]);
      // Don't cache error results to allow retry
    } finally {
      setIsLoading(false);
    }
  }, [group, users.length]);

  useEffect(() => {
    // Fetch data when group changes or on initial load
    const cachedForGroup = getSuggestedUsersCache(group) || [];
    if (cachedForGroup.length === 0) {
      setIsLoading(true);
      fetchSuggestedUsers(true);
    } else {
      setUsers(cachedForGroup);
      setIsLoading(false);
    }
  }, [fetchSuggestedUsers, group]);

  const refetch = useCallback(() => fetchSuggestedUsers(false, true), [fetchSuggestedUsers]);

  const clearCache = useCallback(() => {
    clearSuggestedUsersCache(group);
  }, [group]);

  return { users, isLoading, refetch, clearCache };
}

// Export utility functions for external use
export { clearSuggestedUsersCache, getSuggestedUsersCache };