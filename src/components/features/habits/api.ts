import axios from "axios";

export type HabitsApiError = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export type HabitRecord = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  prompt: string;
  mode: "Moderate" | "Abstinence";
  budget: string | null;
  schedule: string;
  domains: string[];
  executables: string[];
  streak: number;
  progress: number;
  todayUsageMinutes: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type HabitsResponse = {
  habits: HabitRecord[];
};

export type CreateHabitPayload = {
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

export type GenerateHabitTargetsPayload = {
  category: string;
  categoryId: string;
  prompt: string;
  existingDomains?: string[];
  existingExecutables?: string[];
};

export type GenerateHabitTargetsResponse = {
  message: string;
  targets: {
    domains: string[];
    executables: string[];
  };
};

export async function getHabits() {
  const response = await axios.get("/api/habits");
  return response.data as HabitsResponse;
}

export async function createHabit(payload: CreateHabitPayload) {
  const response = await axios.post("/api/habits", payload);
  return response.data as {
    message: string;
    habit: HabitRecord;
  };
}

export async function deleteHabit(habitId: string) {
  const response = await axios.delete(`/api/habits/${habitId}`);
  return response.data as {
    message: string;
  };
}

export async function generateHabitTargets(payload: GenerateHabitTargetsPayload) {
  const response = await axios.post("/api/habits/generate-targets", payload);
  return response.data as GenerateHabitTargetsResponse;
}
