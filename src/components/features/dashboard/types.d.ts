import type { LucideIcon } from "lucide-react";

import type { AnalyticsChartPoint } from "./analytics-chart/types";
import type { SummaryChartSegment } from "./summary-chart/types";

export type DashboardNavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
};

export type DashboardTargetItem = {
  name: string;
  subtitle: string;
  icon: LucideIcon;
  accentClassName: string;
};

export type DashboardStatCard = {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
};

export type DashboardSummaryStat = {
  label: string;
  value: string;
};

export type DashboardRiskSource = {
  name: string;
  category: string;
  trackedTime: string;
  riskLevel: string;
  avatar: string;
  online: boolean;
};

export type DashboardRecentActivity = {
  title: string;
  project: string;
  tag: string;
  tagClassName: string;
  timestamp: string;
  duration: string;
};

export type DashboardProgram = {
  name: string;
  tasksRemaining: string;
  accentClassName: string;
  icon: LucideIcon;
};

export type DashboardDesktopStatus = {
  title: string;
  subtitle: string;
};

export type DashboardActiveSession = {
  eyebrow: string;
  title: string;
  subtitle: string;
  duration: string;
};

export type DashboardData = {
  primaryNavigation: DashboardNavItem[];
  targets: DashboardTargetItem[];
  statCards: DashboardStatCard[];
  summaryStats: DashboardSummaryStat[];
  analytics: AnalyticsChartPoint[];
  riskSources: DashboardRiskSource[];
  recentActivities: DashboardRecentActivity[];
  programs: DashboardProgram[];
  activeSession: DashboardActiveSession;
  teamOnlineCount: string;
  selectedPeriod: string;
  yearLabel: string;
  workspaceLabel: string;
  workspaceName: string;
  searchPlaceholder: string;
  desktopStatus: DashboardDesktopStatus;
  highlightDate: string;
  highlightValue: string;
  programsLabel: string;
  summarySegments: SummaryChartSegment[];
};
