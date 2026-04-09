import type { ApexOptions } from "apexcharts";

import type { AnalyticsChartProps } from "./types";

export default function useAnalyticsChart({
  points,
}: Readonly<AnalyticsChartProps>) {
  const categories = points.map((point) => point.day);

  const series = [
    {
      name: "Distraction Time",
      data: points.map((point) => point.distractionHours),
    },
    {
      name: "Focus Time",
      data: points.map((point) => point.productiveHours),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "var(--font-sans)",
      foreColor: "#71717a",
      sparkline: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        borderRadiusApplication: "end",
        columnWidth: "48%",
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 5,
      padding: {
        left: 8,
        right: 8,
      },
    },
    colors: ["#8b5cf6", "#84cc16"],
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: "#a1a1aa",
          fontSize: "11px",
        },
      },
    },
    yaxis: {
      min: 0,
      max: 12,
      tickAmount: 6,
      labels: {
        formatter: (value) => `${Math.round(value)}h`,
        style: {
          colors: "#a1a1aa",
          fontSize: "11px",
        },
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `${value.toFixed(1)} hours`,
      },
    },
  };

  return {
    options,
    series,
  };
}
