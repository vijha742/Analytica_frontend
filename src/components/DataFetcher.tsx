'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSuggestedUsers } from '@/lib/api-client';
import { GithubUser } from '@/types/github';

function getSuggestedUsersCache(): GithubUser[] | null {
  if (typeof window !== 'undefined') {
    // @ts-expect-error: Accessing custom property on window for suggested users cache
    return window.__suggestedUsersCache || null;
  }
  return null;
}
function setSuggestedUsersCache(users: GithubUser[]) {
  if (typeof window !== 'undefined') {
    // @ts-expect-error: Setting custom property on window for suggested users cache
    window.__suggestedUsersCache = users;
  }
}


export function useSuggestedUsers() {
  const cached = getSuggestedUsersCache() || [];
  const [users, setUsers] = useState<GithubUser[]>(cached);
  const [isLoading, setIsLoading] = useState(cached.length === 0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(cached.length > 0);

  const fetchSuggestedUsers = useCallback(async (isInitial = false) => {
    if (isInitial && users.length === 0) setIsLoading(true);
    try {
      const fetchedUsers = await getSuggestedUsers();
      if (Array.isArray(fetchedUsers) && fetchedUsers.length > 0) {
        setSuggestedUsersCache(fetchedUsers);
        setUsers(fetchedUsers);
      } else {
        // If fetch fails or returns empty, do not clear the UI, just log
        console.warn('[DataFetcher] Warning: fetchedUsers is empty, keeping previous users.');
      }
      setHasLoadedOnce(true);
    } catch (error) {
      console.error('Failed to fetch suggested users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [users.length]);

  useEffect(() => {
    if (!hasLoadedOnce) {
      fetchSuggestedUsers(true);
    }
  }, [fetchSuggestedUsers, hasLoadedOnce]);

  const refetch = useCallback(() => fetchSuggestedUsers(false), [fetchSuggestedUsers]);

  return { users, isLoading, refetch };
}

export default function DataFetcher() {
  useSuggestedUsers();
  return null;
}