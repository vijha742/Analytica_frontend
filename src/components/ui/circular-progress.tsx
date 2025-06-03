"use client"

import React from 'react';
import { MetricTooltip } from './metric-tooltip';

interface CircularProgressProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  title: string;
  tip: string;
  className?: string;
}

export function CircularProgress({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  title,
  tip,
  className
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * 100;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <MetricTooltip tip={tip}>
        <div className="text-sm font-medium mb-2">{title}</div>
      </MetricTooltip>
      <div className="relative flex items-center justify-center">
        <svg height={size} width={size} className="transform -rotate-90">
          <circle
            className="text-muted stroke-current"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className="text-primary stroke-current"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute text-sm font-bold">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}
