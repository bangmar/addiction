import {
  AlarmClock,
  BrainCircuit,
  Globe,
  LayoutDashboard,
  ShieldAlert,
  TabletSmartphone,
  TriangleAlert,
} from "lucide-react";
import { usePathname } from "next/navigation";

import type { SidebarData } from "./types";

export default function useSidebar(): SidebarData {
  const pathname = usePathname();

  return {
    primaryNavigation: [
      { label: "Overview", icon: LayoutDashboard, href: "/", active: pathname === "/" },
      { label: "Habits", icon: BrainCircuit, href: "/habits", active: pathname === "/habits" },
      {
        label: "Download & Report",
        icon: AlarmClock,
        href: "/reports",
        active: pathname === "/reports",
      },
      { label: "Alerts", icon: TriangleAlert, href: "/alerts", active: pathname === "/alerts" },
    ],
    targets: [
      {
        name: "Social Media",
        subtitle: "8 domains monitored",
        icon: Globe,
        accentClassName: "bg-emerald-500/10 text-emerald-600",
      },
      {
        name: "Gaming",
        subtitle: "5 executables tracked",
        icon: TabletSmartphone,
        accentClassName: "bg-violet-500/10 text-violet-600",
      },
      {
        name: "Impulse Shopping",
        subtitle: "AI rule active",
        icon: ShieldAlert,
        accentClassName: "bg-lime-500/10 text-lime-600",
      },
    ],
    workspaceLabel: "Account",
    workspaceName: "Digital Recovery Lab",
  };
}
