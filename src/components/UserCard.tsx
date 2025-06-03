import { GithubUser, ContributionType, TimeFrame, ContributionTimeSeries } from '@/types/github';
import * as Dialog from '@radix-ui/react-dialog';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { FiUsers, FiGitBranch, FiStar, FiGitPullRequest, FiGitCommit, FiAlertCircle, FiRefreshCw, FiChevronRight, FiCalendar, FiChevronLeft } from 'react-icons/fi';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { refreshUser, fetchContributionTimeSeries } from '@/lib/api';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

interface UserCardProps {
  user: GithubUser;
  onRefresh?: (updatedUser: GithubUser) => void;
  isRefreshing?: boolean;
  onUserNavigation?: (direction: 'prev' | 'next') => void;
}

function formatDate(dateStr: string | Date | null | undefined) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function UserCard({ user, onRefresh, isRefreshing: externalIsRefreshing, onUserNavigation }: UserCardProps) {
  const [open, setOpen] = useState(false);
  const [localIsRefreshing, setLocalIsRefreshing] = useState(false);
  const [timeSeriesData, setTimeSeriesData] = useState<ContributionTimeSeries | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>(TimeFrame.WEEKLY);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<GithubUser>(user);
  
  // Use either external or local refreshing state
  const isRefreshing = externalIsRefreshing || localIsRefreshing;

  // Update local user state when prop changes
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  // Handle user navigation with explicit function to prevent any closure issues
  const handleUserNavigation = useCallback((direction: 'prev' | 'next') => {
    if (onUserNavigation) {
      console.log(`Navigating ${direction}`); // For debugging
      onUserNavigation(direction);
    }
  }, [onUserNavigation]);

  const refreshTimeSeriesData = useCallback(async () => {
    if (!currentUser?.githubUsername) return;
    
    setIsLoadingChart(true);
    try {
      const data = await fetchContributionTimeSeries(
        currentUser.githubUsername,
        selectedTimeFrame
      );
      setTimeSeriesData(data);
    } catch (err) {
      console.error("Error fetching contribution time series:", err);
      // Don't show error to user, just log it
    } finally {
      setIsLoadingChart(false);
    }
  }, [currentUser?.githubUsername, selectedTimeFrame]);

  // Handle refresh click with improved error handling
  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple concurrent refreshes
    
    setLocalIsRefreshing(true);
    setRefreshError(null);
    
    try {
      const refreshedUser = await refreshUser(currentUser.githubUsername);
      
      // Update local state first
      setCurrentUser(refreshedUser);
      
      // Call parent callback if provided
      if (onRefresh) {
        onRefresh(refreshedUser);
      }
      
      // Also refresh time series data if drawer is open
      if (open) {
        await refreshTimeSeriesData();
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setRefreshError(error instanceof Error ? error.message : 'Failed to refresh user data');
    } finally {
      setLocalIsRefreshing(false);
    }
  };

  // Fetch time series data when drawer opens or time frame changes
  useEffect(() => {
    if (open && currentUser?.githubUsername) {
      refreshTimeSeriesData();
    }
  }, [open, currentUser?.githubUsername, selectedTimeFrame, refreshTimeSeriesData]);

  // Most used languages
  const languageStats = useMemo(() => {
    const langCount: Record<string, number> = {};
    currentUser.repositories?.forEach(repo => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });
    return Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [currentUser.repositories]);

  // Most recently updated repo
  const recentRepo = useMemo(() => {
    if (!currentUser.repositories || currentUser.repositories.length === 0) return null;
    return [...currentUser.repositories].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  }, [currentUser.repositories]);

  // Chart data for Time Series
  const timeSeriesChartData = useMemo(() => {
    if (!timeSeriesData || !timeSeriesData.points || timeSeriesData.points.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Contributions',
            data: [],
            borderColor: 'rgba(79, 70, 229, 1)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      };
    }

    return {
      // Use chartDate property if available, otherwise fall back to regular date formatting
      labels: timeSeriesData.points.map(point => point.chartDate || formatDate(point.date)),
      datasets: [
        {
          label: 'Contributions',
          data: timeSeriesData.points.map(point => point.count),
          borderColor: 'rgba(79, 70, 229, 1)',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [timeSeriesData]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: true, color: 'rgba(0, 0, 0, 0.1)' } },
      x: { grid: { display: false } },
    },
  };

  if (!currentUser) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-300">User data not available</p>
      </div>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="space-y-4 max-w-xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-800 flex flex-col relative transition-colors">
        {/* Basic Info */}
        <div className="flex items-center space-x-4">
          {currentUser.avatarUrl ? (
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src={currentUser.avatarUrl}
                alt={`${currentUser.name || currentUser.githubUsername}'s avatar`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
              <FiUsers className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {currentUser.name || currentUser.githubUsername}
            </h2>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium truncate">@{currentUser.githubUsername}</p>
            {currentUser.bio ? (
              <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm line-clamp-2 min-h-[2.5rem]">
                {currentUser.bio}
              </p>
            ) : (
              <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm min-h-[2.5rem]">
                {/* Empty bio placeholder */}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`https://github.com/${currentUser.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition-colors"
            >
              View Profile
            </a>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center justify-center gap-1 px-3 py-1 rounded-md ${
                isRefreshing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } text-white text-sm font-semibold shadow transition-colors`}
            >
              <FiRefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        
        {/* Error Message (if any) */}
        {refreshError && (
          <div className="p-2 bg-red-100 text-red-800 rounded-md text-sm">
            {refreshError}
          </div>
        )}
        
        {/* Stats */}
        <div className="mt-2 grid grid-cols-4 gap-2 bg-white/70 dark:bg-gray-800/70 rounded-lg p-2">
          <div className="flex flex-col items-center">
            <FiUsers className="w-4 h-4 text-indigo-500 mb-0.5" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{currentUser.followersCount || 0}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <FiUsers className="w-4 h-4 text-indigo-500 mb-0.5" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{currentUser.followingCount || 0}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <FiGitBranch className="w-4 h-4 text-indigo-500 mb-0.5" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{currentUser.publicReposCount || 0}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Repos</span>
          </div>
          <div className="flex flex-col items-center">
            <FiStar className="w-4 h-4 text-indigo-500 mb-0.5" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{currentUser.totalContributions || 0}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Contribs</span>
          </div>
        </div>
        {/* Most Used Languages */}
        {languageStats.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {languageStats.map(([lang, count]) => (
              <span key={lang} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                {lang} <span className="ml-1 text-[10px]">({count})</span>
              </span>
            ))}
          </div>
        )}
        {/* Recently Updated Repo */}
        {recentRepo && (
          <div className="mt-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">Recently Updated Repo:</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(recentRepo.updatedAt)}</span>
            </div>
            <div className="mt-1">
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">{recentRepo.name}</span>
              {recentRepo.language && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  {recentRepo.language}
                </span>
              )}
              {recentRepo.description ? (
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 min-h-[2.5rem]">
                  {recentRepo.description}
                </p>
              ) : (
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 min-h-[2.5rem]">
                  {/* Empty repo description placeholder */}
                </p>
              )}
            </div>
          </div>
        )}
        {/* Drawer Trigger */}
        <Dialog.Trigger asChild>
          <button className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">
            View Full Details <FiChevronRight className="w-4 h-4" />
          </button>
        </Dialog.Trigger>
      </div>
      {/* Drawer Content */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-gray-900 z-50 shadow-xl p-6 overflow-y-auto flex flex-col">
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl font-bold">&times;</button>
          </Dialog.Close>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-0">
              {currentUser.name || currentUser.githubUsername}{" "}
              <span className="text-indigo-600 dark:text-indigo-400">@{currentUser.githubUsername}</span>
            </h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center justify-center gap-1 px-3 py-1 rounded-md ${
                isRefreshing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } text-white text-sm font-semibold shadow transition-colors`}
            >
              <FiRefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          
          {/* Error Message (if any) */}
          {refreshError && (
            <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-md">
              {refreshError}
            </div>
          )}
          
          {currentUser.bio && <p className="mb-2 text-gray-600 dark:text-gray-300">{currentUser.bio}</p>}
          <div className="mb-4 flex flex-wrap gap-2">
            {languageStats.map(([lang, count]) => (
              <span key={lang} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                {lang} <span className="ml-1 text-[10px]">({count})</span>
              </span>
            ))}
          </div>
          
          {/* Activity Overview - Time Series Chart */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Activity Overview</h3>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-gray-500" />
                <select 
                  value={selectedTimeFrame}
                  onChange={(e) => setSelectedTimeFrame(e.target.value as TimeFrame)}
                  className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md text-sm py-1 px-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={TimeFrame.DAILY}>Daily</option>
                  <option value={TimeFrame.WEEKLY}>Weekly</option>
                  <option value={TimeFrame.MONTHLY}>Monthly</option>
                  <option value={TimeFrame.YEARLY}>Yearly</option>
                </select>
              </div>
            </div>
            
            <div className="h-48 mb-4 relative">
              {isLoadingChart ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : timeSeriesData && timeSeriesData.points && timeSeriesData.points.length > 0 ? (
                <Line data={timeSeriesChartData} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                  No contribution data available for this time period
                </div>
              )}
            </div>
            
            {timeSeriesData && (
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-4">
                <div>Period: {timeSeriesData.readablePeriodStart || formatDate(timeSeriesData.periodStart)} - {timeSeriesData.readablePeriodEnd || formatDate(timeSeriesData.periodEnd)}</div>
                <div>Total: {timeSeriesData.totalCount} contributions</div>
              </div>
            )}

            {/* Total Contributions Summary */}
            <div className="mt-4 grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex flex-col items-center">
                <FiGitCommit className="w-6 h-6 text-indigo-500 mb-1" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {currentUser.contributions?.filter(c => c.type === ContributionType.COMMIT)?.reduce((sum, c) => sum + c.count, 0) || 0}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Commits</span>
              </div>
              <div className="flex flex-col items-center">
                <FiGitPullRequest className="w-6 h-6 text-indigo-500 mb-1" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {currentUser.contributions?.filter(c => c.type === ContributionType.PULL_REQUEST)?.reduce((sum, c) => sum + c.count, 0) || 0}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Pull Requests</span>
              </div>
              <div className="flex flex-col items-center">
                <FiAlertCircle className="w-6 h-6 text-indigo-500 mb-1" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {currentUser.contributions?.filter(c => c.type === ContributionType.ISSUE)?.reduce((sum, c) => sum + c.count, 0) || 0}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Issues</span>
              </div>
            </div>
          </div>
          
          {/* All Repositories */}
          {currentUser.repositories && currentUser.repositories.length > 0 ? (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">All Repositories</h3>
              <div className="grid grid-cols-1 gap-3">
                {currentUser.repositories
                  .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                  .map((repo) => (
                    <div
                      key={repo.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{repo.name}</h4>
                          {repo.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {repo.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 ml-3">
                            <div className="text-center">
                              <p className="text-gray-900 dark:text-white text-sm font-semibold">{repo.stargazerCount || 0}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-300">Stars</p>
                            </div>
                          <div className="text-center">
                            <p className="text-gray-900 dark:text-white text-sm font-semibold">{repo.forkCount || 0}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Forks</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          {repo.language ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                              {repo.language}
                            </span>
                          ) : (
                            <span className="inline-block w-2"></span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Updated {formatDate(repo.updatedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-400">No repositories available</p>
            </div>
          )}
          {/* Last refreshed time */}
          {/* {(currentUser.lastRefreshed || currentUser.lastUpdated) && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-4 mb-16">
              Last refreshed: {formatDate(currentUser.lastRefreshed) || formatDate(currentUser.lastUpdated)}
            </p>
          )}
           */}
          {/* Floating Navigation Widget - Properly centered in the drawer only */}
          {onUserNavigation && (
            <div className="fixed bottom-6 right-0 mr-auto ml-auto left-0 w-fit max-w-[calc(100%-48px)] z-[60] flex items-center gap-3 px-4 py-2 bg-gray-800/80 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-700/30" style={{ maxWidth: 'calc(100% - 48px)', width: 'fit-content', transform: 'none', left: '0', right: '0', marginLeft: 'auto', marginRight: 'auto' }}>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUserNavigation('prev');
                }}
                className="flex items-center justify-center p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                title="Previous user"
                type="button"
              >
                <FiChevronLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-sm text-white/90 font-medium">Browse Users</span>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUserNavigation('next');
                }}
                className="flex items-center justify-center p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                title="Next user"
                type="button"
              >
                <FiChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="space-y-4 max-w-xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-800 flex flex-col relative transition-colors">
      {/* Basic Info */}
      <div className="flex items-center space-x-4">
        {/* Avatar skeleton */}
        <div className="relative w-16 h-16 shrink-0">
          <Skeleton className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-800/30" />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          {/* Name skeleton */}
          <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700" />
          {/* Username skeleton */}
          <Skeleton className="h-4 w-1/2 bg-indigo-100 dark:bg-indigo-800/30" />
          {/* Bio skeleton */}
          <Skeleton className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="w-24 h-8 bg-indigo-100 dark:bg-indigo-800/30" />
          <Skeleton className="w-24 h-8 bg-green-100 dark:bg-green-800/30" />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-2 grid grid-cols-4 gap-2 bg-white/70 dark:bg-gray-800/70 rounded-lg p-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-1">
            <Skeleton className="w-4 h-4 bg-indigo-100 dark:bg-indigo-800/30" />
            <Skeleton className="w-8 h-4 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="w-12 h-3 bg-gray-100 dark:bg-gray-800" />
          </div>
        ))}
      </div>

      {/* Language tags */}
      <div className="flex flex-wrap gap-2 mt-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-6 w-20 bg-indigo-100 dark:bg-indigo-800/30 rounded-full" />
        ))}
      </div>

      {/* Recent repo skeleton */}
      <div className="mt-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700" />
        </div>
        <Skeleton className="h-4 w-2/3 bg-indigo-100 dark:bg-indigo-800/30 mb-2" />
        <Skeleton className="h-8 w-full bg-gray-100 dark:bg-gray-800" />
      </div>

      {/* View details button skeleton */}
      <Skeleton className="mt-3 w-full h-10 bg-indigo-100 dark:bg-indigo-800/30 rounded-lg" />
    </div>
  );
}