import { BrainCircuit, Globe, TabletSmartphone } from "lucide-react";
import { useMemo, useState } from "react";

import { generateHabitTargets } from "../api";
import type {
  AddHabitCategoryOption,
  AddHabitGeneratedTargets,
  AddHabitModeOption,
  AddHabitStep,
  AddHabitSubmitValues,
  AddHabitWizardState,
} from "./types";

const categoryDefaults: Record<string, AddHabitGeneratedTargets> = {
  gaming: {
    domains: ["twitch.tv", "store.steampowered.com"],
    executables: ["Steam.exe", "RiotClientServices.exe"],
  },
  social: {
    domains: ["tiktok.com", "instagram.com"],
    executables: ["Discord.exe", "Telegram.exe"],
  },
  custom: {
    domains: [],
    executables: [],
  },
};

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

const initialState: AddHabitWizardState = {
  step: 1,
  name: "Social Media Reset",
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

function getCategoryLabel(categoryId: string) {
  return categoryOptions.find((option) => option.id === categoryId)?.label ?? "Custom Prompt";
}

export default function useAddHabitModal(
  onOpenChange: (open: boolean) => void,
  initialValues?: Partial<AddHabitWizardState>,
  onSubmit?: (values: AddHabitSubmitValues) => Promise<void> | void,
  initialGeneratedTargets?: AddHabitGeneratedTargets,
) {
  const [state, setState] = useState<AddHabitWizardState>(() => createInitialState(initialValues));
  const [generatedTargets, setGeneratedTargets] = useState<AddHabitGeneratedTargets>(
    initialGeneratedTargets ?? categoryDefaults[initialValues?.category ?? initialState.category] ?? categoryDefaults.custom,
  );
  const [isGeneratingTargets, setIsGeneratingTargets] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

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

  const canCompleteStepOne = useMemo(
    () => state.name.trim().length >= 2 && state.prompt.trim().length >= 10,
    [state.name, state.prompt],
  );

  const canCompleteStepTwo = useMemo(
    () => state.mode === "Abstinence" || state.budget.trim().length > 0,
    [state.mode, state.budget],
  );

  const canGoNext = useMemo(() => {
    if (state.step === 1) {
      return canCompleteStepOne;
    }

    if (state.step === 2) {
      return canCompleteStepTwo;
    }

    return combinedTargets.domains.length > 0 || combinedTargets.executables.length > 0;
  }, [canCompleteStepOne, canCompleteStepTwo, combinedTargets, state.step]);

  function setStep(step: AddHabitStep) {
    if (step === 2 && !canCompleteStepOne) {
      return;
    }

    if (step === 3 && (!canCompleteStepOne || !canCompleteStepTwo)) {
      return;
    }

    setState((current) => ({ ...current, step }));
  }

  async function goNext() {
    if (state.step === 1) {
      setGenerationError(null);
      setIsGeneratingTargets(true);

      try {
        const result = await generateHabitTargets({
          category: getCategoryLabel(state.category),
          categoryId: state.category,
          prompt: state.prompt.trim(),
          existingDomains: generatedTargets.domains,
          existingExecutables: generatedTargets.executables,
        });

        setGeneratedTargets(result.targets);
        setState((current) => ({ ...current, step: 2 }));
      } catch (error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setGeneratedTargets({ domains: [], executables: [] });
        setGenerationError(
          axiosError.response?.data?.message ?? "Failed to generate AI targets.",
        );
        setState((current) => ({ ...current, step: 2 }));
      } finally {
        setIsGeneratingTargets(false);
      }

      return;
    }

    setState((current) => ({ ...current, step: Math.min(current.step + 1, 3) as AddHabitStep }));
  }

  function goBack() {
    setGenerationError(null);
    setState((current) => ({ ...current, step: Math.max(current.step - 1, 1) as AddHabitStep }));
  }

  function updateState(values: Partial<AddHabitWizardState>) {
    setGenerationError(null);
    setState((current) => ({ ...current, ...values }));
  }

  function selectCategory(categoryId: string) {
    setGenerationError(null);
    setState((current) => {
      const nextLabel = getCategoryLabel(categoryId);
      const shouldReplaceName =
        !current.name.trim() || current.name === getCategoryLabel(current.category) || current.name === `${getCategoryLabel(current.category)} Reset`;

      const nextName = !shouldReplaceName
        ? current.name
        : categoryId === "custom"
          ? "Custom Recovery Habit"
          : `${nextLabel} Reset`;

      return {
        ...current,
        category: categoryId,
        name: nextName,
      };
    });

    if (!initialGeneratedTargets) {
      setGeneratedTargets(categoryDefaults[categoryId] ?? categoryDefaults.custom);
    }
  }

  function resetWizard() {
    setGenerationError(null);
    setIsGeneratingTargets(false);
    setGeneratedTargets(
      initialGeneratedTargets ?? categoryDefaults[initialValues?.category ?? initialState.category] ?? categoryDefaults.custom,
    );
    setState(createInitialState(initialValues));
  }

  function closeModal() {
    resetWizard();
    onOpenChange(false);
  }

  async function submitHabit() {
    const payload: AddHabitSubmitValues = {
      name: state.name.trim(),
      category: getCategoryLabel(state.category),
      categoryId: state.category,
      prompt: state.prompt.trim(),
      mode: state.mode,
      budget: state.mode === "Abstinence" ? null : state.budget.trim(),
      schedule: state.schedule,
      domains: combinedTargets.domains,
      executables: combinedTargets.executables,
    };

    if (onSubmit) {
      await onSubmit(payload);
    }

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
    isGeneratingTargets,
    generationError,
    setStep,
    goNext,
    goBack,
    updateState,
    selectCategory,
    closeModal,
    submitHabit,
  };
}
