'use client';

import { useEffect, useState } from 'react';
import { getSuggestedUsers } from '@/lib/api-client';
import { GithubUser } from '@/types/github';

export function useSuggestedUsers() {
  const [users, setUsers] = useState<GithubUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedUsers = await getSuggestedUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch suggested users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, isLoading };
}

export default function DataFetcher() {
  useSuggestedUsers();
  return null;
} 