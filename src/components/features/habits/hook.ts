import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BrainCircuit, Smartphone, TimerReset, Workflow } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { createHabit, deleteHabit, getHabits, type HabitsApiError, type HabitRecord } from "./api";
import type {
  AddHabitFormValues,
  HabitActivity,
  HabitCard,
  HabitNotice,
  HabitOverviewStat,
  HabitQuickAction,
  HabitSuggestion,
  HabitTargetGroup,
  HabitsData,
} from "./types";

const fallbackHabitRecords: HabitRecord[] = [
  {
    id: "demo-social-media-reset",
    name: "Social Media Reset",
    category: "Social Media",
    categoryId: "social",
    prompt: "Reduce late-night scrolling on short-form social apps and social feeds.",
    mode: "Moderate",
    budget: "60 min / day",
    schedule: "Every day · 18:00 - 23:59",
    domains: ["tiktok.com", "instagram.com", "reddit.com", "youtube.com/shorts"],
    executables: ["Discord.exe", "Telegram.exe"],
    streak: 5,
    progress: 0.58,
    todayUsageMinutes: 35,
    createdAt: "2026-04-10T09:00:00.000Z",
    updatedAt: "2026-04-15T09:40:00.000Z",
  },
  {
    id: "demo-gaming-abstinence",
    name: "Gaming Abstinence",
    category: "Gaming",
    categoryId: "gaming",
    prompt: "Block competitive gaming launchers during evening recovery hours.",
    mode: "Abstinence",
    budget: null,
    schedule: "Every day · 18:00 - 23:59",
    domains: ["twitch.tv", "store.steampowered.com", "www.epicgames.com"],
    executables: ["Steam.exe", "RiotClientServices.exe", "EpicGamesLauncher.exe"],
    streak: 18,
    progress: 1,
    todayUsageMinutes: 0,
    createdAt: "2026-04-08T10:00:00.000Z",
    updatedAt: "2026-04-15T22:20:00.000Z",
  },
];

