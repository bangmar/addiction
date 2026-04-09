export type AnalyticsChartPoint = {
  day: string;
  distractionHours: number;
  productiveHours: number;
};

export type AnalyticsChartProps = {
  points: AnalyticsChartPoint[];
  activeLabel: string;
  activeValue: string;
};
