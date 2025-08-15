export interface Repository {
  id: string;
  name: string;
  description: string;
  language?: string;
  stargazerCount: number;
  forkCount: number;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contribution {
  id: string;
  date: string;
  type: 'COMMIT' | 'PULL_REQUEST' | 'ISSUE';
  count: number;
}

export interface GithubUser {
  id: string;
  githubUsername: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  publicReposCount: number;
  repositories: Repository[];
  contributions: Contribution[];
  lastUpdated: string;
  team: string;
}

export interface LanguageDistribution {
  language: string;
  linesOfCode: number;
  percentage: number;
  fileCount: number;
}

export interface CodeAnalysis {
  title: string;
  totalLines: number;
  languageDistribution: LanguageDistribution[];
  averageFileSize: number;
  complexityScore: number;
  complexityFactors: string[];
}

export interface ReadmeAnalysis {
  title: string;
  score: number;
  hasIntroduction: boolean;
  hasInstallationGuide: boolean;
  hasUsageExamples: boolean;
  hasMaintainerSection: boolean;
  wordCount: number;
  lastUpdated: string;
}

export interface TechLanguage {
  language: string;
  linesOfCode: number;
  yearsOfExperience: number;
  lastUsed: string;
  proficiencyLevel: string;
  projectCount: number;
  trendIndicator: string;
}

export interface TechAnalysis {
  primaryLanguages: TechLanguage[];
  frameworksUsed: string[];
  librariesUsed: string[];
  toolingPreferences: string[];
  specializationScore: number;
  versatilityScore: number;
  learningRate: number;
  experimentationFrequency: number;
}

export enum ContributionType {
  COMMIT = 'COMMIT',
  PULL_REQUEST = 'PULL_REQUEST',
  ISSUE = 'ISSUE',
  REVIEW = 'REVIEW',
  DISCUSSION = 'DISCUSSION',
}

export interface ContributionTimeSeries {
  points: TimeSeriesDataPoint[];
  totalCount: number;
  periodStart: string;
  periodEnd: string;
  readablePeriodStart?: string;
  readablePeriodEnd?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  count: number;
  readableDate?: string;
  chartDate?: string;
}

export enum TimeFrame {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface ContributionWeek {
  firstDay: string;
  contributionDays: ContributionDay[];
}

export interface ContributionTimeSeriesAPI {
  timeSeriesData: Record<string, number>; // Map<LocalDate, Integer>
  mode: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  pull_requests?: number;
  issues?: number;
  commits?: number;
  code_reviews?: number;
  totalContributions?: number;
  weeks: ContributionWeek[];
}
