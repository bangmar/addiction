import type { LucideIcon } from "lucide-react";

import type { DashboardNavItem, DashboardTargetItem } from "@/src/components/features/dashboard/types";

export type ReportOverviewStat = {
  label: string;
  value: string;
  detail: string;
};

export type DesktopDownloadCard = {
  title: string;
  description: string;
  version: string;
  helper: string;
  icon: LucideIcon;
  accentClassName: string;
};

export type HabitReportItem = {
  habitName: string;
  period: string;
  streak: string;
  monitoredTime: string;
  distractionTime: string;
  exportFormats: string[];
  accentClassName: string;
};

export type ReportInsight = {
  title: string;
  description: string;
  value: string;
};

export type ReportsData = {
  primaryNavigation: DashboardNavItem[];
  targets: DashboardTargetItem[];
  workspaceLabel: string;
  workspaceName: string;
  searchPlaceholder: string;
  overviewStats: ReportOverviewStat[];
  desktopDownloads: DesktopDownloadCard[];
  habitReports: HabitReportItem[];
  insights: ReportInsight[];
  exportStatus: string;
};
