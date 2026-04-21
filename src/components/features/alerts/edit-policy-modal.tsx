"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellRing, FilePenLine, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { AlertPolicy } from "./types";

const modalVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};

type EditPolicyModalProps = {
  policy: AlertPolicy | null;
  open: boolean;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (values: { title: string; description: string; trigger: string; action: string }) => Promise<void>;
};

export default function EditPolicyModal({
  policy,
  open,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: Readonly<EditPolicyModalProps>) {
  const [title, setTitle] = useState(policy?.title ?? "");
  const [description, setDescription] = useState(policy?.description ?? "");
  const [trigger, setTrigger] = useState(policy?.trigger ?? "");
  const [action, setAction] = useState(policy?.action ?? "");

  return (
    <AnimatePresence>
      {open && policy ? (
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
            className='flex h-dvh w-full max-w-3xl flex-col overflow-hidden rounded-t-[28px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] sm:h-auto sm:max-h-[92vh] sm:rounded-[32px]'>
            <div className='border-b border-zinc-200 px-4 py-4 sm:px-6'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='text-sm font-medium tracking-[0.24em] text-rose-600'>
                    EDIT POLICY
                  </p>
                  <h2 className='mt-2 text-2xl font-semibold tracking-tight text-zinc-950'>
                    {policy.title}
                  </h2>
                  <p className='mt-2 text-sm text-zinc-500'>
                    Update the alert policy copy and enforcement rule shown in the Alerts control center.
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
              <div className='space-y-6'>
                <div className='grid gap-3 sm:grid-cols-2'>
                  <div className='rounded-[24px] border border-zinc-200 p-5 shadow-sm'>
                    <div className='flex items-start gap-3'>
                      <div className='flex size-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-700'>
                        <FilePenLine className='size-5' />
                      </div>
                      <div>
                        <p className='font-semibold text-zinc-950'>Policy identity</p>
                        <p className='mt-2 text-sm leading-6 text-zinc-600'>
                          Gunakan judul dan deskripsi yang jelas supaya intent policy mudah dipahami di dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='rounded-[24px] border border-zinc-200 p-5 shadow-sm'>
                    <div className='flex items-start gap-3'>
                      <div className='flex size-11 items-center justify-center rounded-2xl bg-lime-500/10 text-lime-700'>
                        <ShieldCheck className='size-5' />
                      </div>
                      <div>
                        <p className='font-semibold text-zinc-950'>Response behavior</p>
                        <p className='mt-2 text-sm leading-6 text-zinc-600'>
                          Atur trigger dan action agar sesuai dengan flow notifikasi dan review incident yang Anda butuhkan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='rounded-[24px] border border-zinc-200 p-5 shadow-sm'>
                  <label className='text-sm font-semibold text-zinc-900'>Policy title</label>
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className='mt-3 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-rose-300 focus:bg-white'
                    placeholder='Budget reached notification'
                    disabled={isSubmitting}
                  />

                  <label className='mt-5 block text-sm font-semibold text-zinc-900'>Description</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    className='mt-3 min-h-28 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-300 focus:bg-white'
                    placeholder='Jelaskan kapan policy ini dipakai.'
                    disabled={isSubmitting}
                  />
                </div>

                <div className='rounded-[24px] border border-zinc-200 p-5 shadow-sm'>
                  <label className='flex items-center gap-2 text-sm font-semibold text-zinc-900'>
                    <BellRing className='size-4 text-zinc-500' />
                    Trigger condition
                  </label>
                  <input
                    value={trigger}
                    onChange={(event) => setTrigger(event.target.value)}
                    className='mt-3 h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 outline-none transition focus:border-rose-300 focus:bg-white'
                    placeholder='When daily budget = 100%'
                    disabled={isSubmitting}
                  />

                  <label className='mt-5 block text-sm font-semibold text-zinc-900'>Action response</label>
                  <textarea
                    value={action}
                    onChange={(event) => setAction(event.target.value)}
                    className='mt-3 min-h-28 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-300 focus:bg-white'
                    placeholder='Windows toast + persist alert in dashboard'
                    disabled={isSubmitting}
                  />
                  {error ? <p className='mt-3 text-sm font-medium text-rose-600'>{error}</p> : null}
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
                  onClick={() => void onSubmit({ title, description, trigger, action })}
                  disabled={isSubmitting}>
                  {isSubmitting ? 'Saving policy...' : 'Save policy'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
