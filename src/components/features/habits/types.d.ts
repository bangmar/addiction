import type { LucideIcon } from "lucide-react";

import type { DashboardNavItem, DashboardTargetItem } from "@/src/components/features/dashboard/types";

export type HabitMode = "Moderate" | "Abstinence";

export type HabitOverviewStat = {
  label: string;
  value: string;
  detail: string;
};

export type HabitCard = {
  name: string;
  category: string;
  prompt: string;
  mode: HabitMode;
  budget: string;
  remainingLabel: string;
  progressLabel: string;
  schedule: string;
  streak: string;
  domains: string[];
  executables: string[];
  icon: LucideIcon;
  accentClassName: string;
  progress: number;
};

export type HabitSuggestion = {
  title: string;
  description: string;
  items: string[];
};

export type HabitTargetGroup = {
  title: string;
  helper: string;
  items: string[];
};

export type HabitActivity = {
  title: string;
  category: string;
  timestamp: string;
  status: string;
  statusClassName: string;
};

export type HabitQuickAction = {
  title: string;
  description: string;
  icon: LucideIcon;
  accentClassName: string;
};

export type HabitsData = {
  primaryNavigation: DashboardNavItem[];
  targets: DashboardTargetItem[];
  workspaceLabel: string;
  workspaceName: string;
  searchPlaceholder: string;
  overviewStats: HabitOverviewStat[];
  habits: HabitCard[];
  suggestions: HabitSuggestion[];
  targetGroups: HabitTargetGroup[];
  activities: HabitActivity[];
  quickActions: HabitQuickAction[];
  syncStatus: string;
};
