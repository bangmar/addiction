import { BrainCircuit, Globe, TabletSmartphone } from "lucide-react";
import { useMemo, useState } from "react";

import type {
  AddHabitCategoryOption,
  AddHabitGeneratedTargets,
  AddHabitModeOption,
  AddHabitStep,
  AddHabitWizardState,
} from "./types";

const categoryTargets: Record<string, AddHabitGeneratedTargets> = {
  gaming: {
    domains: ["twitch.tv", "store.steampowered.com", "www.epicgames.com"],
    executables: ["Steam.exe", "RiotClientServices.exe", "EpicGamesLauncher.exe"],
  },
  social: {
    domains: ["tiktok.com", "instagram.com", "reddit.com", "youtube.com/shorts"],
    executables: ["Discord.exe", "Telegram.exe"],
  },
  custom: {
    domains: ["news.ycombinator.com", "x.com"],
    executables: ["chrome.exe", "firefox.exe"],
  },
};

const initialState: AddHabitWizardState = {
  step: 1,
  category: "social",
  prompt: "Late-night scrolling on short-form social apps",
  mode: "Moderate",
  budget: "45 min / day",
  schedule: "Every day · 18:00 - 23:59",
  manualDomains: "",
  manualExecutables: "",
};

function createInitialState(initialValues?: Partial<AddHabitWizardState>): AddHabitWizardState {
  return {
    ...initialState,
    ...initialValues,
    step: 1,
  };
}

export default function useAddHabitModal(
  onOpenChange: (open: boolean) => void,
  initialValues?: Partial<AddHabitWizardState>,
) {
  const [state, setState] = useState<AddHabitWizardState>(() => createInitialState(initialValues));

  const categoryOptions: AddHabitCategoryOption[] = [
    {
      id: "social",
      label: "Social Media",
      description: "Short-form video, doomscrolling, and attention traps.",
      icon: Globe,
      accentClassName: "bg-lime-500/10 text-lime-700",
    },
    {
      id: "gaming",
      label: "Gaming",
      description: "Game launchers, competitive sessions, and impulse play.",
      icon: TabletSmartphone,
      accentClassName: "bg-violet-500/10 text-violet-700",
    },
    {
      id: "custom",
      label: "Custom Prompt",
      description: "Let AI infer domains and executables from your own prompt.",
      icon: BrainCircuit,
      accentClassName: "bg-sky-500/10 text-sky-700",
    },
  ];

  const modeOptions: AddHabitModeOption[] = [
    {
      value: "Moderate",
      title: "Moderate",
      description: "Gunakan time budgeting untuk mengurangi pemakaian secara bertahap.",
      helper: "Best for habits that still need controlled access.",
    },
    {
      value: "Abstinence",
      title: "Abstinence",
      description: "Zero tolerance. Begitu terdeteksi, sistem langsung kirim alert/intervention.",
      helper: "Best for severe triggers that should be fully avoided.",
    },
  ];

  const generatedTargets = useMemo(() => {
    return categoryTargets[state.category] ?? categoryTargets.custom;
  }, [state.category]);

  const manualDomainsList = useMemo(() => {
    return state.manualDomains
      .split(/\r?\n|,/) 
      .map((item) => item.trim())
      .filter(Boolean);
  }, [state.manualDomains]);

  const manualExecutablesList = useMemo(() => {
    return state.manualExecutables
      .split(/\r?\n|,/) 
      .map((item) => item.trim())
      .filter(Boolean);
  }, [state.manualExecutables]);

  const combinedTargets = useMemo(() => {
    return {
      domains: Array.from(new Set([...generatedTargets.domains, ...manualDomainsList])),
      executables: Array.from(new Set([...generatedTargets.executables, ...manualExecutablesList])),
    };
  }, [generatedTargets, manualDomainsList, manualExecutablesList]);

  const canGoNext = useMemo(() => {
    if (state.step === 1) {
      return state.prompt.trim().length > 0;
    }

    if (state.step === 2) {
      return state.mode === "Abstinence" || state.budget.trim().length > 0;
    }

    return combinedTargets.domains.length > 0 || combinedTargets.executables.length > 0;
  }, [combinedTargets, state]);

  function setStep(step: AddHabitStep) {
    setState((current) => ({ ...current, step }));
  }

  function goNext() {
    setState((current) => ({ ...current, step: Math.min(current.step + 1, 3) as AddHabitStep }));
  }

  function goBack() {
    setState((current) => ({ ...current, step: Math.max(current.step - 1, 1) as AddHabitStep }));
  }

  function updateState(values: Partial<AddHabitWizardState>) {
    setState((current) => ({ ...current, ...values }));
  }

  function resetWizard() {
    setState(createInitialState(initialValues));
  }

  function closeModal() {
    resetWizard();
    onOpenChange(false);
  }

  function submitHabit() {
    resetWizard();
    onOpenChange(false);
  }

  return {
    state,
    categoryOptions,
    modeOptions,
    generatedTargets,
    manualDomainsList,
    manualExecutablesList,
    combinedTargets,
    canGoNext,
    setStep,
    goNext,
    goBack,
    updateState,
    closeModal,
    submitHabit,
  };
}
