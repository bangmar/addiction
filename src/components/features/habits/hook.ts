import {
  AlarmClock,
  BrainCircuit,
  Globe,
  LayoutDashboard,
  Smartphone,
  TabletSmartphone,
  TimerReset,
  TriangleAlert,
  Workflow,
} from "lucide-react";

import type { DashboardNavItem, DashboardTargetItem } from "@/src/components/features/dashboard/types";

import type {
  HabitActivity,
  HabitCard,
  HabitOverviewStat,
  HabitQuickAction,
  HabitSuggestion,
  HabitTargetGroup,
  HabitsData,
} from "./types";

export default function useHabits(): HabitsData {
  const primaryNavigation: DashboardNavItem[] = [
    { label: "Overview", icon: LayoutDashboard, href: "/" },
    { label: "Habits", icon: BrainCircuit, href: "/habits", active: true },
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

  ];

  const overviewStats: HabitOverviewStat[] = [
    { label: "Active habits", value: "05", detail: "4 moderate · 1 abstinence" },
    { label: "Tracked targets", value: "17", detail: "Domains + executables synced" },
    { label: "Budget today", value: "03:10", detail: "Across moderate-mode habits" },
    { label: "Longest streak", value: "18 days", detail: "Gaming abstinence" },
  ];

  const habits: HabitCard[] = [
    {
      name: "Social Media Reset",
      category: "TikTok, Instagram, X",
      prompt: "Reduce late-night scrolling on short-form social apps and social feeds.",
      mode: "Moderate",
      budget: "60 min / day",
      progressLabel: "35 / 60 min used today",
      remainingLabel: "25 min remaining",
      schedule: "Every day · 18:00 - 23:59",
      streak: "5 day compliant streak",
      domains: ["tiktok.com", "instagram.com", "reddit.com", "youtube.com/shorts"],
      executables: ["Discord.exe", "Telegram.exe"],
      icon: Smartphone,
      accentClassName: "bg-violet-500/10 text-violet-700",
      progress: 0.58,
    },
    {
      name: "Gaming Abstinence",
      category: "Steam.exe, RiotClientServices.exe",
      prompt: "Block competitive gaming launchers during evening recovery hours.",
      mode: "Abstinence",
      budget: "Zero tolerance",
      progressLabel: "0 detections during blocked window",
      remainingLabel: "Zero tolerance active",
      schedule: "Every day · 18:00 - 23:59",
      streak: "18 day clean streak",
      domains: ["twitch.tv", "store.steampowered.com", "www.epicgames.com"],
      executables: ["Steam.exe", "RiotClientServices.exe", "EpicGamesLauncher.exe"],
      icon: Workflow,
      accentClassName: "bg-emerald-500/10 text-emerald-700",
      progress: 1,
    },

  ];

  const suggestions: HabitSuggestion[] = [
    {
      title: "AI habit configurator",
      description: "Buat target baru dari kategori kebiasaan yang ingin dikurangi atau dihentikan.",
      items: ["Input category: Gaming", "Suggested executables: Steam.exe, RiotClientServices.exe", "Suggested domains: twitch.tv, store.steampowered.com"],
    },
    {
      title: "Recommended intervention",
      description: "AI menyarankan upgrade mode ketika pola penggunaan mulai naik tajam.",
      items: ["Escalate YouTube Shorts ke abstinence selama 3 hari", "Turunkan budget TikTok ke 30 menit", "Tambahkan reddit.com ke Social Media habit"],
    },
  ];

  const targetGroups: HabitTargetGroup[] = [
    {
      title: "Web domains",
      helper: "Sinkron ke desktop agent untuk browser tracking",
      items: ["tiktok.com", "instagram.com", "reddit.com", "youtube.com/shorts"],
    },
    {
      title: "Executables",
      helper: "Dipantau via active process list di Windows",
      items: ["Steam.exe", "Discord.exe", "RiotClientServices.exe", "EpicGamesLauncher.exe"],
    },
  ];

  const activities: HabitActivity[] = [
    {
      title: "TikTok budget updated from 45m to 30m",
      category: "Social Media Reset",
      timestamp: "Today, 09:40 AM",
      status: "UPDATED",
      statusClassName: "bg-emerald-500/10 text-emerald-700",
    },
    {
      title: "Steam.exe blocked during abstinence window",
      category: "Gaming Abstinence",
      timestamp: "Yesterday, 10:20 PM",
      status: "BLOCKED",
      statusClassName: "bg-rose-500/10 text-rose-700",
    },
    {
      title: "AI suggested adding reddit.com as target",
      category: "AI Configurator",
      timestamp: "Yesterday, 02:15 PM",
      status: "AI RULE",
      statusClassName: "bg-violet-500/10 text-violet-700",
    },
  ];

  const quickActions: HabitQuickAction[] = [
    {
      title: "Create new habit",
      description: "Tambah kategori baru lalu generate target otomatis dengan AI.",
      icon: BrainCircuit,
      accentClassName: "bg-lime-500/10 text-lime-700",
    },
    {
      title: "Adjust time budget",
      description: "Ubah kuota harian untuk habit dengan mode moderate.",
      icon: TimerReset,
      accentClassName: "bg-sky-500/10 text-sky-700",
    },
  ];

  return {
    primaryNavigation,
    targets,
    workspaceLabel: "Account",
    workspaceName: "Digital Recovery Lab",
    searchPlaceholder: "Search habits, categories, target apps...",
    overviewStats,
    habits,
    suggestions,
    targetGroups,
    activities,
    quickActions,
    syncStatus: "Desktop sync healthy · last sync 28 sec ago",
  };
}
