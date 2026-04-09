import type { LucideIcon } from "lucide-react";

import type { DashboardNavItem, DashboardTargetItem } from "@/src/components/features/dashboard/types";

export type AlertOverviewStat = {
  label: string;
  value: string;
  detail: string;
};

export type AlertIncident = {
  title: string;
  category: string;
  timestamp: string;
  severity: string;
  severityClassName: string;
  message: string;
  resolution: string;
};

export type AlertPolicy = {
  title: string;
  description: string;
  trigger: string;
  action: string;
  icon: LucideIcon;
  accentClassName: string;
};

export type AlertChannel = {
  title: string;
  description: string;
  status: string;
  statusClassName: string;
};

export type AlertQueueItem = {
  title: string;
  helper: string;
  eta: string;
};

export type AlertsData = {
  primaryNavigation: DashboardNavItem[];
  targets: DashboardTargetItem[];
  workspaceLabel: string;
  workspaceName: string;
  searchPlaceholder: string;
  overviewStats: AlertOverviewStat[];
  incidents: AlertIncident[];
  policies: AlertPolicy[];
  channels: AlertChannel[];
  queue: AlertQueueItem[];
  syncStatus: string;
};
