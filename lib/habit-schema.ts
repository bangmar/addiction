import { z } from "zod";

const trackingModeSchema = z.enum(["Moderate", "Abstinence"]);

const targetItemSchema = z
  .string()
  .trim()
  .min(1, "Target item is required.")
  .max(120, "Target item is too long.");

export const createHabitSchema = z
  .object({
    name: z.string().trim().min(2, "Habit name must be at least 2 characters.").max(80, "Habit name is too long."),
    category: z.string().trim().min(2, "Category is required.").max(60, "Category is too long."),
    categoryId: z.string().trim().min(2, "Category identifier is required.").max(40, "Category identifier is too long."),
    prompt: z.string().trim().min(10, "Prompt must be at least 10 characters.").max(500, "Prompt is too long."),
    mode: trackingModeSchema,
    budget: z.string().trim().max(40, "Budget is too long.").nullable(),
    schedule: z.string().trim().min(3, "Schedule is required.").max(120, "Schedule is too long."),
    domains: z.array(targetItemSchema).min(1, "Add at least one domain or executable.").max(30, "Too many domains."),
    executables: z.array(targetItemSchema).max(30, "Too many executables."),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "Moderate" && !data.budget?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Budget is required for Moderate mode.",
        path: ["budget"],
      });
    }
  });

export const generateHabitTargetsSchema = z.object({
  category: z.string().trim().min(2, "Category is required.").max(60, "Category is too long."),
  categoryId: z.string().trim().min(2, "Category identifier is required.").max(40, "Category identifier is too long."),
  prompt: z.string().trim().min(10, "Prompt must be at least 10 characters.").max(500, "Prompt is too long."),
  existingDomains: z.array(targetItemSchema).max(30, "Too many domains.").default([]),
  existingExecutables: z.array(targetItemSchema).max(30, "Too many executables.").default([]),
});

export const habitTargetsSchema = z.object({
  domains: z.array(targetItemSchema).max(20, "Too many domains."),
  executables: z.array(targetItemSchema).max(20, "Too many executables."),
});

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type GenerateHabitTargetsInput = z.infer<typeof generateHabitTargetsSchema>;
export type HabitTargets = z.infer<typeof habitTargetsSchema>;
