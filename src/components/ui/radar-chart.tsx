"use client"

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { MetricTooltip } from './metric-tooltip';
import { Card, CardContent, CardHeader, CardTitle } from './card';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

interface RadarChartProps {
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
  tip: string;
  className?: string;
}

export function RadarChart({ title, labels, datasets, tip, className }: RadarChartProps) {
  const data = {
    labels,
    datasets: datasets.map(dataset => ({
      ...dataset,
      borderWidth: 2,
      pointBackgroundColor: dataset.borderColor,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: dataset.borderColor,
      pointLabelFontSize: 14,
    })),
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <MetricTooltip tip={tip}>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </MetricTooltip>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Radar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
