import type { DashboardData } from "@/src/components/features/dashboard/types";

export type DashboardSidebarProps = Pick<
  DashboardData,
  "primaryNavigation" | "targets" | "workspaceLabel" | "workspaceName"
>;
