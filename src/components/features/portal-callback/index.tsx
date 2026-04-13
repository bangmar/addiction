"use client";

import { motion } from "framer-motion";
import { ArrowRight, LoaderCircle, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import SectionCard from "@/src/components/ui/section-card";

import usePortalCallback from "./hook";

const trustPoints = [
  "OAuth callback diverifikasi di dalam session NextAuth",
  "Redirect hanya dilakukan setelah session benar-benar tersedia",
  "Tampilan callback mengikuti visual portal yang sama",
];

export default function PortalCallbackFeature() {
  const { eyebrow, title, description, status, callbackUrl, errorMessage } =
    usePortalCallback();

  const isChecking = status === "checking";
  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-[#d9d9d9] p-3 text-zinc-950 sm:p-4 lg:p-6">
      <main className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.25fr)]">
        <section className="bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.14),transparent_40%),linear-gradient(135deg,#fafffb,#f7f8f8)] p-6 sm:p-8 xl:p-10">
          <p className="text-sm font-medium tracking-[0.24em] text-lime-600">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500 sm:text-base">{description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="rounded-[22px] border border-white/80 bg-white/80 p-4 shadow-sm"
              >
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
            title="Google session handoff"
            description="Callback ini dipakai untuk memverifikasi session OAuth sebelum Anda dipindahkan ke halaman utama."
            contentClassName="space-y-5"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="space-y-5"
            >
              <div className="rounded-[22px] border border-zinc-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                      isChecking
                        ? "bg-lime-100 text-lime-600"
                        : isSuccess
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {isChecking ? (
                      <LoaderCircle className="size-5 animate-spin" />
                    ) : isSuccess ? (
                      <Sparkles className="size-5" />
                    ) : (
                      <TriangleAlert className="size-5" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-zinc-950">Session status</p>
                    <p className="text-sm text-zinc-500">{description}</p>
                    {errorMessage ? <p className="text-sm text-rose-500">{errorMessage}</p> : null}
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] bg-zinc-50 p-4 sm:p-5">
                <p className="text-sm font-semibold text-zinc-950">Redirect target</p>
                <p className="mt-2 break-all text-sm text-zinc-500">{callbackUrl}</p>
              </div>

              <div className="space-y-3">
                {isChecking || isSuccess ? (
                  <Button type="button" className="h-11 w-full rounded-2xl px-5" disabled>
                    {isChecking ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="size-4" />
                    )}
                    {isChecking ? "Checking your session" : "Redirecting to dashboard"}
                  </Button>
                ) : (
                  <Link
                    href="/portal"
                    className={buttonVariants({ className: "h-11 w-full rounded-2xl px-5" })}
                  >
                    Back to portal
                    <ArrowRight className="size-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          </SectionCard>
        </section>
      </main>
    </div>
  );
}
