import {
  AlarmClock,
  BellRing,
  BrainCircuit,
  Globe,
  LayoutDashboard,
  MonitorSmartphone,
  ShieldAlert,
  TabletSmartphone,
  TriangleAlert,
} from "lucide-react";

import type { DashboardNavItem, DashboardTargetItem } from "@/src/components/features/dashboard/types";

import type {
  AlertChannel,
  AlertIncident,
  AlertOverviewStat,
  AlertPolicy,
  AlertQueueItem,
  AlertsData,
} from "./types";

export default function useAlerts(): AlertsData {
  const primaryNavigation: DashboardNavItem[] = [
    { label: "Overview", icon: LayoutDashboard, href: "/" },
    { label: "Habits", icon: BrainCircuit, href: "/habits" },
    { label: "Download & Report", icon: AlarmClock, href: "/reports" },
    { label: "Alerts", icon: TriangleAlert, href: "/alerts", active: true },
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

  const overviewStats: AlertOverviewStat[] = [
    { label: "Alerts today", value: "14", detail: "Budget reached + abstinence detections" },
    { label: "Critical incidents", value: "03", detail: "Needs immediate follow-up" },
    { label: "Notifications sent", value: "11", detail: "Desktop toast + in-app timeline" },
    { label: "Pending review", value: "05", detail: "Awaiting habit adjustment" },
  ];

  const incidents: AlertIncident[] = [
    {
      title: "Steam.exe opened during abstinence window",
      category: "Gaming Abstinence",
      timestamp: "Today, 10:20 PM",
      severity: "Critical",
      severityClassName: "bg-rose-500/10 text-rose-700",
      message: "Zero-tolerance rule triggered. Desktop agent blocked the process and queued a toast notification.",
      resolution: "Escalate focus mode for tonight",
    },
    {
      title: "TikTok reached daily budget",
      category: "Social Media Reset",
      timestamp: "Today, 08:10 PM",
      severity: "High",
      severityClassName: "bg-amber-500/10 text-amber-700",
      message: "Moderate-mode budget spent 100%. User was nudged to stop with a desktop reminder.",
      resolution: "Prompt breathing exercise",
    },
    {
      title: "reddit.com risk spike detected",
      category: "AI Configurator",
      timestamp: "Today, 02:45 PM",
      severity: "Medium",
      severityClassName: "bg-violet-500/10 text-violet-700",
      message: "AI suggested promoting reddit.com into the Social Media habit target list.",
      resolution: "Review suggestion",
    },
  ];

  const policies: AlertPolicy[] = [
    {
      title: "Budget reached notification",
      description: "Kirim toast notification saat moderate-mode budget habis.",
      trigger: "When daily budget = 100%",
      action: "Windows toast + mark incident in dashboard",
      icon: BellRing,
      accentClassName: "bg-lime-500/10 text-lime-700",
    },
    {
      title: "Abstinence violation",
      description: "Tandai critical incident saat executable/domain terdeteksi pada mode abstinence.",
      trigger: "Any zero-tolerance detection",
      action: "Immediate alert + intervention queue",
      icon: ShieldAlert,
      accentClassName: "bg-rose-500/10 text-rose-700",
    },
    {
      title: "Sync fallback",
      description: "Simpan event lokal bila cloud sync terlambat, lalu kirim ulang saat koneksi pulih.",
      trigger: "Sync delayed more than 60 sec",
      action: "Queue local events + retry in background",
      icon: MonitorSmartphone,
      accentClassName: "bg-sky-500/10 text-sky-700",
    },
  ];

  const channels: AlertChannel[] = [
    {
      title: "Desktop toast notification",
      description: "Primary channel untuk budget habis dan abstinence violation.",
      status: "Active",
      statusClassName: "bg-emerald-500/10 text-emerald-700",
    },
    {
      title: "Dashboard incident timeline",
      description: "Semua incident dicatat untuk review dan reporting.",
      status: "Active",
      statusClassName: "bg-emerald-500/10 text-emerald-700",
    },
    {
      title: "Escalation review queue",
      description: "AI suggestion yang butuh persetujuan user sebelum rule berubah.",
      status: "Pending review",
      statusClassName: "bg-amber-500/10 text-amber-700",
    },
  ];

  const queue: AlertQueueItem[] = [
    {
      title: "Review Steam.exe abstinence incident",
      helper: "Check whether schedule should extend beyond 23:59",
      eta: "Now",
    },
    {
      title: "Approve reddit.com suggestion",
      helper: "AI recommends adding it to Social Media habit",
      eta: "Next sync",
    },
    {
      title: "Tune TikTok budget reminder copy",
      helper: "Budget reached twice this week",
      eta: "Tomorrow",
    },
  ];

  return {
    primaryNavigation,
    targets,
    workspaceLabel: "Account",
    workspaceName: "Digital Recovery Lab",
    searchPlaceholder: "Search incidents, triggers, notification rules...",
    overviewStats,
    incidents,
    policies,
    channels,
    queue,
    syncStatus: "Alert pipeline healthy · desktop agent delivered last toast 28 sec ago",
  };
}
