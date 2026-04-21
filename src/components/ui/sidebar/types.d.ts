import type { LucideIcon } from "lucide-react";

export type SidebarNavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
};

export type SidebarTargetItem = {
  name: string;
  subtitle: string;
  icon: LucideIcon;
  accentClassName: string;
};

export type SidebarData = {
  primaryNavigation: SidebarNavItem[];
  targets: SidebarTargetItem[];
  workspaceLabel: string;
  workspaceName: string;
};
