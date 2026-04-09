import type { DashboardData } from "../types";

export type DashboardSidebarProps = Pick<
  DashboardData,
  "primaryNavigation" | "targets" | "workspaceLabel" | "workspaceName"
>;
