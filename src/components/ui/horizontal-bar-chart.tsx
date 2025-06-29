"use client"

import React from 'react';
import { MetricTooltip } from './metric-tooltip';

interface BarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: string;
}

interface HorizontalBarChartProps {
  title: string;
  data: BarProps[];
  tip: string;
  className?: string;
}

export function HorizontalBarChart({ 
  title, 
  data, 
  tip,
  className 
}: HorizontalBarChartProps) {
  // Default colors for the bars
  const defaultColors = [
    'bg-primary',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <MetricTooltip tip={tip}>
        <h3 className="text-sm font-medium">{title}</h3>
      </MetricTooltip>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${item.color || defaultColors[index % defaultColors.length]}`}
                style={{ width: `${Math.min(100, (item.value / item.maxValue) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
