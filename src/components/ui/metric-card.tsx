"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricTooltip } from './metric-tooltip';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number | React.ReactNode;
  icon?: React.ReactNode;
  tip: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  tip, 
  trend,
  className,
  valueClassName
}: MetricCardProps) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <MetricTooltip tip={tip}>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </MetricTooltip>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" className={valueClassName}>
          {value}
        </div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'} flex items-center mt-1`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </p>
        )}
      </CardContent>
    </Card>
  );
}
