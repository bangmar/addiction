import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
};

export default function SectionCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  headerClassName,
}: Readonly<SectionCardProps>) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3 border-b border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6",
          headerClassName,
        )}
      >
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h2>
          {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className={cn("px-5 py-5 sm:px-6", contentClassName)}>{children}</div>
    </section>
  );
}
