import type { LucideIcon } from "lucide-react";

export type AddHabitStep = 1 | 2 | 3;

export type AddHabitCategoryOption = {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  accentClassName: string;
};

export type AddHabitModeOption = {
  value: "Moderate" | "Abstinence";
  title: string;
  description: string;
  helper: string;
};

export type AddHabitGeneratedTargets = {
  domains: string[];
  executables: string[];
};

export type AddHabitWizardState = {
  step: AddHabitStep;
  name: string;
  category: string;
  prompt: string;
  mode: "Moderate" | "Abstinence";
  budget: string;
  schedule: string;
  manualDomains: string;
  manualExecutables: string;
};

export type AddHabitSubmitValues = {
  name: string;
  category: string;
  categoryId: string;
  prompt: string;
  mode: "Moderate" | "Abstinence";
  budget: string | null;
  schedule: string;
  domains: string[];
  executables: string[];
};

export type AddHabitModalProps = {
  triggerLabel?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  initialValues?: Partial<AddHabitWizardState>;
  initialGeneratedTargets?: AddHabitGeneratedTargets;
  triggerClassName?: string;
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit?: (values: AddHabitSubmitValues) => Promise<void> | void;
};