const baseActivities: HabitActivity[] = [
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

const suggestions: HabitSuggestion[] = [
  {
    title: "AI habit configurator",
    description: "Buat target baru dari kategori kebiasaan yang ingin dikurangi atau dihentikan.",
    items: [
      "Input category: Gaming",
      "Suggested executables: Steam.exe, RiotClientServices.exe",
      "Suggested domains: twitch.tv, store.steampowered.com",
    ],
  },
  {
    title: "Recommended intervention",
    description: "AI menyarankan upgrade mode ketika pola penggunaan mulai naik tajam.",
    items: [
      "Escalate YouTube Shorts ke abstinence selama 3 hari",
      "Turunkan budget TikTok ke 30 menit",
      "Tambahkan reddit.com ke Social Media habit",
    ],
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

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as { response?: { data?: HabitsApiError } };
  return axiosError.response?.data?.message ?? fallback;
}

function getHabitVisuals(categoryId: string, mode: HabitRecord["mode"]) {
  if (mode === "Abstinence") {
    return {
      icon: Workflow,
      accentClassName: "bg-emerald-500/10 text-emerald-700",
    };
  }

  if (categoryId === "gaming") {
    return {
      icon: Workflow,
      accentClassName: "bg-violet-500/10 text-violet-700",
    };
  }

  return {
    icon: Smartphone,
    accentClassName: "bg-lime-500/10 text-lime-700",
  };
}

function mapHabitRecordToCard(habit: HabitRecord): HabitCard {
  const progress = Math.min(Math.max(habit.progress ?? 0, 0), 1);
  const budgetLabel = habit.mode === "Abstinence" ? "Zero tolerance" : habit.budget ?? "No budget set";
  const remainingMinutes = habit.mode === "Abstinence"
    ? 0
    : Math.max(parseInt(habit.budget?.split(" ")[0] ?? "0", 10) - (habit.todayUsageMinutes ?? 0), 0);
  const visuals = getHabitVisuals(habit.categoryId, habit.mode);

  return {
    id: habit.id,
    name: habit.name,
    category: habit.domains.concat(habit.executables).slice(0, 3).join(", ") || habit.category,
    categoryId: habit.categoryId,
    prompt: habit.prompt,
    mode: habit.mode,
    budget: budgetLabel,
    progressLabel:
      habit.mode === "Abstinence"
        ? `${habit.todayUsageMinutes ?? 0} detections during blocked window`
        : `${habit.todayUsageMinutes ?? 0} / ${habit.budget ?? "0 min / day"} used today`,
    remainingLabel:
      habit.mode === "Abstinence"
        ? "Zero tolerance active"
        : `${remainingMinutes} min remaining`,
    schedule: habit.schedule,
    streak: `${habit.streak} day compliant streak`,
    domains: habit.domains,
    executables: habit.executables,
    icon: visuals.icon,
    accentClassName: visuals.accentClassName,
    progress,
  };
}

function buildOverviewStats(habits: HabitCard[]): HabitOverviewStat[] {
  const moderateCount = habits.filter((habit) => habit.mode === "Moderate").length;
  const abstinenceCount = habits.filter((habit) => habit.mode === "Abstinence").length;
  const trackedTargets = habits.reduce(
    (total, habit) => total + habit.domains.length + habit.executables.length,
    0,
  );
  const totalBudgetMinutes = habits.reduce((total, habit) => {
    if (habit.mode === "Abstinence") {
      return total;
    }

    const parsedMinutes = parseInt(habit.budget.split(" ")[0] ?? "0", 10);
    return total + (Number.isNaN(parsedMinutes) ? 0 : parsedMinutes);
  }, 0);
  const longestStreak = habits.reduce((max, habit) => {
    const parsed = parseInt(habit.streak.split(" ")[0] ?? "0", 10);
    return Number.isNaN(parsed) ? max : Math.max(max, parsed);
  }, 0);

  return [
    {
      label: "Active habits",
      value: habits.length.toString().padStart(2, "0"),
      detail: `${moderateCount} moderate · ${abstinenceCount} abstinence`,
    },
    {
      label: "Tracked targets",
      value: trackedTargets.toString(),
      detail: "Domains + executables synced",
    },
    {
      label: "Budget today",
      value: `${Math.floor(totalBudgetMinutes / 60)
        .toString()
        .padStart(2, "0")}:${(totalBudgetMinutes % 60).toString().padStart(2, "0")}`,
      detail: "Across moderate-mode habits",
    },
    {
      label: "Longest streak",
      value: `${longestStreak} days`,
      detail: longestStreak > 0 ? "Best active recovery streak" : "No streak yet",
    },
  ];
}

function buildTargetGroups(habits: HabitCard[]): HabitTargetGroup[] {
  const domains = Array.from(new Set(habits.flatMap((habit) => habit.domains))).slice(0, 8);
  const executables = Array.from(new Set(habits.flatMap((habit) => habit.executables))).slice(0, 8);

  return [
    {
      title: "Web domains",
      helper: "Sinkron ke desktop agent untuk browser tracking",
      items: domains,
    },
    {
      title: "Executables",
      helper: "Dipantau via active process list di Windows",
      items: executables,
    },
  ];
}

export default function useHabits(): HabitsData {
  const queryClient = useQueryClient();
  const { status } = useSession();
  const [habitsNotice, setHabitsNotice] = useState<HabitNotice | null>(null);
  const [localActivities, setLocalActivities] = useState<HabitActivity[]>([]);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  const habitsQuery = useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
    enabled: status === "authenticated",
  });

  const createHabitMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: async (result) => {
      setHabitsNotice({ type: "success", message: result.message });
      setLocalActivities((current) => [
        {
          title: `Created ${result.habit.name}`,
          category: result.habit.category,
          timestamp: "Just now",
          status: "CREATED",
          statusClassName: "bg-lime-500/10 text-lime-700",
        },
        ...current,
      ]);
      await queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      setHabitsNotice({
        type: "error",
        message: getErrorMessage(error, "Failed to create habit."),
      });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: async (result, habitId) => {
      const deletedHabit = (habitsQuery.data?.habits ?? fallbackHabitRecords).find((habit) => habit.id === habitId);
      setHabitsNotice({ type: "success", message: result.message });
      if (deletedHabit) {
        setLocalActivities((current) => [
          {
            title: `Deleted ${deletedHabit.name}`,
            category: deletedHabit.category,
            timestamp: "Just now",
            status: "DELETED",
            statusClassName: "bg-rose-500/10 text-rose-700",
          },
          ...current,
        ]);
      }
      await queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
    onError: (error) => {
      setHabitsNotice({
        type: "error",
        message: getErrorMessage(error, "Failed to delete habit."),
      });
    },
  });

  const habitRecords = status === "authenticated"
    ? habitsQuery.data?.habits ?? fallbackHabitRecords
    : fallbackHabitRecords;

  const habits = useMemo(() => {
    return habitRecords.map(mapHabitRecordToCard);
  }, [habitRecords]);
  const deleteCandidate = useMemo(
    () => habits.find((habit) => habit.id === deleteCandidateId) ?? null,
    [deleteCandidateId, habits],
  );

  const overviewStats = useMemo(() => buildOverviewStats(habits), [habits]);
  const targetGroups = useMemo(() => buildTargetGroups(habits), [habits]);
  const activities = useMemo(() => [...localActivities, ...baseActivities], [localActivities]);

  async function handleCreateHabit(values: AddHabitFormValues) {
    setHabitsNotice(null);
    await createHabitMutation.mutateAsync(values);
  }

  function openDeleteHabitModal(habitId: string) {
    setHabitsNotice(null);
    setDeleteCandidateId(habitId);
  }

  function closeDeleteHabitModal() {
    if (deleteHabitMutation.isPending) {
      return;
    }

    setDeleteCandidateId(null);
  }

  async function handleDeleteHabit(habitId: string) {
    setHabitsNotice(null);
    await deleteHabitMutation.mutateAsync(habitId);
    setDeleteCandidateId(null);
  }

  async function confirmDeleteHabit() {
    if (!deleteCandidateId) {
      return;
    }

    await handleDeleteHabit(deleteCandidateId);
  }

  return {
    searchPlaceholder: "Search habits, categories, target apps...",
    overviewStats,
    habits,
    suggestions,
    targetGroups,
    activities,
    quickActions,
    syncStatus:
      status === "authenticated"
        ? `Desktop sync healthy · ${habits.length} habit${habits.length === 1 ? "" : "s"} ready to sync`
        : "Sign in to save habits and sync them with your desktop agent",
    habitsNotice,
    deleteCandidate,
    isLoading: status === "loading" || habitsQuery.isLoading,
    isCreatingHabit: createHabitMutation.isPending,
    isDeletingHabit: deleteHabitMutation.isPending,
    deletingHabitId: deleteHabitMutation.isPending ? deleteCandidateId : null,
    isDeleteModalOpen: deleteCandidate !== null,
    canCreateHabit: status === "authenticated",
    handleCreateHabit,
    handleDeleteHabit,
    openDeleteHabitModal,
    closeDeleteHabitModal,
    confirmDeleteHabit,
  };
}
