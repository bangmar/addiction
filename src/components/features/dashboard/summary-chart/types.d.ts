export type SummaryChartSegment = {
  label: string;
  value: number;
  color: string;
};

export type SummaryChartProps = {
  segments: SummaryChartSegment[];
};
