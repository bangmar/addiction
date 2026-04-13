import { z } from "zod";

const passwordMessage =
  "Password must be at least 8 characters and include uppercase, lowercase, and a number.";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name is too long."),
  email: z.email("Invalid email address.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, passwordMessage)
    .regex(/[A-Z]/, passwordMessage)
    .regex(/[a-z]/, passwordMessage)
    .regex(/[0-9]/, passwordMessage),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Password is required."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
