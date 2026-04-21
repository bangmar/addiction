import type { LucideIcon } from "lucide-react";

export type HabitMode = "Moderate" | "Abstinence";

export type HabitNotice = {
  type: "success" | "error" | "info";
  message: string;
};

export type HabitOverviewStat = {
  label: string;
  value: string;
  detail: string;
};

export type HabitCard = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  prompt: string;
  mode: HabitMode;
  budget: string;
  remainingLabel: string;
  progressLabel: string;
  schedule: string;
  streak: string;
  domains: string[];
  executables: string[];
  icon: LucideIcon;
  accentClassName: string;
  progress: number;
};

export type HabitSuggestion = {
  title: string;
  description: string;
  items: string[];
};

export type HabitTargetGroup = {
  title: string;
  helper: string;
  items: string[];
};

export type HabitActivity = {
  title: string;
  category: string;
  timestamp: string;
  status: string;
  statusClassName: string;
};

export type HabitQuickAction = {
  title: string;
  description: string;
  icon: LucideIcon;
  accentClassName: string;
};

export type AddHabitFormValues = {
  name: string;
  category: string;
  categoryId: string;
  prompt: string;
  mode: HabitMode;
  budget: string | null;
  schedule: string;
  domains: string[];
  executables: string[];
};

export type HabitsData = {
  searchPlaceholder: string;
  overviewStats: HabitOverviewStat[];
  habits: HabitCard[];
  suggestions: HabitSuggestion[];
  targetGroups: HabitTargetGroup[];
  activities: HabitActivity[];
  quickActions: HabitQuickAction[];
  syncStatus: string;
  habitsNotice: HabitNotice | null;
  deleteCandidate: HabitCard | null;
  isLoading: boolean;
  isCreatingHabit: boolean;
  isDeletingHabit: boolean;
  deletingHabitId: string | null;
  isDeleteModalOpen: boolean;
  canCreateHabit: boolean;
  handleCreateHabit: (values: AddHabitFormValues) => Promise<void>;
  handleDeleteHabit: (habitId: string) => Promise<void>;
  openDeleteHabitModal: (habitId: string) => void;
  closeDeleteHabitModal: () => void;
  confirmDeleteHabit: () => Promise<void>;
};
