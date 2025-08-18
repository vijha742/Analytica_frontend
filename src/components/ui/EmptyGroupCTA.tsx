import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Search, Plus, ArrowUp } from 'lucide-react';

interface EmptyGroupCTAProps {
    groupName: string;
    onScrollToSearch?: () => void;
}

export function EmptyGroupCTA({ groupName, onScrollToSearch }: EmptyGroupCTAProps) {
    return (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 mx-auto">
                        <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Your {groupName} group is empty
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
                    Start building your network by adding GitHub users to track their activity and compare your progress together.
                </p>

                <div className="space-y-4 w-full max-w-sm">
                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">1</div>
                        <span>Search for GitHub users above</span>
                        <Search className="w-4 h-4 ml-auto text-blue-500" />
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold">2</div>
                        <span>Add them to your {groupName} group</span>
                        <Plus className="w-4 h-4 ml-auto text-green-500" />
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-800/70 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">3</div>
                        <span>Track their GitHub activity</span>
                        <Users className="w-4 h-4 ml-auto text-purple-500" />
                    </div>
                </div>

                {onScrollToSearch && (
                    <Button
                        onClick={onScrollToSearch}
                        className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <ArrowUp className="w-4 h-4" />
                        Start Adding Users
                    </Button>
                )}

                <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
                    💡 Tip: You can also create custom groups for different teams or projects
                </div>
            </CardContent>
        </Card>
    );
}
