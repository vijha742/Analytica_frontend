import Image from 'next/image';
import { GithubUser, ContributionType, TimeFrame, ContributionTimeSeries } from '@/types/github';
import * as Dialog from '@radix-ui/react-dialog';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';
import { FiUsers, FiGitBranch, FiStar, FiGitPullRequest, FiGitCommit, FiAlertCircle, FiEye, FiRefreshCw, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { useMemo, useState, useEffect } from 'react';
import { refreshUser, fetchContributionTimeSeries } from '@/lib/api';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

interface UserCardProps {
  user: GithubUser;
  onRefresh?: (updatedUser: GithubUser) => void;
  isRefreshing?: boolean;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function UserCard({ user, onRefresh, isRefreshing: externalIsRefreshing }: UserCardProps) {
  const [open, setOpen] = useState(false);
  const [localIsRefreshing, setLocalIsRefreshing] = useState(false);
  const [timeSeriesData, setTimeSeriesData] = useState<ContributionTimeSeries | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>(TimeFrame.WEEKLY);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  
  // Use either external or local refreshing state
  const isRefreshing = externalIsRefreshing || localIsRefreshing;

  // Handle refresh click
  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent multiple concurrent refreshes
    
    setLocalIsRefreshing(true);
    try {
      const refreshedUser = await refreshUser(user.githubUsername);
      if (onRefresh) {
        onRefresh(refreshedUser);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Could add toast notification here
    } finally {
      setLocalIsRefreshing(false);
    }
  };

  // Fetch time series data when drawer opens or time frame changes
  useEffect(() => {
    if (open && user?.githubUsername) {
      setIsLoadingChart(true);
      fetchContributionTimeSeries(
        user.githubUsername,
        selectedTimeFrame
      )
      .then(data => {
        setTimeSeriesData(data);
      })
      .catch(err => {
        console.error("Error fetching contribution time series:", err);
      })
      .finally(() => {
        setIsLoadingChart(false);
      });
    }
  }, [open, user?.githubUsername, selectedTimeFrame]);

  // Most used languages
  const languageStats = useMemo(() => {
    const langCount: Record<string, number> = {};
    user.repositories?.forEach(repo => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });
    return Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [user.repositories]);

  // Most recently updated repo
  const recentRepo = useMemo(() => {
    if (!user.repositories || user.repositories.length === 0) return null;
    return [...user.repositories].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  }, [user.repositories]);

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
      labels: timeSeriesData.points.map(point => formatDate(point.date)),
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

  const getContributionIcon = (type: ContributionType) => {
    switch (type) {
      case ContributionType.COMMIT:
        return <FiGitCommit className="w-6 h-6" />;
      case ContributionType.PULL_REQUEST:
        return <FiGitPullRequest className="w-6 h-6" />;
      case ContributionType.ISSUE:
        return <FiAlertCircle className="w-6 h-6" />;
      case ContributionType.CODE_REVIEW:
        return <FiEye className="w-6 h-6" />;
      default:
        return <FiStar className="w-6 h-6" />;
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <div className="space-y-4 max-w-xl mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-800 flex flex-col relative transition-colors">
        {/* Basic Info */}
        <div className="flex items-center space-x-4">
          {user.avatarUrl && (
            <div className="relative w-16 h-16 shrink-0">
              <Image
                src={user.avatarUrl}
                alt={`${user.name}'s avatar`}
                width={64}
                height={64}
                className="rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{user.name}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium truncate">@{user.githubUsername}</p>
            {user.bio && <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{user.bio}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`https://github.com/${user.githubUsername}`}
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
        {/* Stats */}
        <div className="mt-2 grid grid-cols-4 gap-2 bg-white/70 dark:bg-gray-800/70 rounded-lg p-2">
          <div className="flex flex-col items-center">
            <FiUsers className="w-4 h-4 text-indigo-500 mb-0.5" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{user.followersCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <FiUsers className="w-4 h-4 text-indigo-500 mb-0.5" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{user.followingCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <FiGitBranch className="w-4 h-4 text-indigo-500 mb-0.5" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{user.publicReposCount}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Repos</span>
          </div>
          <div className="flex flex-col items-center">
            <FiStar className="w-4 h-4 text-indigo-500 mb-0.5" />
            <span className="font-semibold text-gray-900 dark:text-white text-sm">{user.totalContributions}</span>
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
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{recentRepo.description}</p>
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-0">{user.name} <span className="text-indigo-600 dark:text-indigo-400">@{user.githubUsername}</span></h2>
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
          {user.bio && <p className="mb-2 text-gray-600 dark:text-gray-300">{user.bio}</p>}
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
                <div>Period: {formatDate(timeSeriesData.periodStart)} - {formatDate(timeSeriesData.periodEnd)}</div>
                <div>Total: {timeSeriesData.totalCount} contributions</div>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-2">
              {user.contributions && user.contributions.slice(0, 6).map((contribution) => (
                <div
                  key={contribution.id}
                  className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="text-indigo-600 dark:text-indigo-400">
                    {getContributionIcon(contribution.type as ContributionType)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 dark:text-white text-sm font-medium">
                      {contribution.type}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {formatDate(contribution.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      {contribution.count} {contribution.count === 1 ? 'contribution' : 'contributions'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* All Repositories */}
          {user.repositories && user.repositories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">All Repositories</h3>
              <div className="grid grid-cols-1 gap-3">
                {user.repositories
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
                            <p className="text-gray-900 dark:text-white text-sm font-semibold">{repo.forks || 0}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-300">Forks</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        {repo.language && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                            {repo.language}
                          </span>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Updated {formatDate(repo.updatedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {user.lastRefreshed && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-4">
              Last refreshed: {formatDate(user.lastRefreshed as any)}
            </p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}