import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import type { PortalCallbackData } from "./types";

export default function usePortalCallback(): PortalCallbackData {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") ?? "/",
    [searchParams],
  );

  const error = searchParams.get("error");

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const redirectTimer = window.setTimeout(() => {
      router.replace(callbackUrl);
      router.refresh();
    }, 900);

    return () => window.clearTimeout(redirectTimer);
  }, [callbackUrl, router, status]);

  if (status === "authenticated") {
    return {
      eyebrow: "OAUTH CALLBACK",
      title: "Google account connected",
      description: "Session berhasil dibuat. Anda akan diarahkan ke dashboard dalam beberapa saat.",
      status: "success",
      callbackUrl,
      errorMessage: null,
    };
  }

  if (status === "unauthenticated") {
    return {
      eyebrow: "OAUTH CALLBACK",
      title: "Google sign-in failed",
      description: "Kami tidak berhasil memverifikasi session Google Anda. Silakan kembali ke portal dan coba lagi.",
      status: "error",
      callbackUrl,
      errorMessage:
        error === "OAuthAccountNotLinked"
          ? "Email ini sudah dipakai oleh metode login lain. Gunakan metode yang sama seperti sebelumnya."
          : error === "AccessDenied"
            ? "Akses Google ditolak atau dibatalkan sebelum session dibuat."
            : error
              ? "OAuth callback mengembalikan error yang belum ditangani."
              : "Session belum terbentuk setelah callback selesai.",
    };
  }

  return {
    eyebrow: "OAUTH CALLBACK",
    title: "Checking Google session",
    description: "Tunggu sebentar, kami sedang memverifikasi akun Google Anda dan menyiapkan workspace recovery.",
    status: "checking",
    callbackUrl,
    errorMessage: null,
  };
}
