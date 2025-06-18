import { GithubUser, Repository, Contribution, ContributionType } from '@/types/github';

export async function fetchUserData(username: string): Promise<GithubUser | null> {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${username}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Convert the API response to match our GithubUser interface
    const user: GithubUser = {
      id: parseInt(data.id) || 0,
      githubUsername: data.githubUsername,
      name: data.name,
      email: data.email || '',
      avatarUrl: data.avatarUrl,
      bio: data.bio,
      followersCount: data.followersCount,
      followingCount: data.followingCount,
      publicReposCount: data.publicReposCount,
      totalContributions: (data.contributions || []).reduce((acc: number, curr: any) => acc + curr.count, 0),
      lastUpdated: new Date(data.lastUpdated),
      repositories: (data.repositories || []).map((repo: any): Repository => ({
        id: parseInt(repo.id) || 0,
        name: repo.name,
        description: repo.description,
        stargazerCount: repo.stargazerCount,
        forkCount: repo.forkCount,
        language: repo.language,
        updatedAt: repo.updatedAt
      })),
      contributions: (data.contributions || []).map((contrib: any): Contribution => ({
        id: contrib.id,
        date: contrib.date,
        count: contrib.count,
        type: contrib.type as ContributionType
      }))
    };
    
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}
