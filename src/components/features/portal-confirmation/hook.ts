import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type { PortalConfirmationStatus } from "./types";

export default function usePortalConfirmation(requestId: string, code: string) {
  const router = useRouter();
  const [status, setStatus] = useState<PortalConfirmationStatus>("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRequest() {
      setStatus("loading");
      setMessage(null);

      const response = await fetch(`/api/desktop/auth/request/${encodeURIComponent(requestId)}?code=${encodeURIComponent(code)}`);
      const data = await response.json();
      if (cancelled) {
        return;
      }

      if (!response.ok) {
        setStatus(response.status === 410 ? "expired" : "error");
        setMessage(data.message ?? "Desktop auth request could not be loaded.");
        return;
      }

      if (data.status === "approved") {
        router.replace("/portal/confirmed?status=approved");
        return;
      }

      if (data.status === "rejected") {
        router.replace("/portal/confirmed?status=rejected");
        return;
      }

      if (data.status === "expired") {
        setStatus("expired");
        setMessage("Permintaan login desktop sudah kedaluwarsa. Silakan mulai ulang dari aplikasi desktop.");
        return;
      }

      setStatus("ready");
      setMessage("Desktop app meminta izin untuk terhubung ke akun Anda.");
    }

    void loadRequest();

    return () => {
      cancelled = true;
    };
  }, [code, requestId, router]);

  const canRespond = useMemo(() => status === "ready", [status]);

  async function respond(decision: "allow" | "deny") {
    setStatus("processing");
    setMessage(null);

    const response = await fetch(`/api/desktop/auth/request/${encodeURIComponent(requestId)}/decision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, decision }),
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus(response.status === 410 ? "expired" : "error");
      setMessage(data.message ?? "Desktop auth decision failed.");
      return;
    }

    router.replace(data.redirectUrl ?? `/portal/confirmed?status=${decision === "allow" ? "approved" : "rejected"}`);
  }

  return {
    status,
    message,
    canRespond,
    respond,
  };
}
