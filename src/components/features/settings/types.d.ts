import type { DashboardNavItem, DashboardTargetItem } from "@/src/components/features/dashboard/types";

export type SettingsOverviewStat = {
  label: string;
  value: string;
  detail: string;
};

export type ProfileField = {
  label: string;
  value: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  helper?: string;
};

export type LanguageOption = {
  label: string;
  value: string;
};

export type PasswordRequirement = {
  label: string;
};

export type LoginDeviceFilter = "All devices" | "Web dashboard" | "Desktop app" | "Mobile app";

export type LoginLogItem = {
  title: string;
  timestamp: string;
  device: LoginDeviceFilter;
  location: string;
  accentClassName: string;
};

export type SettingsInsight = {
  title: string;
  description: string;
};

export type SettingsData = {
  primaryNavigation: DashboardNavItem[];
  targets: DashboardTargetItem[];
  workspaceLabel: string;
  workspaceName: string;
  searchPlaceholder: string;
  overviewStats: SettingsOverviewStat[];
  profileFields: ProfileField[];
  languageOptions: LanguageOption[];
  selectedLanguage: string;
  passwordRequirements: PasswordRequirement[];
  loginDeviceFilters: LoginDeviceFilter[];
  loginLogs: LoginLogItem[];
  insights: SettingsInsight[];
  profileCompletion: number;
  profileUpdatedAt: string;
};
