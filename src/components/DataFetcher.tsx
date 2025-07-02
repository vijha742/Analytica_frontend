'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSuggestedUsers } from '@/lib/api-client';
import { GithubUser } from '@/types/github';


// Use a client-side cache (window property) to avoid server sharing
function getSuggestedUsersCache(): GithubUser[] | null {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    return window.__suggestedUsersCache || null;
  }
  return null;
}
function setSuggestedUsersCache(users: GithubUser[]) {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__suggestedUsersCache = users;
  }
}


export function useSuggestedUsers() {
  const [users, setUsers] = useState<GithubUser[]>(getSuggestedUsersCache() || []);
  const [isLoading, setIsLoading] = useState(!getSuggestedUsersCache());
  const [hasLoadedOnce, setHasLoadedOnce] = useState(!!getSuggestedUsersCache());

  const fetchSuggestedUsers = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const fetchedUsers = await getSuggestedUsers();
      setSuggestedUsersCache(fetchedUsers);
      setUsers(fetchedUsers);
      setHasLoadedOnce(true);
    } catch (error) {
      console.error('Failed to fetch suggested users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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