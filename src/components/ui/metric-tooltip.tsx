"use client"

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from 'lucide-react';

interface MetricTooltipProps {
  children: React.ReactNode;
  tip: string;
}

export function MetricTooltip({ children, tip }: MetricTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center cursor-help">
            {children}
            <InfoIcon className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{tip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
