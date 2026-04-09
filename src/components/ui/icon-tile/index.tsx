import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type IconTileProps = {
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
};

export default function IconTile({
  icon: Icon,
  className,
  iconClassName,
}: Readonly<IconTileProps>) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50",
        className,
      )}
    >
      <Icon className={cn("size-5 text-zinc-800", iconClassName)} />
    </div>
  );
}
