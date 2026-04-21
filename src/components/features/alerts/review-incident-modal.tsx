"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileText, ShieldAlert, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { AlertIncident } from "./types";

const modalVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 16, scale: 0.98 },
};

type ReviewIncidentModalProps = {
  incident: AlertIncident | null;
  open: boolean;
  isSubmitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (notes: string) => Promise<void>;
};

export default function ReviewIncidentModal({
  incident,
  open,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}: Readonly<ReviewIncidentModalProps>) {
  const [notes, setNotes] = useState(incident?.reviewNotes ?? incident?.resolution ?? "");

  return (
    <AnimatePresence>
      {open && incident ? (
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
                    REVIEW INCIDENT
                  </p>
                  <h2 className='mt-2 text-2xl font-semibold tracking-tight text-zinc-950'>
                    {incident.title}
                  </h2>
                  <p className='mt-2 text-sm text-zinc-500'>
                    Finalize the intervention follow-up and store the review note for this alert.
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
                <div className='grid gap-3 sm:grid-cols-3'>
                  <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
                    <p className='text-xs uppercase tracking-[0.2em] text-zinc-400'>Severity</p>
                    <p className='mt-2 font-semibold text-zinc-950'>{incident.severity}</p>
                  </div>
                  <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
                    <p className='text-xs uppercase tracking-[0.2em] text-zinc-400'>Category</p>
                    <p className='mt-2 font-semibold text-zinc-950'>{incident.category}</p>
                  </div>
                  <div className='rounded-2xl border border-zinc-200 bg-zinc-50 p-4'>
                    <p className='text-xs uppercase tracking-[0.2em] text-zinc-400'>Detected</p>
                    <p className='mt-2 font-semibold text-zinc-950'>{incident.timestamp}</p>
                  </div>
                </div>

                <div className='rounded-[24px] border border-zinc-200 p-5 shadow-sm'>
                  <div className='flex items-start gap-3'>
                    <div className='flex size-11 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-700'>
                      <ShieldAlert className='size-5' />
                    </div>
                    <div>
                      <p className='font-semibold text-zinc-950'>Incident summary</p>
                      <p className='mt-2 text-sm leading-6 text-zinc-600'>{incident.message}</p>
                    </div>
                  </div>
                </div>

                <div className='rounded-[24px] border border-zinc-200 p-5 shadow-sm'>
                  <div className='flex items-start gap-3'>
                    <div className='flex size-11 items-center justify-center rounded-2xl bg-lime-500/10 text-lime-700'>
                      <CheckCircle2 className='size-5' />
                    </div>
                    <div>
                      <p className='font-semibold text-zinc-950'>Recommended next step</p>
                      <p className='mt-2 text-sm leading-6 text-zinc-600'>{incident.resolution}</p>
                    </div>
                  </div>
                </div>

                <div className='rounded-[24px] border border-zinc-200 p-5 shadow-sm'>
                  <label className='flex items-center gap-2 text-sm font-semibold text-zinc-900'>
                    <FileText className='size-4 text-zinc-500' />
                    Review notes
                  </label>
                  <p className='mt-2 text-sm text-zinc-500'>
                    Jelaskan tindakan yang diambil, keputusan follow-up, atau perubahan habit yang diperlukan.
                  </p>
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className='mt-4 min-h-36 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-rose-300 focus:bg-white'
                    placeholder='Contoh: extend abstinence schedule sampai jam tidur, lalu review ulang besok pagi.'
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
                  onClick={() => void onSubmit(notes)}
                  disabled={isSubmitting}>
                  {isSubmitting ? 'Saving review...' : 'Save review'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
