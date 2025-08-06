import { GithubUser, ContributionTimeSeriesAPI, CodeAnalysis, ReadmeAnalysis, TechAnalysis } from '@/types/github';
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

export async function getSuggestedUsers(): Promise<GithubUser[]> {
  const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users?team=Classmates`);
  if (!response.ok) {
    throw new Error('Failed to fetch suggested users');
  }
  return response.json();
}

export async function suggestUser(githubUsername: string, team: string): Promise<void> {
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

export async function fetchContributionTimeSeries(username: string): Promise<ContributionTimeSeriesAPI> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/public/users/${username}/contrib-cal`);

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
    const response = await makeAuthenticatedRequest(`${API_BASE_URL}/api/suggested-users/refresh?githubUsername=${encodeURIComponent(githubUsername)}&team=${encodeURIComponent(team)}`, { method: 'POST', });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching code analysis:', error);
    throw error;
  }
}

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

export async function searchUsers(query: string, limit: number = 10, offset: number = 0): Promise<GithubUser[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error('API URL not configured');
    throw new Error('Internal configuration error');
  }

  try {
    const response = await makeAuthenticatedRequest(
      `${apiUrl}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query($query: String!, $limit: Int, $offset: Int) {
              searchUsers(query: $query, limit: $limit, offset: $offset) {
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
                repositoriesLegacy {
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
            query: query.toLowerCase().trim(),
            limit,
            offset,
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Search request failed:', response.status, response.statusText);
      throw new Error('Search request failed');
    }

    const result = await response.json();

    // Handle GraphQL errors
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error(result.errors[0]?.message || 'Search request failed');
    }

    // Ensure we have valid data
    if (!result.data?.searchUsers) {
      return [];
    }

    return result.data.searchUsers;
  } catch (error) {
    console.error('Search users error:', error);
    throw error instanceof Error ? error : new Error('Failed to search users');
  }
}