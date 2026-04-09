"use client";

import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";

import useAnalyticsChart from "./hook";
import type { AnalyticsChartProps } from "./types";

export default function AnalyticsChart(props: Readonly<AnalyticsChartProps>) {
  const { options, series } = useAnalyticsChart(props);
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = new ApexCharts(chartRef.current, {
      ...options,
      series,
      chart: {
        ...options.chart,
        type: "bar",
      },
    });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [options, series]);

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-2 rounded-[22px] border border-lime-100 bg-lime-50/60 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-semibold text-zinc-900'>{props.activeLabel}</p>
          <p className='mt-1 text-sm text-zinc-500'>Most sensitive monitoring window detected by the desktop agent.</p>
        </div>
        <div className='rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-lime-600 shadow-sm'>
          {props.activeValue}
        </div>
      </div>

      <div ref={chartRef} className='min-h-[300px]' />
    </div>
  );
}
