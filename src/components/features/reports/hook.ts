import {
  AlarmClock,
  BrainCircuit,
  Download,
  Globe,
  LayoutDashboard,
  ShieldAlert,
  TabletSmartphone,
  TriangleAlert,
} from "lucide-react";

import type { DashboardNavItem, DashboardTargetItem } from "@/src/components/features/dashboard/types";

import type {
  DesktopDownloadCard,
  HabitReportItem,
  ReportInsight,
  ReportOverviewStat,
  ReportsData,
} from "./types";

export default function useReports(): ReportsData {
  const primaryNavigation: DashboardNavItem[] = [
    { label: "Overview", icon: LayoutDashboard, href: "/" },
    { label: "Habits", icon: BrainCircuit, href: "/habits" },
    { label: "Download & Report", icon: AlarmClock, href: "/reports", active: true },
    { label: "Alerts", icon: TriangleAlert, href: "/alerts" },
  ];

  const targets: DashboardTargetItem[] = [
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
  ];

  const overviewStats: ReportOverviewStat[] = [
    { label: "Desktop builds", value: "01", detail: "Windows installer ready for download" },
    { label: "Exportable habits", value: "06", detail: "Per-habit report ready" },
    { label: "Last export", value: "Today", detail: "Social Media Reset · PDF" },
    { label: "Sync health", value: "Healthy", detail: "Latest cloud sync 28 sec ago" },
  ];

  const desktopDownloads: DesktopDownloadCard[] = [
    {
      title: "Windows Tracker Installer",
      description: "Installer utama untuk desktop agent yang terhubung ke akun user.",
      version: "v0.3.2",
      helper: "Recommended for most users · auto account pairing",
      icon: Download,
      accentClassName: "bg-lime-500/10 text-lime-700",
    },
  ];

  const habitReports: HabitReportItem[] = [
    {
      habitName: "Social Media Reset",
      period: "Last 7 days",
      streak: "5 day streak",
      monitoredTime: "11:20:45",
      distractionTime: "02:35:10",
      exportFormats: ["PDF"],
      accentClassName: "bg-violet-500/10 text-violet-700",
    },
    {
      habitName: "Gaming Abstinence",
      period: "Last 30 days",
      streak: "18 day streak",
      monitoredTime: "25:14:18",
      distractionTime: "00:18:40",
      exportFormats: ["PDF"],
      accentClassName: "bg-emerald-500/10 text-emerald-700",
    },
    {
      habitName: "Impulse Shopping Cooldown",
      period: "Last 14 days",
      streak: "3 day streak",
      monitoredTime: "06:48:12",
      distractionTime: "01:11:09",
      exportFormats: ["PDF"],
      accentClassName: "bg-amber-500/10 text-amber-700",
    },
  ];

  const insights: ReportInsight[] = [
    {
      title: "Most improved habit",
      description: "Habit dengan penurunan distraction time terbesar minggu ini.",
      value: "Gaming Abstinence -42%",
    },
    {
      title: "Highest alert volume",
      description: "Habit yang paling sering mencapai warning threshold.",
      value: "Social Media Reset · 6 alerts",
    },
    {
      title: "Best export cadence",
      description: "Disarankan export report mingguan untuk review progress.",
      value: "Every Monday, 08:00 AM",
    },
  ];

  return {
    primaryNavigation,
    targets,
    workspaceLabel: "Account",
    workspaceName: "Digital Recovery Lab",
    searchPlaceholder: "Search builds, exports, report history...",
    overviewStats,
    desktopDownloads,
    habitReports,
    insights,
    exportStatus: "Exports ready · desktop bundle signed for Windows release",
  };
}
