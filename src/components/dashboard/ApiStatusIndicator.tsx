import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ApiStatus } from '@/context/ApiStatusContext';

interface ApiStatusIndicatorProps {
  userApiStatus: ApiStatus;
  techApiStatus: ApiStatus;
  readmeApiStatus: ApiStatus;
}

export function ApiStatusIndicator({ 
  userApiStatus,
  techApiStatus, 
  readmeApiStatus 
}: ApiStatusIndicatorProps) {
  return (
    <TooltipProvider>
      <Card className="mb-4 border-dashed">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
            <div className="text-sm font-medium">API Connection Status</div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">User Data API:</div>
                <StatusIcon status={userApiStatus} />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Tech Analysis API:</div>
                <StatusIcon status={techApiStatus} />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">README Analysis API:</div>
                <StatusIcon status={readmeApiStatus} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function StatusIcon({ status }: { status: ApiStatus }) {
  if (status === 'connected') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Connected to live API</p>
        </TooltipContent>
      </Tooltip>
    );
  } else if (status === 'fallback') {
    return (
      <Tooltip>
        <TooltipTrigger>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Using fallback data - API unavailable</p>
        </TooltipContent>
      </Tooltip>
    );
  } else {
    return (
      <Tooltip>
        <TooltipTrigger>
          <XCircle className="h-4 w-4 text-red-500" />
        </TooltipTrigger>
        <TooltipContent>
          <p>API connection error</p>
        </TooltipContent>
      </Tooltip>
    );
  }
}
