import { GithubUser, RateLimit, CollaborationStyleMetrics, DeveloperImpactMetrics, CodeQualityIndicators, TechnicalProfile, RepositoryAnalytics, SkillProgressionMetrics } from '@/types/github';

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

export async function fetchDashboardAnalytics(username: string): Promise<{
  repositoryAnalytics: RepositoryAnalytics;
  technicalProfile: TechnicalProfile;
  contributionsTimeSeries: ContributionTimeSeries;
  rateLimit: RateLimit;
}> {
  const response = await fetch(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query AnalyticsDashboard($username: String!) {
            user(username: $username) {
              githubUsername
              name
              
              repositoryAnalytics {
                totalRepositories
                activeRepositories
                completionRate
                topicDistribution {
                  topic
                  repositoryCount
                  percentage
                }
              }
              
              technicalProfile {
                primaryLanguages {
                  language
                  linesOfCode
                  proficiencyLevel
                }
                specializationScore
                versatilityScore
              }
            }
            
            contributionsTimeSeries(
              username: $username
              timeFrame: MONTHLY
              contributionTypes: [COMMIT, PULL_REQUEST]
            ) {
              points {
                date
                count
              }
              totalCount
            }
            
            rateLimit {
              remaining
              resetAt
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
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch dashboard analytics');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return {
    repositoryAnalytics: data.data.user.repositoryAnalytics,
    technicalProfile: data.data.user.technicalProfile,
    contributionsTimeSeries: data.data.contributionsTimeSeries,
    rateLimit: data.data.rateLimit
  };
}

export async function fetchNestedComplexData(username: string): Promise<Record<string, unknown>> {
  const response = await fetch(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query NestedComplexQuery($username: String!) {
            user(username: $username) {
              githubUsername
              repositories {
                name
                codeMetrics {
                  languageDistribution {
                    language
                    percentage
                  }
                  complexity {
                    score
                    factors
                  }
                }
                readmeQuality {
                  score
                  hasIntroduction
                  hasUsageExamples
                }
              }
              technicalProfile {
                primaryLanguages {
                  language
                  proficiencyLevel
                }
                frameworksUsed {
                  name
                  category
                  frequency
                }
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
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch complex data');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return data.data.user;
}

export async function fetchSkillProgressionData(username: string): Promise<SkillProgressionMetrics> {
  const response = await fetch(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query SkillProgressionQuery($username: String!) {
            skillProgressionMetrics(username: $username) {
              username
              languageProgression {
                language
                year
                repositoryCount
                linesOfCode
                proficiencyLevel
              }
              technologyProgression {
                technology
                category
                year
                repositoryCount
                adoptionSpeed
              }
              newTechnologiesAdoptedByYear
              learningRate
              experimentationFrequency
              lastUpdated
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
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch skill progression data');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return data.data.skillProgressionMetrics;
}

export async function fetchCollaborationMetrics(username: string): Promise<CollaborationStyleMetrics> {
  const response = await fetch(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query CollaborationStyleQuery($username: String!) {
            collaborationStyleMetrics(username: $username) {
              username
              pullRequestsCreated
              pullRequestsReviewed
              issuesCreated
              issuesResolved
              contributedRepositoriesCount
              ownRepositoriesCount
              codeReviewParticipation
              issueParticipation
              soloVsTeamScore
              communityCollaborationScore
              mainlyMaintainer
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
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch collaboration metrics');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return data.data.collaborationStyleMetrics;
}

export async function fetchDeveloperImpactMetrics(username: string): Promise<DeveloperImpactMetrics> {
  const response = await fetch(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query DeveloperImpactQuery($username: String!) {
            developerImpactMetrics(username: $username) {
              username
              totalStars
              totalForks
              totalWatchers
              dependentRepositoriesCount
              communityInfluenceScore
              mostImpactfulRepositories
              starsTrend {
                date
                count
              }
              forksTrend {
                date
                count
              }
              specializationScore
              generalizationScore
              lastUpdated
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
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch developer impact metrics');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return data.data.developerImpactMetrics;
}

export async function fetchCodeQualityMetrics(username: string, repositoryName: string): Promise<CodeQualityIndicators> {
  const response = await fetch(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query CodeQualityQuery($username: String!, $repositoryName: String!) {
            codeQualityMetrics(username: $username, repositoryName: $repositoryName) {
              commitMessageQualityScore
              codeOrganizationScore
              averageCommitMessageLength
              conventionalCommitPercentage
              commentToCodeRatio
              testCoverageEstimate
              lastUpdated
            }
          }
        `,
        variables: {
          username,
          repositoryName,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch code quality metrics');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return data.data.codeQualityMetrics;
}

// Add comprehensive analytics fetcher for dashboard
export async function fetchComprehensiveAnalytics(username: string): Promise<{
  skillProgression: SkillProgressionMetrics | null;
  collaborationStyle: CollaborationStyleMetrics | null;
  developerImpact: DeveloperImpactMetrics | null;
  rateLimit: RateLimit;
}> {
  const response = await fetch(
    `${API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query ComprehensiveAnalytics($username: String!) {
            skillProgressionMetrics(username: $username) {
              username
              languageProgression {
                language
                year
                repositoryCount
                linesOfCode
                proficiencyLevel
              }
              learningRate
              experimentationFrequency
              lastUpdated
            }
            
            collaborationStyleMetrics(username: $username) {
              username
              pullRequestsCreated
              pullRequestsReviewed
              issuesCreated
              issuesResolved
              codeReviewParticipation
              soloVsTeamScore
              communityCollaborationScore
            }
            
            developerImpactMetrics(username: $username) {
              username
              totalStars
              totalForks
              communityInfluenceScore
              starsTrend {
                date
                count
              }
              forksTrend {
                date
                count
              }
              lastUpdated
            }
            
            rateLimit {
              limit
              remaining
              resetAt
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
    throw new Error(errorData?.errors?.[0]?.message || 'Failed to fetch comprehensive analytics');
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }
  
  return {
    skillProgression: data.data.skillProgressionMetrics,
    collaborationStyle: data.data.collaborationStyleMetrics,
    developerImpact: data.data.developerImpactMetrics,
    rateLimit: data.data.rateLimit
  };
}
