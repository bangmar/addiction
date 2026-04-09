import type { ApexOptions } from "apexcharts";

import type { SummaryChartProps } from "./types";

export default function useSummaryChart({
	segments,
}: Readonly<SummaryChartProps>) {
	const series = segments.map((segment) => segment.value);
	const labels = segments.map((segment) => segment.label);
	const colors = segments.map((segment) => segment.color);

	const options: ApexOptions = {
		chart: {
			type: "donut",
			toolbar: { show: false },
			fontFamily: "var(--font-sans)",
		},
		labels,
		colors,
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false,
		},
		stroke: {
			width: 0,
		},
		plotOptions: {
			pie: {
				donut: {
					size: "74%",
					labels: {
						show: true,
						name: {
							show: true,
							offsetY: 18,
							color: "#71717a",
						},
						value: {
							show: true,
							fontSize: "24px",
							fontWeight: "700",
							color: "#18181b",
							offsetY: -10,
							formatter: () =>
								`${series.reduce((total, value) => total + value, 0)}h`,
						},
						total: {
							show: true,
							label: "Tracked",
							color: "#71717a",
							formatter: () => "This Week",
						},
					},
				},
			},
		},
		tooltip: {
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
