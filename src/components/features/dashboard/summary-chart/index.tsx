"use client";

import ApexCharts from "apexcharts";
import { useEffect, useRef } from "react";

import useSummaryChart from "./hook";
import type { SummaryChartProps } from "./types";

export default function SummaryChart(props: Readonly<SummaryChartProps>) {
  const { options, series } = useSummaryChart(props);
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
        type: "donut",
      },
    });

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [options, series]);

  return <div ref={chartRef} className='min-h-[240px]' />;
}
