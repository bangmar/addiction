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
  category: string;
  prompt: string;
  mode: "Moderate" | "Abstinence";
  budget: string;
  schedule: string;
  manualDomains: string;
  manualExecutables: string;
};

export type AddHabitModalProps = {
  triggerLabel?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
  initialValues?: Partial<AddHabitWizardState>;
  triggerClassName?: string;
};
