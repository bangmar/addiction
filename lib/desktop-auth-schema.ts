import { z } from "zod";

const requestIdSchema = z.string().trim().min(8).max(128);
const codeSchema = z.string().trim().min(4).max(32);

export const createDesktopAuthRequestSchema = z.object({
  emailHint: z.string().trim().email().optional(),
  deviceLabel: z.string().trim().min(2).max(80).optional(),
});

export const desktopAuthStatusQuerySchema = z.object({
  code: codeSchema,
});

export const desktopAuthDecisionSchema = z.object({
  code: codeSchema,
  decision: z.enum(["allow", "deny"]),
});

export const desktopAuthRequestParamsSchema = z.object({
  requestId: requestIdSchema,
});

export type CreateDesktopAuthRequestInput = z.infer<typeof createDesktopAuthRequestSchema>;
export type DesktopAuthDecisionInput = z.infer<typeof desktopAuthDecisionSchema>;
