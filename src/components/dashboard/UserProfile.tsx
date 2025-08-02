'use client';

import { Card, CardContent } from '@/components/ui/card';
import { GithubUser } from '@/types/github';
import { Calendar, Users, GitBranch } from 'lucide-react';
import Image from 'next/image';
import '@/app/globals.css'

interface UserProfileProps {
  user: GithubUser;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 rounded-lg p-6 transition-colors hover:bg-[hsl(var(--card)/1)]">
        <div className="relative h-32 bg-gradient-to-r from-primary/20 to-secondary/20">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
            <div className="relative">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name || user.githubUsername}
                  width={100}
                  height={100}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background shadow-lg bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {user.name || user.githubUsername}
                </h1>
                <p className="text-muted-foreground text-lg">@{user.githubUsername}</p>
              </div>

              {user.bio && (
                <p className="text-muted-foreground max-w-2xl">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{user.followersCount} followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{user.followingCount} following</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitBranch className="w-4 h-4" />
                  <span>{user.publicReposCount} repositories</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Last updated {new Date(user.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
