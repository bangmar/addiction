import type { DefaultSession } from "next-auth";

export type SessionUser = DefaultSession["user"] & {
  id?: string;
  authProviders?: string[];
};
