import { useState, useEffect } from 'react';
import { fetchUserData } from '@/lib/user-api';
import { GithubUser, ContributionType } from '@/types/github';
import { dashboardMockData } from '@/lib/enhancedDashboardMockData';

// Convert mock data to GithubUser format for fallback
const fallbackUser: GithubUser = {
  id: parseInt(dashboardMockData.user.id) || 0,
  githubUsername: dashboardMockData.user.username,
  name: dashboardMockData.user.name,
  email: dashboardMockData.user.email,
  avatarUrl: dashboardMockData.user.profilePicture,
  bio: dashboardMockData.user.bio,
  followersCount: dashboardMockData.user.followersCount,
  followingCount: dashboardMockData.user.followingCount,
  publicReposCount: dashboardMockData.user.publicReposCount,
  totalContributions: dashboardMockData.user.totalContributions,
  lastUpdated: new Date(),
  repositories: dashboardMockData.repositories.map(repo => ({
    id: repo.id,
    name: repo.name,
    description: repo.description,
    stargazerCount: repo.stargazerCount,
    forkCount: repo.forkCount,
    language: repo.language,
    updatedAt: repo.updatedAt
  })),
  contributions: dashboardMockData.user.contributions.map(c => ({
    id: c.id.toString(),
    date: c.date,
    count: c.count,
    type: c.type as ContributionType
  }))
};

// Custom hook for user data with fallback
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
          setData(fallbackUser);
          setError(new Error('Failed to load user data'));
        }
      } catch (error) {
        console.error('Error in useUserData:', error);
        setData(fallbackUser);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    if (username) {
      loadData();
    } else {
      setData(fallbackUser);
      setIsLoading(false);
    }
  }, [username]);

  return { data, isLoading, error, isUsingFallback: error !== null };
}
