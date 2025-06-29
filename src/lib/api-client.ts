import { GithubUser, Repository, Contribution, ContributionTimeSeriesAPI, CodeAnalysis, ReadmeAnalysis, TechAnalysis } from '@/types/github';


export async function fetchTechAnalysis(username: string): Promise<TechAnalysis> {
  try {
    const response = await fetch(`http://localhost:8080/api/u/${username}/tech-analysis`);

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
    const response = await fetch(`http://localhost:8080/api/u/${username}/readme-analysis`);

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
    const response = await fetch(`http://localhost:8080/api/u/${username}/code-analysis`);

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
    const response = await fetch(`http://localhost:8080/api/users/${username}`);

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
  const response = await fetch(
    `http://localhost:8080/graphql`,
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
  const response = await fetch(`http://localhost:8080/api/suggested-users`);
  if (!response.ok) {
    throw new Error('Failed to fetch suggested users');
  }
  return response.json();
}

export async function suggestUser(githubUsername: string, suggestedBy: string): Promise<void> {
  const response = await fetch(
    `http://localhost:8080/api/suggested-users?githubUsername=${encodeURIComponent(githubUsername)}&suggestedBy=${encodeURIComponent(suggestedBy)}`,
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
    const response = await fetch(`http://localhost:8080/api/users/${username}/contrib-cal`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching contribution time-series:', error);
    throw error;
  }
}

export const refreshUser = async (githubUsername: string): Promise<GithubUser> => {
  try {
    const response = await fetch(
      `http://localhost:8080/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation($githubUsername: String!) {
              refreshUserData(githubUsername: $githubUsername) {
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
            githubUsername,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to refresh user data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(data.errors[0].message || 'Error refreshing user data');
    }

    if (!data.data?.refreshUserData) {
      throw new Error('No user data returned from refresh');
    }

    // Convert the backend SuggestedUser data to match our frontend GithubUser interface
    const userData = data.data.refreshUserData;

    // Map the response to our GithubUser type, adjusting any field mismatches
    const mappedUser: GithubUser = {
      ...userData,
      repositories: userData.repositories.map((repo: {
        id: string;
        name: string;
        description: string;
        language: string;
        stargazerCount: number;
        forkCount: number;
        isPrivate: boolean;
        createdAt: string;
        updatedAt: string;
      }) => ({
        ...repo,
      })),
      lastUpdated: userData.lastUpdated || new Date().toISOString(),
    };

    return mappedUser;
  } catch (error) {
    console.error('Error in refreshUser:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to refresh user data. Please try again later.');
  }
};

export async function deactivateSuggestedUser(id: number): Promise<void> {
  const response = await fetch(`http://localhost:8080/api/suggested-users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to deactivate suggested user');
  }
}

export async function isUserSuggested(githubUsername: string): Promise<boolean> {
  const response = await fetch(`http://localhost:8080/api/suggested-users/check/${encodeURIComponent(githubUsername)}`);
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
    const response = await fetch(
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