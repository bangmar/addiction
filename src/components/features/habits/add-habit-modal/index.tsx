"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit, Check, ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import useAddHabitModal from "./hook";
import type { AddHabitModalProps } from "./types";

const modalVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};

export default function AddHabitModal({
  triggerLabel = "New Habit",
  title = "Create a new recovery habit",
  description = "Wizard ini mengikuti flow PRD: prompt AI, tentukan tracking mode, lalu review target domain dan executable.",
  submitLabel = "Create Habit",
  initialValues,
  triggerClassName,
}: Readonly<AddHabitModalProps>) {
  const [open, setOpen] = useState(false);
  const {
    state,
    categoryOptions,
    modeOptions,
    generatedTargets,
    manualDomainsList,
    manualExecutablesList,
    combinedTargets,
    canGoNext,
    setStep,
    goNext,
    goBack,
    updateState,
    closeModal,
    submitHabit,
  } = useAddHabitModal(setOpen, initialValues);

  const stepLabels = ["Category", "Mode & Limits", "Review Targets"];

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "h-11 rounded-2xl border-lime-300 bg-lime-500 px-5 text-white shadow-[0_14px_30px_rgba(132,204,22,0.28)] hover:border-lime-400 hover:bg-lime-400 hover:text-white",
          triggerClassName,
        )}
        onClick={() => setOpen(true)}
      >
        <BrainCircuit className="size-4" />
        {triggerLabel}
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/45 p-0 sm:items-center sm:p-6"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:h-auto sm:max-h-[92vh] sm:rounded-[32px]"
            >
              <div className="border-b border-zinc-200 px-4 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium tracking-[0.24em] text-lime-600">ADD HABIT</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-500">{description}</p>
                  </div>

                  <Button variant="ghost" size="icon-sm" className="rounded-xl text-zinc-500" onClick={closeModal}>
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {stepLabels.map((label, index) => {
                    const stepNumber = index + 1;
                    const active = state.step === stepNumber;
                    const completed = state.step > stepNumber;

                    return (
                      <button
                        key={label}
                        className={cn(
                          "rounded-2xl border px-4 py-3 text-left transition-colors",
                          active
                            ? "border-lime-300 bg-lime-50"
                            : completed
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-zinc-200 bg-white hover:bg-zinc-50",
                        )}
                        onClick={() => setStep(stepNumber as 1 | 2 | 3)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex size-8 items-center justify-center rounded-full text-sm font-semibold",
                              active
                                ? "bg-lime-500 text-white"
                                : completed
                                  ? "bg-emerald-500 text-white"
                                  : "bg-zinc-100 text-zinc-500",
                            )}
                          >
                            {completed ? <Check className="size-4" /> : stepNumber}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-950">Step {stepNumber}</p>
                            <p className="text-xs text-zinc-500">{label}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                {state.step === 1 ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">Choose a habit category</p>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {categoryOptions.map((option) => {
                          const Icon = option.icon;
                          const selected = state.category === option.id;

                          return (
                            <button
                              key={option.id}
                              className={cn(
                                "rounded-[24px] border p-4 text-left shadow-sm transition-all",
                                selected
                                  ? "border-lime-300 bg-lime-50/70"
                                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50",
                              )}
                              onClick={() => updateState({ category: option.id })}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn("flex size-11 items-center justify-center rounded-2xl", option.accentClassName)}>
                                  <Icon className="size-5" />
                                </div>
                                <div>
                                  <p className="font-semibold text-zinc-950">{option.label}</p>
                                  <p className="mt-1 text-sm text-zinc-500">{option.description}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                        <Sparkles className="size-4 text-lime-600" />
                        AI prompt
                      </div>
                      <p className="mt-2 text-sm text-zinc-500">
                        Jelaskan kebiasaan yang ingin dipantau agar AI bisa menghasilkan rekomendasi target lebih akurat.
                      </p>
                      <textarea
                        value={state.prompt}
                        onChange={(event) => updateState({ prompt: event.target.value })}
                        className="mt-4 min-h-32 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-lime-300 focus:ring-4 focus:ring-lime-100"
                        placeholder="Example: I want to reduce late-night scrolling on social media and short videos after work."
                      />
                    </div>
                  </div>
                ) : null}

                {state.step === 2 ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">Select tracking mode</p>
                      <div className="mt-4 grid gap-3 lg:grid-cols-2">
                        {modeOptions.map((option) => {
                          const selected = state.mode === option.value;

                          return (
                            <button
                              key={option.value}
                              className={cn(
                                "rounded-[24px] border p-4 text-left shadow-sm transition-all",
                                selected
                                  ? option.value === "Abstinence"
                                    ? "border-rose-300 bg-rose-50"
                                    : "border-lime-300 bg-lime-50"
                                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50",
                              )}
                              onClick={() => updateState({ mode: option.value })}
                            >
                              <p className="font-semibold text-zinc-950">{option.title}</p>
                              <p className="mt-1 text-sm text-zinc-500">{option.description}</p>
                              <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">{option.helper}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                      <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
                        <p className="text-sm font-semibold text-zinc-900">Daily budget</p>
                        <p className="mt-1 text-sm text-zinc-500">Budget only applies to Moderate mode.</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {["20 min / day", "30 min / day", "45 min / day", "60 min / day"].map((budget) => (
                            <button
                              key={budget}
                              className={cn(
                                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                                state.budget === budget
                                  ? "border-lime-300 bg-lime-500 text-white"
                                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50",
                              )}
                              onClick={() => updateState({ budget })}
                              disabled={state.mode === "Abstinence"}
                            >
                              {budget}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm">
                        <p className="text-sm font-semibold text-zinc-900">Active schedule</p>
                        <p className="mt-1 text-sm text-zinc-500">Adjust the monitoring window for alerts and sync.</p>
                        <select
                          value={state.schedule}
                          onChange={(event) => updateState({ schedule: event.target.value })}
                          className="mt-4 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-lime-300 focus:ring-4 focus:ring-lime-100"
                        >
                          <option>Every day · 18:00 - 23:59</option>
                          <option>Weekdays · 09:00 - 18:00</option>
                          <option>Weekends · 10:00 - 22:00</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ) : null}

                {state.step === 3 ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="rounded-[24px] border border-zinc-200 p-4 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-400">AI + manual targets</p>
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <div className="space-y-4">
                            <div className="rounded-[22px] bg-zinc-50 p-4">
                              <p className="font-semibold text-zinc-950">Domains from AI</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {generatedTargets.domains.map((domain) => (
                                  <span key={domain} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700">
                                    {domain}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="rounded-[22px] bg-zinc-50 p-4">
                              <p className="font-semibold text-zinc-950">Add domains manually</p>
                              <p className="mt-1 text-sm text-zinc-500">Pisahkan dengan baris baru atau koma.</p>
                              <textarea
                                value={state.manualDomains}
                                onChange={(event) => updateState({ manualDomains: event.target.value })}
                                className="mt-3 min-h-28 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-lime-300 focus:ring-4 focus:ring-lime-100"
                                placeholder="example.com\nsubdomain.example.com"
                              />
                              {manualDomainsList.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {manualDomainsList.map((domain) => (
                                    <span key={domain} className="rounded-full border border-lime-200 bg-lime-50 px-3 py-1.5 text-sm text-lime-700">
                                      {domain}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="rounded-[22px] bg-zinc-50 p-4">
                              <p className="font-semibold text-zinc-950">Executables from AI</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {generatedTargets.executables.map((executable) => (
                                  <span key={executable} className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700">
                                    {executable}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="rounded-[22px] bg-zinc-50 p-4">
                              <p className="font-semibold text-zinc-950">Add executables manually</p>
                              <p className="mt-1 text-sm text-zinc-500">Pisahkan dengan baris baru atau koma.</p>
                              <textarea
                                value={state.manualExecutables}
                                onChange={(event) => updateState({ manualExecutables: event.target.value })}
                                className="mt-3 min-h-28 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-lime-300 focus:ring-4 focus:ring-lime-100"
                                placeholder="CustomApp.exe\nAnotherApp.exe"
                              />
                              {manualExecutablesList.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {manualExecutablesList.map((executable) => (
                                    <span key={executable} className="rounded-full border border-lime-200 bg-lime-50 px-3 py-1.5 text-sm text-lime-700">
                                      {executable}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-lime-100 bg-lime-50/70 p-4 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-lime-700">Habit summary</p>
                        <div className="mt-4 space-y-4 text-sm text-zinc-700">
                          <div>
                            <p className="text-zinc-500">Category</p>
                            <p className="mt-1 font-semibold text-zinc-950">{categoryOptions.find((option) => option.id === state.category)?.label}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500">Mode</p>
                            <p className="mt-1 font-semibold text-zinc-950">{state.mode}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500">Budget</p>
                            <p className="mt-1 font-semibold text-zinc-950">{state.mode === "Abstinence" ? "Zero tolerance" : state.budget}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500">Schedule</p>
                            <p className="mt-1 font-semibold text-zinc-950">{state.schedule}</p>
                          </div>
                          <div>
                            <p className="text-zinc-500">Final target count</p>
                            <p className="mt-1 font-semibold text-zinc-950">
                              {combinedTargets.domains.length} domains · {combinedTargets.executables.length} executables
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="border-t border-zinc-200 px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-zinc-500">
                    Step {state.step} of 3 · Smooth setup for AI-generated habit tracking
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    {state.step > 1 ? (
                      <Button variant="outline" className="h-11 rounded-2xl px-5" onClick={goBack}>
                        <ChevronLeft className="size-4" />
                        Back
                      </Button>
                    ) : (
                      <Button variant="ghost" className="h-11 rounded-2xl px-5" onClick={closeModal}>
                        Cancel
                      </Button>
                    )}

                    {state.step < 3 ? (
                      <Button className="h-11 rounded-2xl px-5" onClick={goNext} disabled={!canGoNext}>
                        Continue
                        <ChevronRight className="size-4" />
                      </Button>
                    ) : (
                      <Button className="h-11 rounded-2xl px-5" onClick={submitHabit}>
                        <Check className="size-4" />
                        {submitLabel}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
