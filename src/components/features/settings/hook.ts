import {
  AlarmClock,
  BrainCircuit,
  Globe,
  LayoutDashboard,
  ShieldAlert,
  TabletSmartphone,
  TriangleAlert,
} from "lucide-react";

import type { DashboardNavItem, DashboardTargetItem } from "@/src/components/features/dashboard/types";

import type {
  LoginLogItem,
  SettingsData,
  SettingsInsight,
  SettingsOverviewStat,
} from "./types";

export default function useSettings(): SettingsData {
  const primaryNavigation: DashboardNavItem[] = [
    { label: "Overview", icon: LayoutDashboard, href: "/" },
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

  const overviewStats: SettingsOverviewStat[] = [
    { label: "Profile completion", value: "92%", detail: "Foto, nama, dan bahasa sudah terisi" },
    { label: "Last password reset", value: "14 days ago", detail: "Disarankan refresh password berkala" },
    { label: "Login devices", value: "03", detail: "Web dashboard dan desktop session aktif" },
    { label: "Last account update", value: "Today", detail: "Perubahan profil tersimpan 09:40 AM" },
  ];

  const loginLogs: LoginLogItem[] = [
    {
      title: "Web dashboard login",
      timestamp: "Today, 09:40 AM",
      device: "Web dashboard",
      location: "Chrome on Windows",
      accentClassName: "bg-lime-500/10 text-lime-700",
    },
    {
      title: "Desktop tracker sync access",
      timestamp: "Today, 07:12 AM",
      device: "Desktop app",
      location: "Windows desktop agent",
      accentClassName: "bg-sky-500/10 text-sky-700",
    },
    {
      title: "Mobile review session",
      timestamp: "Yesterday, 08:15 PM",
      device: "Mobile app",
      location: "PWA on Android",
      accentClassName: "bg-violet-500/10 text-violet-700",
    },
    {
      title: "Web dashboard login",
      timestamp: "Yesterday, 06:48 AM",
      device: "Web dashboard",
      location: "Edge on Windows",
      accentClassName: "bg-lime-500/10 text-lime-700",
    },
  ];

  const insights: SettingsInsight[] = [
    {
      title: "Profile guidance",
      description: "Lengkapi foto profile dan gunakan nama yang konsisten agar workspace recovery lebih personal.",
    },
    {
      title: "Security note",
      description: "Reset password terakhir sudah lebih dari 2 minggu. UI bisa menonjolkan CTA reset password sebagai secondary action.",
    },
    {
      title: "Login review",
      description: "Filter login log membantu user mengecek akses dari web dashboard versus desktop tracker tanpa perlu data teknis berlebih.",
    },
  ];

  return {
    primaryNavigation,
    targets,
    workspaceLabel: "Account",
    workspaceName: "Digital Recovery Lab",
    searchPlaceholder: "Search profile settings, sessions, login history...",
    overviewStats,
    profileFields: [
      {
        label: "Full name",
        value: "Mario Pratama",
        placeholder: "Masukkan nama lengkap",
        helper: "Nama ini akan tampil di workspace dan dashboard.",
      },
      {
        label: "Email address",
        value: "mario@timercheck.app",
        type: "email",
        placeholder: "you@example.com",
        helper: "Dipakai untuk login dashboard dan sinkronisasi akun.",
      },
    ],
    languageOptions: [
      { label: "Bahasa Indonesia", value: "id" },
      { label: "English", value: "en" },
    ],
    selectedLanguage: "id",
    passwordRequirements: [
      { label: "Minimal 8 karakter" },
      { label: "Gabungan huruf besar dan kecil" },
      { label: "Minimal satu angka atau simbol" },
    ],
    loginDeviceFilters: ["All devices", "Web dashboard", "Desktop app", "Mobile app"],
    loginLogs,
    insights,
    profileCompletion: 0.92,
    profileUpdatedAt: "Last updated today at 09:40 AM",
  };
}
