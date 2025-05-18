import { GithubUser, RateLimit } from '@/types/github';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

export async function fetchUser(username: string): Promise<GithubUser> {
  const response = await fetch(
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
              totalIssueContributions
              totalPullRequestContributions
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

export async function fetchRateLimit(): Promise<RateLimit> {
  const response = await fetch(`${API_BASE_URL}/api/users/rate-limit`);
  if (!response.ok) {
    throw new Error('Failed to fetch rate limit');
  }
  return response.json();
}

export async function searchUsers(query: string, limit: number = 10, offset: number = 0): Promise<GithubUser[]> {
  const response = await fetch(
    `${API_BASE_URL}/graphql`,
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
              totalIssueContributions
              totalPullRequestContributions
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
          query: query.toLowerCase(),
          limit,
          offset,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to search users');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data.searchUsers;
}

export async function getSuggestedUsers(): Promise<GithubUser[]> {
  const response = await fetch(`${API_BASE_URL}/api/suggested-users`);
  if (!response.ok) {
    throw new Error('Failed to fetch suggested users');
  }
  return response.json();
}

export async function suggestUser(githubUsername: string, suggestedBy: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/suggested-users?githubUsername=${encodeURIComponent(githubUsername)}&suggestedBy=${encodeURIComponent(suggestedBy)}`,
    {
      method: 'POST',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to suggest user');
  }
}

export async function deactivateSuggestedUser(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/suggested-users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to deactivate suggested user');
  }
}

export async function isUserSuggested(githubUsername: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/api/suggested-users/check/${encodeURIComponent(githubUsername)}`);
  if (!response.ok) {
    throw new Error('Failed to check if user is suggested');
  }
  return response.json();
}

export const refreshUser = async (githubUsername: string): Promise<GithubUser> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/graphql`,
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
                totalIssueContributions
                totalPullRequestContributions
                lastRefreshed
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
    console.log(userData)
    
    // Map the response to our GithubUser type, adjusting any field mismatches
    const mappedUser: GithubUser = {
      ...userData,
      // Map any mismatched fields if needed
      repositories: userData.repositories.map((repo: any) => ({
        ...repo,
        forks: repo.forkCount, // Ensure correct mapping between forkCount and forks
        // Add any other field mapping needed
      })),
      // Ensure dates are handled correctly
      lastUpdated: userData.lastRefreshed || new Date().toISOString(),
      totalPullRequestContributions: userData.totalPullRequestContributions,
      totalIssueContributions: userData.totalIssueContributions,
    };
    
    return mappedUser;
  } catch (error) {
    console.error('Error in refreshUser:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to refresh user data. Please try again later.');
  }
};

export interface TimeSeriesDataPoint {
  date: string;
  count: number;
  readableDate?: string;
  chartDate?: string;
}

export interface ContributionTimeSeries {
  points: TimeSeriesDataPoint[];
  totalCount: number;
  periodStart: string;
  periodEnd: string;
  readablePeriodStart?: string;
  readablePeriodEnd?: string;
}

export async function fetchContributionTimeSeries(
  username: string,
  timeFrame: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
  startDate?: string,
  endDate?: string,
  contributionTypes?: string[]
): Promise<ContributionTimeSeries> {
  const response = await fetch(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query($username: String!, $timeFrame: TimeFrame!, $startDate: String, $endDate: String, $contributionTypes: [ContributionType!]) {
            contributionsTimeSeries(
              username: $username,
              timeFrame: $timeFrame,
              startDate: $startDate,
              endDate: $endDate,
              contributionTypes: $contributionTypes
            ) {
              points {
                date
                readableDate
                chartDate
                count
              }
              totalCount
              periodStart
              periodEnd
              readablePeriodStart
              readablePeriodEnd
            }
          }
        `,
        variables: {
          username,
          timeFrame,
          startDate,
          endDate,
          contributionTypes
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch contribution time series');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  return data.data.contributionsTimeSeries;
}
