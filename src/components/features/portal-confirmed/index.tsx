import Link from "next/link";
import { ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import SectionCard from "@/src/components/ui/section-card";
import { cn } from "@/lib/utils";

export default function PortalConfirmedFeature({ status }: Readonly<{ status: string }>) {
  const approved = status === "approved";

  return (
    <div className="min-h-screen bg-[#d9d9d9] p-3 text-zinc-950 sm:p-4 lg:p-6">
      <main className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.25fr)]">
        <section className="bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.14),transparent_40%),linear-gradient(135deg,#fafffb,#f7f8f8)] p-6 sm:p-8 xl:p-10">
          <p className="text-sm font-medium tracking-[0.24em] text-lime-600">DESKTOP APPROVAL</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">{approved ? "Desktop access approved" : "Desktop access denied"}</h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500 sm:text-base">{approved ? "Aplikasi desktop sekarang bisa melanjutkan proses login. Anda bisa menutup browser ini." : "Permintaan login desktop ditolak. Jika perlu, mulai ulang dari aplikasi desktop."}</p>

          <div className="mt-8 rounded-[22px] border border-white/80 bg-white/80 p-4 shadow-sm">
            <p className="flex items-start gap-3 text-sm text-zinc-700">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-lime-600" />
              <span>Gunakan satu akun yang sama antara web dashboard dan desktop app.</span>
            </p>
          </div>
        </section>

        <section className="border-t border-zinc-200/80 p-4 sm:p-6 xl:border-t-0 xl:border-l xl:p-10">
          <SectionCard
            title="Confirmation result"
            description="Browser dapat ditutup setelah proses ini selesai."
            contentClassName="space-y-5"
          >
            <div className={cn("rounded-[22px] border p-5", approved ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50")}>
              <div className="flex items-start gap-3">
                <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", approved ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600")}>
                  {approved ? <Sparkles className="size-5" /> : <TriangleAlert className="size-5" />}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-zinc-950">{approved ? "Desktop sign-in approved" : "Desktop sign-in denied"}</p>
                  <p className="text-sm text-zinc-500">{approved ? "Anda bisa menutup browser sekarang dan kembali ke aplikasi desktop." : "Tutup halaman ini lalu ulangi login dari aplikasi desktop bila diperlukan."}</p>
                </div>
              </div>
            </div>

            <Link href="/" className={buttonVariants({ className: "h-11 w-full rounded-2xl px-5" })}>
              Back to dashboard
            </Link>
          </SectionCard>
        </section>
      </main>
    </div>
  );
}
