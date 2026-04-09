"use client";

import { motion } from "framer-motion";
import { Search, ShieldCheck, Sparkles, TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/src/components/features/dashboard/sidebar";
import AddHabitModal from "@/src/components/features/habits/add-habit-modal";
import IconTile from "@/src/components/ui/icon-tile";
import SectionCard from "@/src/components/ui/section-card";
import { cn } from "@/lib/utils";

import useHabits from "./hook";

const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

export default function HabitsFeature() {
  const {
    activities,
    habits,
    overviewStats,
    primaryNavigation,
    quickActions,
    searchPlaceholder,
    suggestions,
    syncStatus,
    targetGroups,
    targets,
    workspaceLabel,
    workspaceName,
  } = useHabits();

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
                <p className="text-sm font-medium tracking-[0.24em] text-lime-600">HABIT CONFIGURATION</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                  Manage your intervention habits
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-zinc-500 sm:text-base">
                  Atur kategori kebiasaan, tracking mode, budget harian, dan target executable/domain agar sinkron ke desktop agent.
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
                        <span>AI HABIT CONFIGURATOR</span>
                      </div>
                      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[2.05rem]">
                        Build recovery rules with AI-assisted targets
                      </h2>
                      <p className="mt-2 max-w-2xl text-base text-zinc-500 sm:text-lg">
                        Gunakan category prompt untuk generate daftar situs dan executable, lalu tetapkan mode moderate atau abstinence per habit.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button className="h-11 rounded-2xl px-5">
                        <Sparkles className="size-4" />
                        Generate from AI
                      </Button>
                      <AddHabitModal />
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
                  title="Active habits"
                  description="Kumpulan habit yang sedang aktif beserta mode tracking, budget, dan streak kepatuhan."
                  contentClassName="space-y-4"
                >
                  {habits.map((habit) => {
                    const progressWidth = `${Math.max(habit.progress * 100, 8)}%`;

                    return (
                      <div key={habit.name} className="rounded-[24px] border border-zinc-200 p-4 shadow-sm sm:p-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex gap-4">
                            <IconTile icon={habit.icon} className={cn("border-none", habit.accentClassName)} />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold text-zinc-950">{habit.name}</h3>
                                <span
                                  className={cn(
                                    "rounded-full px-3 py-1 text-xs font-semibold",
                                    habit.mode === "Abstinence"
                                      ? "bg-rose-500/10 text-rose-700"
                                      : "bg-lime-500/10 text-lime-700",
                                  )}
                                >
                                  {habit.mode}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-zinc-500">{habit.category}</p>
                            </div>
                          </div>

                          <AddHabitModal
                            triggerLabel="Edit Habit"
                            title={`Edit ${habit.name}`}
                            description="Perbarui prompt AI, tracking mode, budget, dan target manual tanpa mengubah flow wizard."
                            submitLabel="Save Changes"
                            triggerClassName="h-10 px-4"
                            initialValues={{
                              category: habit.mode === "Abstinence" ? "gaming" : "social",
                              prompt: habit.prompt,
                              mode: habit.mode,
                              budget: habit.mode === "Abstinence" ? "45 min / day" : habit.budget,
                              schedule: habit.schedule,
                              manualDomains: habit.domains.join("\n"),
                              manualExecutables: habit.executables.join("\n"),
                            }}
                          />
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                          <div>
                            <p className="text-sm text-zinc-500">Today</p>
                            <p className="mt-1 font-semibold text-zinc-950">{habit.progressLabel}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Remaining</p>
                            <p className="mt-1 font-semibold text-zinc-950">{habit.remainingLabel}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Schedule</p>
                            <p className="mt-1 font-semibold text-zinc-950">{habit.schedule}</p>
                          </div>
                          <div>
                            <p className="text-sm text-zinc-500">Streak</p>
                            <p className="mt-1 font-semibold text-zinc-950">{habit.streak}</p>
                          </div>
                        </div>

                        <div className="mt-5 rounded-full bg-zinc-100 p-1">
                          <div
                            className={cn(
                              "h-2 rounded-full",
                              habit.mode === "Abstinence" ? "bg-emerald-500" : "bg-violet-500",
                            )}
                            style={{ width: progressWidth }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </SectionCard>
              </motion.div>

              <motion.div {...fadeInUp}>
                <SectionCard
                  title="Recent habit activity"
                  description="Riwayat perubahan rule, rekomendasi AI, dan intervensi yang paling baru."
                  contentClassName="space-y-3"
                >
                  {activities.map((activity) => (
                    <div
                      key={activity.title}
                      className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-zinc-950">{activity.title}</p>
                        <p className="mt-1 text-sm text-zinc-500">
                          {activity.category} · {activity.timestamp}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold",
                          activity.statusClassName,
                        )}
                      >
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </SectionCard>
              </motion.div>
            </div>

            <div className="space-y-5">
              <motion.div {...fadeInUp}>
                <SectionCard
                  title="Suggested targets"
                  description="Daftar target hasil AI configurator untuk website dan executable yang akan diawasi."
                >
                  <div className="space-y-4">
                    {targetGroups.map((group) => (
                      <div key={group.title} className="rounded-[24px] bg-zinc-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-zinc-950">{group.title}</h3>
                            <p className="mt-1 text-sm text-zinc-500">{group.helper}</p>
                          </div>
                          <ShieldCheck className="size-5 text-lime-600" />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>

              <motion.div {...fadeInUp}>
                <SectionCard title="AI recommendations" contentClassName="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.title} className="rounded-[24px] border border-zinc-200 p-4 shadow-sm">
                      <h3 className="font-semibold text-zinc-950">{suggestion.title}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{suggestion.description}</p>
                      <ul className="mt-4 space-y-2 text-sm text-zinc-700">
                        {suggestion.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="mt-1 size-2 shrink-0 rounded-full bg-lime-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </SectionCard>
              </motion.div>

              <motion.div {...fadeInUp}>
                <SectionCard title="Quick actions" contentClassName="space-y-3">
                  {quickActions.map((action) => (
                    <div key={action.title} className="flex items-start gap-3 rounded-[22px] border border-zinc-200 p-4 shadow-sm">
                      <IconTile icon={action.icon} className={cn("border-none", action.accentClassName)} />
                      <div>
                        <p className="font-semibold text-zinc-950">{action.title}</p>
                        <p className="mt-1 text-sm text-zinc-500">{action.description}</p>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/70 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      <TimerReset className="size-4" />
                      Sync status
                    </p>
                    <p className="mt-2 text-sm text-emerald-800">{syncStatus}</p>
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
