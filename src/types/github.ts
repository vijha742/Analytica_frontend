export interface GithubUser {
  id: number;
  githubUsername: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  bio: string | null;
  followersCount: number;
  followingCount: number;
  publicReposCount: number;
  totalContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  lastUpdated: Date;
  lastRefreshed: Date;
  repositories: Repository[];
  contributions: Contribution[];
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  stargazerCount: number;
  forkCount: number;
  language: string | null;
  updatedAt: string;
}

export interface Contribution {
  id: string;
  date: string;
  count: number;
  type: ContributionType;
}

export enum ContributionType {
  COMMIT = 'COMMIT',
  PULL_REQUEST = 'PULL_REQUEST',
  ISSUE = 'ISSUE',
  CODE_REVIEW = 'CODE_REVIEW',
}

export interface SuggestedUser {
  id: number;
  githubUsername: string;
  suggestedBy: string;
  suggestedAt: string;
  isActive: boolean;
}

export interface RateLimit {
  limit: number;
  remaining: number;
  resetAt: string;
}

export enum TimeFrame {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface TimeSeriesDataPoint {
  date: string;
  readableDate?: string;
  chartDate?: string;
  count: number;
}

export interface ContributionTimeSeries {
  points: TimeSeriesDataPoint[];
  totalCount: number;
  periodStart: string;
  periodEnd: string;
  readablePeriodStart?: string;
  readablePeriodEnd?: string;
}