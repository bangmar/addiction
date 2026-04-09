"use client";

import { motion } from "framer-motion";
import { Download, FileSpreadsheet, Search, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/src/components/features/dashboard/sidebar";
import IconTile from "@/src/components/ui/icon-tile";
import SectionCard from "@/src/components/ui/section-card";
import { cn } from "@/lib/utils";

import useReports from "./hook";

const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

export default function ReportsFeature() {
  const {
    desktopDownloads,
    exportStatus,
    habitReports,
    insights,
    overviewStats,
    primaryNavigation,
    searchPlaceholder,
    targets,
    workspaceLabel,
    workspaceName,
  } = useReports();

  return (
    <div className="min-h-screen bg-[#d9d9d9] p-3 text-zinc-950 sm:p-4 lg:p-6">
      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto grid w-full max-w-370 overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] xl:grid-cols-[280px_minmax(0,1fr)]"
      >
        <DashboardSidebar
          primaryNavigation={primaryNavigation}
          targets={targets}
          workspaceLabel={workspaceLabel}
          workspaceName={workspaceName}
        />

        <section className="min-w-0 bg-white">
          <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-6 xl:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-medium tracking-[0.24em] text-lime-600">DOWNLOAD & REPORT</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                  Download the tracker and export habit reports
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-zinc-500 sm:text-base">
                  Halaman ini menggabungkan kebutuhan onboarding untuk unduh desktop agent dan kebutuhan reporting untuk unduh report per habit.
                </p>
              </div>

              <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-200 bg-[#fcfcfc] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] xl:max-w-110 xl:flex-1">
                <Search className="size-4 shrink-0 text-zinc-500" />
                <span className="truncate text-sm text-zinc-500">{searchPlaceholder}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-4 sm:p-6 2xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] xl:p-8">
            <div className="space-y-5">
              <motion.div {...fadeInUp}>
                <section className="rounded-[28px] border border-lime-100 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.12),transparent_45%),linear-gradient(135deg,#fafffb,#f7f8f8)] p-5 shadow-[0_18px_40px_rgba(132,204,22,0.08)] sm:p-6">
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                      <div className="mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-lime-600">
                        <span className="size-2 rounded-full bg-lime-500" />
                        <span>DESKTOP DISTRIBUTION & REPORT EXPORT</span>
                      </div>
                      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[2.05rem]">
                        Ship the tracker and share recovery progress
                      </h2>
                      <p className="mt-2 max-w-2xl text-base text-zinc-500 sm:text-lg">
                        Sesuai PRD, user perlu mengunduh tracker yang terhubung akun serta mengekspor report kebiasaan untuk evaluasi progress harian dan streak.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button className="h-11 rounded-2xl px-5">
                        <Download className="size-4" />
                        Download Tracker
                      </Button>
                      <Button variant="outline" className="h-11 rounded-2xl border-lime-300 bg-lime-500 px-5 text-white shadow-[0_14px_30px_rgba(132,204,22,0.28)] hover:border-lime-400 hover:bg-lime-400 hover:text-white">
                        <FileSpreadsheet className="size-4" />
                        Export Summary
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {overviewStats.map((stat) => (
                      <div key={stat.label} className="rounded-[22px] border border-white/80 bg-white/80 p-4 shadow-sm">
                        <p className="text-sm text-zinc-500">{stat.label}</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">{stat.value}</p>
                        <p className="mt-1 text-xs text-zinc-500">{stat.detail}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>

              <motion.div {...fadeInUp}>
                <SectionCard
                  title="Download desktop app"
                  description="Unduh build desktop agent untuk Windows sesuai tahap distribusi saat ini."
                  contentClassName="space-y-4"
                >
                  {desktopDownloads.map((item) => (
                    <div key={item.title} className="rounded-[24px] border border-zinc-200 p-4 shadow-sm sm:p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <IconTile icon={item.icon} className={cn("border-none", item.accentClassName)} />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-zinc-950">{item.title}</h3>
                              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                                {item.version}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-zinc-500">{item.description}</p>
                            <p className="mt-2 text-sm font-medium text-zinc-700">{item.helper}</p>
                          </div>
                        </div>

                        <Button variant="outline" className="h-10 rounded-2xl border-lime-300 bg-lime-500 px-4 text-white shadow-[0_14px_30px_rgba(132,204,22,0.28)] hover:border-lime-400 hover:bg-lime-400 hover:text-white">
                          <Download className="size-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </SectionCard>
              </motion.div>

              <motion.div {...fadeInUp}>
                <SectionCard
                  title="Habit report exports"
                  description="Unduh report per habit untuk kebutuhan review mingguan, evaluasi streak, dan dokumentasi progress."
                  contentClassName="space-y-4"
                >
                  {habitReports.map((report) => (
                    <div key={report.habitName} className="rounded-[24px] border border-zinc-200 p-4 shadow-sm sm:p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-zinc-950">{report.habitName}</h3>
                            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", report.accentClassName)}>
                              {report.period}
                            </span>
                          </div>
                          <div className="mt-4 grid gap-4 sm:grid-cols-3">
                            <div>
                              <p className="text-sm text-zinc-500">Streak</p>
                              <p className="mt-1 font-semibold text-zinc-950">{report.streak}</p>
                            </div>
                            <div>
                              <p className="text-sm text-zinc-500">Monitored time</p>
                              <p className="mt-1 font-semibold text-zinc-950">{report.monitoredTime}</p>
                            </div>
                            <div>
                              <p className="text-sm text-zinc-500">Distraction time</p>
                              <p className="mt-1 font-semibold text-zinc-950">{report.distractionTime}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {report.exportFormats.map((format) => (
                            <Button key={format} variant="outline" className="h-10 rounded-2xl border-sky-300 bg-sky-500 px-4 text-white shadow-[0_14px_30px_rgba(14,165,233,0.24)] hover:border-sky-400 hover:bg-sky-400 hover:text-white">
                              <FileSpreadsheet className="size-4" />
                              {format}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </SectionCard>
              </motion.div>
            </div>

            <div className="space-y-5">
              <motion.div {...fadeInUp}>
                <SectionCard title="Report insights" contentClassName="space-y-3">
                  {insights.map((insight) => (
                    <div key={insight.title} className="rounded-[22px] border border-zinc-200 p-4 shadow-sm">
                      <p className="font-semibold text-zinc-950">{insight.title}</p>
                      <p className="mt-1 text-sm text-zinc-500">{insight.description}</p>
                      <p className="mt-3 text-sm font-semibold text-lime-700">{insight.value}</p>
                    </div>
                  ))}
                </SectionCard>
              </motion.div>

              <motion.div {...fadeInUp}>
                <SectionCard title="Export readiness" contentClassName="space-y-3">
                  <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/70 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      <ShieldCheck className="size-4" />
                      Export pipeline
                    </p>
                    <p className="mt-2 text-sm text-emerald-800">{exportStatus}</p>
                  </div>
                  <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-zinc-800">
                      <Sparkles className="size-4 text-lime-500" />
                      Suggested workflow
                    </p>
                    <p className="mt-2 text-sm text-zinc-600">
                      Download tracker saat onboarding, lalu export per-habit report mingguan untuk melihat progress penggunaan, distraction time, dan streak compliance.
                    </p>
                  </div>
                </SectionCard>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
