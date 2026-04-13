"use client";

import { SessionProvider } from "next-auth/react";

type AppSessionProviderProps = {
  children: React.ReactNode;
};

export default function AppSessionProvider({
  children,
}: Readonly<AppSessionProviderProps>) {
  return <SessionProvider>{children}</SessionProvider>;
}
