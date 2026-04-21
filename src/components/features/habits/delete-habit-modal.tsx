"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { HabitCard } from "./types";

const modalVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};

type DeleteHabitModalProps = {
  habit: HabitCard | null;
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteHabitModal({
  habit,
  open,
  isSubmitting,
  onClose,
  onConfirm,
}: Readonly<DeleteHabitModalProps>) {
  return (
    <AnimatePresence>
      {open && habit ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/45 p-0 sm:items-center sm:p-6'>
          <motion.div
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
            transition={{ duration: 0.25, ease: "easeOut" }}
            className='flex h-dvh w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:h-auto sm:max-h-[92vh] sm:rounded-[32px]'>
            <div className='border-b border-zinc-200 px-4 py-4 sm:px-6'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-sm font-medium tracking-[0.24em] text-rose-600'>
                    DELETE HABIT
                  </p>
                  <h2 className='mt-2 text-2xl font-semibold tracking-tight text-zinc-950'>
                    Delete {habit.name}?
                  </h2>
                  <p className='mt-2 text-sm text-zinc-500'>
                    This will remove the habit from your workspace and stop syncing its targets to the desktop agent.
                  </p>
                </div>

                <Button
                  variant='ghost'
                  size='icon-sm'
                  className='rounded-xl text-zinc-500'
                  onClick={onClose}
                  disabled={isSubmitting}>
                  <X className='size-4' />
                </Button>
              </div>
            </div>

            <div className='flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6'>
              <div className='space-y-4'>
                <div className='rounded-[24px] border border-rose-200 bg-rose-50/70 p-5 shadow-sm'>
                  <div className='flex items-start gap-3'>
                    <div className='flex size-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-700'>
                      <AlertTriangle className='size-5' />
                    </div>
                    <div>
                      <p className='font-semibold text-zinc-950'>Delete confirmation</p>
                      <p className='mt-2 text-sm leading-6 text-zinc-600'>
                        Targets in this habit include {habit.domains.length} domain{habit.domains.length === 1 ? "" : "s"} and {habit.executables.length} executable{habit.executables.length === 1 ? "" : "s"}.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='rounded-[24px] border border-zinc-200 p-5 shadow-sm'>
                  <p className='text-sm font-semibold text-zinc-900'>Habit details</p>
                  <div className='mt-4 grid gap-3 sm:grid-cols-3'>
                    <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
                      <p className='text-xs uppercase tracking-[0.2em] text-zinc-400'>Mode</p>
                      <p className='mt-2 font-semibold text-zinc-950'>{habit.mode}</p>
                    </div>
                    <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
                      <p className='text-xs uppercase tracking-[0.2em] text-zinc-400'>Schedule</p>
                      <p className='mt-2 font-semibold text-zinc-950'>{habit.schedule}</p>
                    </div>
                    <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
                      <p className='text-xs uppercase tracking-[0.2em] text-zinc-400'>Streak</p>
                      <p className='mt-2 font-semibold text-zinc-950'>{habit.streak}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='border-t border-zinc-200 px-4 py-4 sm:px-6'>
              <div className='flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
                <Button variant='outline' className='h-11 rounded-2xl px-5' onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  className='h-11 rounded-2xl border-rose-300 bg-rose-500 px-5 text-white shadow-[0_14px_30px_rgba(244,63,94,0.24)] hover:border-rose-400 hover:bg-rose-400 hover:text-white'
                  onClick={() => void onConfirm()}
                  disabled={isSubmitting}>
                  <Trash2 className='size-4' />
                  {isSubmitting ? 'Deleting habit...' : 'Delete habit'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
