import { GithubUser, ContributionTimeSeriesAPI, CodeAnalysis, ReadmeAnalysis, TechAnalysis, UserComparisonResponse } from '@/types/github';
import { makeAuthenticatedRequest } from './auth-api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchTechAnalysis(username: string): Promise<TechAnalysis> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/u/${username}/tech-analysis`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tech analysis:', error);
    throw error;
  }
}

export async function fetchReadmeAnalysis(username: string): Promise<ReadmeAnalysis[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/u/${username}/readme-analysis`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching readme analysis:', error);
    throw error;
  }
}

export async function fetchCodeAnalysis(username: string): Promise<CodeAnalysis[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/u/${username}/code-analysis`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching code analysis:', error);
    throw error;
  }
}

export async function fetchUserData(username: string): Promise<GithubUser> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/users/${username}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

export async function fetchUser(username: string): Promise<GithubUser> {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query($username: String!) {
            user(username: $username) {
              id
              githubUsername
              name
              email
              avatarUrl
              bio
              followersCount
              followingCount
              publicReposCount
              totalContributions
              lastUpdated
              repositories {
                id
                name
                description
                language
                stargazerCount
                forkCount
                isPrivate
                createdAt
                updatedAt
              }
              contributions {
                id
                date
                count
                type
              }
            }
          }
        `,
        variables: {
          username,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch user data');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data.user;
}

export async function getSuggestedUsers(group: string = 'Classmates'): Promise<GithubUser[]> {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users?team=${encodeURIComponent(group)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch suggested users');
  }
  return response.json();
}

export async function suggestUser(githubUsername: string, team: string = 'Classmates'): Promise<void> {
  const response = await makeAuthenticatedRequest(
    `${API_BASE_URL}/api/suggested-users?githubUsername=${encodeURIComponent(githubUsername)}&team=${encodeURIComponent(team)}`,
    {
      method: 'POST',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to suggest user');
  }
}

export async function fetchContributionTimeSeries(username: string, mode: string): Promise<ContributionTimeSeriesAPI> {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/public/users/${username}/contrib-cal?mode=${encodeURIComponent(mode)}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching contribution time-series:', error);
    throw error;
  }
}

export const refreshUser = async (githubUsername: string, team: string): Promise<GithubUser> => {
  try {
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users/refresh?githubUsername=${encodeURIComponent(githubUsername)}&team=${encodeURIComponent(team)}`,
      {
        method: 'POST',
      }
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching code analysis:', error);
    throw error;
  }
}

export const compareUsers = async (user1: string, user2: string): Promise<UserComparisonResponse> => {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users/compare?User1=${encodeURIComponent(user1)}&User2=${encodeURIComponent(user2)}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return await response.json();
};

export async function deactivateSuggestedUser(id: number): Promise<void> {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to deactivate suggested user');
  }
}

export async function isUserSuggested(githubUsername: string): Promise<boolean> {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users/check/${encodeURIComponent(githubUsername)}`);
  if (!response.ok) {
    throw new Error('Failed to check if user is suggested');
  }
  return response.json();
}

export async function searchUsers(query: string, limit: number = 10): Promise<GithubUser[]> {

  try {
    const response = await makeAuthenticatedRequest(
      `${API_BASE_URL}/api/public/users/search?keyword=${encodeURIComponent(query)}&limit=${limit}`,
      {
        method: 'GET'
      }
    );

    if (!response.ok) {
      console.error('Search request failed:', response.status, response.statusText);
      throw new Error('Search request failed');
    }

    const result = await response.json();
    if (Array.isArray(result)) {
      return result;
    }
    return [];
  } catch (error) {
    console.error('Search users error:', error);
    throw error instanceof Error ? error : new Error('Failed to search users');
  }
}