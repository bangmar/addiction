"use client";

import { LoaderCircle, LogIn, ShieldCheck, Sparkles, TriangleAlert, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import SectionCard from "@/src/components/ui/section-card";

import usePortalConfirmation from "./hook";
import type { PortalConfirmationFeatureProps } from "./types";

const trustPoints = [
  "Hanya bisa diakses saat session login aktif",
  "Approval desktop memakai code sekali pakai dan masa berlaku terbatas",
  "Setelah allow, browser bisa langsung ditutup dari halaman konfirmasi akhir",
];

export default function PortalConfirmationFeature({ requestId, code }: Readonly<PortalConfirmationFeatureProps>) {
  const { status, message, canRespond, respond } = usePortalConfirmation(requestId, code);

  return (
    <div className="min-h-screen bg-[#d9d9d9] p-3 text-zinc-950 sm:p-4 lg:p-6">
      <main className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.25fr)]">
        <section className="bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.14),transparent_40%),linear-gradient(135deg,#fafffb,#f7f8f8)] p-6 sm:p-8 xl:p-10">
          <p className="text-sm font-medium tracking-[0.24em] text-lime-600">DESKTOP APPROVAL</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Confirm desktop sign-in request</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500 sm:text-base">Pastikan ini adalah permintaan login dari aplikasi desktop milik Anda sebelum mengizinkan akses.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {trustPoints.map((point) => (
              <div key={point} className="rounded-[22px] border border-white/80 bg-white/80 p-4 shadow-sm">
                <p className="flex items-start gap-3 text-sm text-zinc-700">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-lime-600" />
                  <span>{point}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-zinc-200/80 p-4 sm:p-6 xl:border-t-0 xl:border-l xl:p-10">
          <SectionCard
            title="Desktop login confirmation"
            description="Klik allow jika request ini berasal dari desktop app Anda."
            contentClassName="space-y-5"
          >
            <div className="rounded-[22px] border border-zinc-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${status === "error" || status === "expired" ? "bg-rose-100 text-rose-600" : status === "approved" ? "bg-emerald-100 text-emerald-600" : "bg-lime-100 text-lime-600"}`}>
                  {status === "error" || status === "expired" ? <TriangleAlert className="size-5" /> : status === "approved" ? <Sparkles className="size-5" /> : <LoaderCircle className={`size-5 ${status === "loading" || status === "processing" ? "animate-spin" : ""}`} />}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-zinc-950">Request status</p>
                  <p className="text-sm text-zinc-500">{message ?? "Request desktop login sedang diverifikasi."}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button type="button" className="h-11 w-full rounded-2xl px-5" disabled={!canRespond} onClick={() => void respond("allow")}>
                <LogIn className="size-4" />
                Allow desktop login
              </Button>
              <Button type="button" variant="outline" className="h-11 w-full rounded-2xl px-5" disabled={!canRespond} onClick={() => void respond("deny")}>
                <XCircle className="size-4" />
                Deny request
              </Button>
            </div>
          </SectionCard>
        </section>
      </main>
    </div>
  );
}
