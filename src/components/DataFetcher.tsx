
'use client';

declare global {
  interface Window {
    __suggestedUsersCache?: Record<string, GithubUser[]>;
  }
}

import { useEffect, useState, useCallback } from 'react';
import { getSuggestedUsers } from '@/lib/api-client';
import { GithubUser } from '@/types/github';

function getSuggestedUsersCache(group: string): GithubUser[] | null {
  if (typeof window !== 'undefined') {
    const cache = window.__suggestedUsersCache || {};
    return cache[group] || null;
  }
  return null;
}
function setSuggestedUsersCache(group: string, users: GithubUser[]) {
  if (typeof window !== 'undefined') {
    if (!window.__suggestedUsersCache) {
      window.__suggestedUsersCache = {};
    }
    window.__suggestedUsersCache[group] = users;
  }
}


export function useSuggestedUsers(group: string = 'Classmates') {
  const cached = getSuggestedUsersCache(group) || [];
  const [users, setUsers] = useState<GithubUser[]>(cached);
  const [isLoading, setIsLoading] = useState(cached.length === 0);

  const fetchSuggestedUsers = useCallback(async (isInitial = false) => {
    if (isInitial || users.length === 0) setIsLoading(true);
    try {
      const fetchedUsers = await getSuggestedUsers(group);
      if (Array.isArray(fetchedUsers)) {
        setSuggestedUsersCache(group, fetchedUsers);
        setUsers(fetchedUsers);
      } else {
        // If fetch fails or returns empty, set empty array for this group
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch suggested users:', error);
      setUsers([]);
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

  const refetch = useCallback(() => fetchSuggestedUsers(false), [fetchSuggestedUsers]);

  return { users, isLoading, refetch };
}

export default function DataFetcher() {
  useSuggestedUsers();
  return null;
}