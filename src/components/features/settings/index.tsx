"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Globe2,
  KeyRound,
  Search,
  Settings2,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/src/components/ui/dashboard-sidebar";
import IconTile from "@/src/components/ui/icon-tile";
import SectionCard from "@/src/components/ui/section-card";
import { cn } from "@/lib/utils";

import useSettings from "./hook";

const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

export default function SettingsFeature() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const {
    insights,
    languageOptions,
    loginDeviceFilters,
    loginLogs,
    passwordRequirements,
    primaryNavigation,
    profileCompletion,
    profileFields,
    profileUpdatedAt,
    searchPlaceholder,
    selectedLanguage,
    targets,
    workspaceLabel,
    workspaceName,
  } = useSettings();

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
                <p className="text-sm font-medium tracking-[0.24em] text-lime-600">PROFILE SETTINGS</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                  Manage profile preferences and login activity
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-zinc-500 sm:text-base">
                  Halaman settings ini fokus ke data profile, reset password, preferensi bahasa, dan login log per device.
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
                <SectionCard
                  title="Profile settings"
                  description="Kelola foto profile, nama, email, dan bahasa aplikasi."
                  className="border-lime-100 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.12),transparent_45%),linear-gradient(135deg,#fafffb,#f7f8f8)] shadow-[0_18px_40px_rgba(132,204,22,0.08)]"
                  contentClassName="space-y-6"
                >
                  <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-sm">
                      <div className="flex size-24 items-center justify-center rounded-[28px] bg-linear-to-br from-lime-500 to-emerald-600 text-white shadow-[0_18px_35px_rgba(132,204,22,0.24)]">
                        <UserRound className="size-10" />
                      </div>
                      <p className="mt-4 text-lg font-semibold text-zinc-950">Mario Pratama</p>
                      <p className="mt-1 text-sm text-zinc-500">Recovery workspace owner</p>
                      <div className="mt-5 rounded-full bg-zinc-200 p-1">
                        <div
                          className="h-2 rounded-full bg-linear-to-r from-lime-400 to-emerald-500"
                          style={{ width: `${profileCompletion * 100}%` }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-zinc-600">{profileUpdatedAt}</p>
                      <Button variant="outline" className="mt-4 h-10 w-full rounded-2xl bg-white">
                        Upload photo
                      </Button>
                    </div>

                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        {profileFields.map((field) => (
                          <div key={field.label} className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">{field.label}</label>
                            <input
                              type={field.type ?? "text"}
                              defaultValue={field.value}
                              placeholder={field.placeholder}
                              className="h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-lime-400"
                            />
                            {field.helper ? <p className="text-xs text-zinc-500">{field.helper}</p> : null}
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">Language</label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {languageOptions.map((option) => {
                            const active = option.value === selectedLanguage;

                            return (
                              <button
                                key={option.value}
                                type="button"
                                className={cn(
                                  "flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-sm font-medium transition-colors",
                                  active
                                    ? "border-lime-200 bg-lime-50 text-lime-800"
                                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950",
                                )}
                              >
                                <Globe2 className="size-4 shrink-0" />
                                <span className="min-w-0 truncate">{option.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-zinc-200/80 pt-5 sm:flex-row sm:items-center sm:justify-end">
                    <Button variant="outline" className="h-11 rounded-2xl bg-white px-5">
                      Cancel
                    </Button>
                    <Button className="h-11 rounded-2xl px-5">
                      <Settings2 className="size-4" />
                      Save changes
                    </Button>
                  </div>
                </SectionCard>
              </motion.div>

              <motion.div {...fadeInUp}>
                <SectionCard
                  title="Reset password"
                  description="Pisahkan perubahan password dari profile utama agar flow account settings lebih rapi."
                  contentClassName="space-y-4"
                >
                  <div className="rounded-[24px] border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm((value) => !value)}
                      className="flex w-full items-center justify-between gap-3 text-left"
                    >
                      <div>
                        <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                          <KeyRound className="size-4 text-lime-600" />
                          Reset password
                        </p>
                        <p className="mt-1 text-sm text-zinc-500">
                          Klik untuk menampilkan form reset password.
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-zinc-500 transition-transform",
                          showPasswordForm && "rotate-180",
                        )}
                      />
                    </button>

                    {showPasswordForm ? (
                      <div className="mt-4 space-y-4 border-t border-zinc-200 pt-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            type="password"
                            placeholder="Current password"
                            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-lime-400"
                          />
                          <input
                            type="password"
                            placeholder="New secure password"
                            className="h-12 rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-lime-400"
                          />
                        </div>

                        <ul className="grid gap-2 sm:grid-cols-2">
                          {passwordRequirements.map((item) => (
                            <li key={item.label} className="flex items-center gap-2 text-sm text-zinc-600">
                              <CheckCircle2 className="size-4 text-lime-600" />
                              <span>{item.label}</span>
                            </li>
                          ))}
                        </ul>

                        <Button className="h-11 rounded-2xl px-5">Reset password</Button>
                      </div>
                    ) : null}
                  </div>
                </SectionCard>
              </motion.div>

              <motion.div {...fadeInUp}>
                <SectionCard
                  title="Login log"
                  description="Pantau riwayat login terbaru berdasarkan waktu dan device yang digunakan."
                  action={
                    <div className="flex flex-wrap gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-1 text-sm text-zinc-500">
                      {loginDeviceFilters.map((filter, index) => (
                        <button
                          key={filter}
                          className={cn(
                            "rounded-xl px-3 py-2 transition-colors",
                            index === 0 && "bg-white text-zinc-950 shadow-sm",
                          )}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  }
                  contentClassName="space-y-3"
                >
                  {loginLogs.map((log) => (
                    <div
                      key={`${log.title}-${log.timestamp}`}
                      className="flex flex-col gap-4 rounded-[24px] border border-zinc-200 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <IconTile icon={Smartphone} className={cn("border-none", log.accentClassName)} />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-zinc-950">{log.title}</p>
                            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", log.accentClassName)}>
                              {log.device}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-zinc-500">{log.location}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-700">
                        {log.timestamp}
                      </div>
                    </div>
                  ))}
                </SectionCard>
              </motion.div>
            </div>

            <div className="space-y-5">
              <motion.div {...fadeInUp}>
                <SectionCard title="Profile checklist" contentClassName="space-y-3">
                  <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/70 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      <ShieldCheck className="size-4" />
                      Ready to save
                    </p>
                    <p className="mt-2 text-sm text-emerald-800">
                      Foto profile, nama, dan preferensi bahasa siap disimpan ke workspace account settings.
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-4">
                    <p className="font-semibold text-zinc-950">Checklist</p>
                    <ul className="mt-3 space-y-2 text-sm text-zinc-600">
                      <li className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-lime-600" />
                        <span>Upload atau ubah foto profile</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-lime-600" />
                        <span>Perbarui nama user sesuai identitas workspace</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-lime-600" />
                        <span>Review login log sebelum save perubahan</span>
                      </li>
                    </ul>
                  </div>
                </SectionCard>
              </motion.div>

              <motion.div {...fadeInUp}>
                <SectionCard title="Settings notes" contentClassName="space-y-3">
                  {insights.map((insight) => (
                    <div key={insight.title} className="rounded-[22px] border border-zinc-200 p-4 shadow-sm">
                      <p className="font-semibold text-zinc-950">{insight.title}</p>
                      <p className="mt-1 text-sm text-zinc-500">{insight.description}</p>
                    </div>
                  ))}
                </SectionCard>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}
