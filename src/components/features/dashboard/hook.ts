import {
  AlarmClock,
  Bot,
  BrainCircuit,
  Globe,
  LayoutDashboard,
  ShieldAlert,
  Smartphone,
  TabletSmartphone,
  TriangleAlert,
  Workflow,
} from "lucide-react";

import type {
  DashboardData,
  DashboardNavItem,
  DashboardProgram,
  DashboardRecentActivity,
  DashboardRiskSource,
  DashboardStatCard,
  DashboardSummaryStat,
  DashboardTargetItem,
} from "./types";

export default function useDashboard(): DashboardData {
  const primaryNavigation: DashboardNavItem[] = [
    { label: "Overview", icon: LayoutDashboard, href: "/", active: true },
    { label: "Habits", icon: BrainCircuit, href: "/habits" },
    { label: "Download & Report", icon: AlarmClock, href: "/reports" },
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

  const statCards: DashboardStatCard[] = [
    {
      label: "Sites & Apps Blocked",
      value: "184",
      delta: "+12%",
      icon: ShieldAlert,
    },
    {
      label: "Interventions Sent",
      value: "67",
      delta: "+9%",
      icon: Bot,
    },
  ];

  const summaryStats: DashboardSummaryStat[] = [
    { label: "Total Monitored", value: "15:45:12" },
    { label: "Distraction Time", value: "03:24:07" },
    { label: "Remaining Budget", value: "04:17:30" },
    { label: "Streak Score", value: "18 days" },
  ];

  const analytics = [
    { day: "1", distractionHours: 4.2, productiveHours: 6.5 },
    { day: "2", distractionHours: 3.6, productiveHours: 7.1 },
    { day: "3", distractionHours: 4.8, productiveHours: 5.9 },
    { day: "4", distractionHours: 5.1, productiveHours: 5.4 },
    { day: "5", distractionHours: 3.1, productiveHours: 7.6 },
    { day: "6", distractionHours: 2.8, productiveHours: 8.2 },
    { day: "7", distractionHours: 6.4, productiveHours: 4.4 },
    { day: "8", distractionHours: 4.3, productiveHours: 6.2 },
    { day: "9", distractionHours: 3.5, productiveHours: 7.4 },
    { day: "10", distractionHours: 4.9, productiveHours: 5.7 },
    { day: "11", distractionHours: 4.6, productiveHours: 6.1 },
    { day: "12", distractionHours: 2.7, productiveHours: 8.1 },
    { day: "13", distractionHours: 7.8, productiveHours: 3.4 },
    { day: "14", distractionHours: 5.4, productiveHours: 5.2 },
    { day: "15", distractionHours: 2.1, productiveHours: 8.4 },
    { day: "16", distractionHours: 3.8, productiveHours: 7.3 },
    { day: "17", distractionHours: 4.2, productiveHours: 6.5 },
    { day: "18", distractionHours: 5.9, productiveHours: 5.1 },
    { day: "19", distractionHours: 3.4, productiveHours: 7.8 },
    { day: "20", distractionHours: 2.9, productiveHours: 8.3 },
    { day: "21", distractionHours: 4.7, productiveHours: 6.1 },
    { day: "22", distractionHours: 3.8, productiveHours: 7.2 },
    { day: "23", distractionHours: 2.5, productiveHours: 8.6 },
    { day: "24", distractionHours: 4.1, productiveHours: 6.9 },
    { day: "25", distractionHours: 6.2, productiveHours: 4.8 },
    { day: "26", distractionHours: 3.3, productiveHours: 7.7 },
    { day: "27", distractionHours: 2.4, productiveHours: 8.5 },
    { day: "28", distractionHours: 4.5, productiveHours: 6.3 },
    { day: "29", distractionHours: 3.7, productiveHours: 7.1 },
  ];

  const riskSources: DashboardRiskSource[] = [
    {
      name: "TikTok",
      category: "Moderate mode · 45 min budget",
      trackedTime: "02:15:45",
      riskLevel: "88%",
      avatar: "TT",
      online: true,
    },
    {
      name: "YouTube Shorts",
      category: "Moderate mode · 30 min budget",
      trackedTime: "01:45:30",
      riskLevel: "93%",
      avatar: "YS",
      online: true,
    },
    {
      name: "Steam.exe",
      category: "Abstinence mode · zero tolerance",
      trackedTime: "03:10:12",
      riskLevel: "95%",
      avatar: "ST",
      online: true,
    },
    {
      name: "Discord",
      category: "Recovery watchlist",
      trackedTime: "00:14:08",
      riskLevel: "42%",
      avatar: "DS",
      online: false,
    },
  ];

  const recentActivities: DashboardRecentActivity[] = [
    {
      title: "Steam.exe detected during abstinence window",
      project: "Gaming",
      tag: "BLOCKED",
      tagClassName: "bg-rose-500/10 text-rose-700",
      timestamp: "Today, 10:20 AM",
      duration: "00:25:45",
    },
    {
      title: "AI suggested adding reddit.com to Social Media",
      project: "AI Configurator",
      tag: "AI RULE",
      tagClassName: "bg-emerald-500/10 text-emerald-700",
      timestamp: "Today, 10:50 AM",
      duration: "00:08:30",
    },
    {
      title: "TikTok budget reached, toast notification sent",
      project: "Social Media",
      tag: "NOTICE",
      tagClassName: "bg-violet-500/10 text-violet-700",
      timestamp: "Yesterday, 11:15 AM",
      duration: "00:45:20",
    },
    {
      title: "Desktop agent synced 124 events to cloud",
      project: "Cross-platform Sync",
      tag: "SYNC",
      tagClassName: "bg-sky-500/10 text-sky-700",
      timestamp: "Yesterday, 11:40 AM",
      duration: "00:02:10",
    },
  ];

  const programs: DashboardProgram[] = [
    {
      name: "Social Media Reset",
      tasksRemaining: "3 targets active",
      accentClassName: "bg-violet-500/10 text-violet-700",
      icon: Smartphone,
    },
    {
      name: "Gaming Abstinence",
      tasksRemaining: "2 executables blocked",
      accentClassName: "bg-emerald-500/10 text-emerald-700",
      icon: Workflow,
    },
  ];

  return {
    primaryNavigation,
    targets,
    statCards,
    summaryStats,
    analytics,
    riskSources,
    recentActivities,
    programs,
    activeSession: {
      eyebrow: "ACTIVE MONITORING",
      title: "Late-night scrolling risk spike",
      subtitle: "Category: Social Media · Moderate mode",
      duration: "01:24:45",
    },
    teamOnlineCount: "3 live now",
    selectedPeriod: "Daily",
    yearLabel: "2026",
    workspaceLabel: "Account",
    workspaceName: "Digital Recovery Lab",
    searchPlaceholder: "Search habits, alerts, targets...",
    desktopStatus: {
      title: "Desktop Agent Connected",
      subtitle: "Last sync: 28 sec ago",
    },
    highlightDate: "13 January, 2026",
    highlightValue: "Highest distraction window · 7.8h",
    programsLabel: "2 Active",
    summarySegments: [
      { label: "Focus", value: 41, color: "#84cc16" },
      { label: "Distraction", value: 18, color: "#8b5cf6" },
      { label: "Blocked", value: 9, color: "#0f172a" },
    ],
  };
}
