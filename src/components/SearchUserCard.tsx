import React from 'react';
import { GithubUser } from '@/types/github';
import Image from 'next/image';
import { FiUsers } from 'react-icons/fi';

interface SearchUserCardProps {
    user: GithubUser;
    onSelect?: (user: GithubUser) => void;
    onSuggestUser?: (user: GithubUser) => void;
}

export default function SearchUserCard({ user, onSuggestUser }: SearchUserCardProps) {
    const handleSuggest = () => {
        if (onSuggestUser) {
            onSuggestUser(user);
        }
    };
    return (
        <div className="space-y-4 max-w-xl mx-auto bg-gray-50 absolute dark:bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-800 flex flex-col relative transition-colors">
            {/* Basic Info */}
            <div className="flex items-center space-x-4">
                {user.avatarUrl ? (
                    <div className="relative w-16 h-16 shrink-0">
                        <Image
                            src={user.avatarUrl}
                            alt={`${user.name || user.githubUsername}'s avatar`}
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
                        {user.name || user.githubUsername}
                    </h2>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium truncate">@{user.githubUsername}</p>
                    {user.bio ? (
                        <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm line-clamp-2 min-h-[2.5rem]">
                            {user.bio}
                        </p>
                    ) : (
                        <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm min-h-[2.5rem]">
                            {/* Empty bio placeholder */}
                        </p>
                    )}
                </div>
                {/* target="_blank" */}
                <div className="flex flex-col mt-2" >
                    <a
                        href={`https://github.com/${user.githubUsername}`}
                        rel="noopener noreferrer"
                        className="px-3 py-1 flex justify-center items-center rounded-md  mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow transition-colors"
                    >
                        View Profile
                    </a>
                    <button
                        className={`px-3 py-1 flex justify-center items-center rounded-md  mt-4 bg-white text-black text-sm font-semibold shadow transition-colors`}
                        onClick={handleSuggest}
                    >
                        Suggest User
                    </button>
                </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 bg-white/70 dark:bg-gray-800/70 rounded-lg p-2">
                <div className="flex flex-col items-center">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{user.followersCount || 0}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{user.followingCount || 0}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Following</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{user.publicReposCount || 0}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Repos</span>
                </div>
            </div>
        </div>
    );
}