'use client';


import { useEffect, useState, useCallback } from 'react';
import { getSuggestedUsers } from '@/lib/api-client';
import { GithubUser } from '@/types/github';

// Module-level cache

let suggestedUsersCache: GithubUser[] | null = null;

export function useSuggestedUsers() {
  const [users, setUsers] = useState<GithubUser[]>(suggestedUsersCache || []);
  const [isLoading, setIsLoading] = useState(!suggestedUsersCache);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(!!suggestedUsersCache);

  const fetchSuggestedUsers = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const fetchedUsers = await getSuggestedUsers();
      suggestedUsersCache = fetchedUsers;
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