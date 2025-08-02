import { GithubUser } from '@/types/github';
import Image from 'next/image';
import { FiExternalLink } from 'react-icons/fi';

interface SimpleUserCardProps {
  user: GithubUser;
  onSelect?: (user: GithubUser) => void;
}

export default function SimpleUserCard({ user, onSelect }: SimpleUserCardProps) {
  return (
    <div
      className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect?.(user)}
    >
      {user.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={`${user.name || user.login}'s avatar`}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-400 dark:text-gray-500">?</span>
        </div>
      )}
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
          {user.name || user.login}
        </h3>
        <p className="text-indigo-600 dark:text-indigo-400 font-medium truncate">
          @{user.login}
        </p>
      </div>
      <a
        href={`https://github.com/${user.login}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        onClick={(e) => e.stopPropagation()} // Prevent the parent onClick from firing
      >
        <FiExternalLink className="w-5 h-5" />
      </a>
    </div>
  );
}