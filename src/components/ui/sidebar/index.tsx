"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
	CircleHelp,
	EllipsisVertical,
	LogOut,
	Sparkles,
	SunMedium,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import useSidebar from "./hook";

function getInitials(value?: string | null) {
	if (!value) {
		return "TC";
	}

	const parts = value.trim().split(/\s+/).filter(Boolean).slice(0, 2);
	if (parts.length === 0) {
		return "TC";
	}

	return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default function DashboardSidebar() {
	const pathname = usePathname();
	const { data: session } = useSession();
	const { primaryNavigation, targets, workspaceLabel, workspaceName } =
		useSidebar();
	const settingsActive = pathname === "/settings";
	const userName = session?.user?.name?.trim() || workspaceName;
	const userEmail = session?.user?.email?.trim() || "No email connected";
	const userInitials = getInitials(session?.user?.name ?? session?.user?.email);

	async function handleLogout() {
		await signOut({ callbackUrl: "/portal", redirect: true });
	}

	return (
		<aside className='flex flex-col border-b border-zinc-200/80 bg-[#fbfbfb] p-4 sm:p-5 lg:min-h-230 lg:border-r lg:border-b-0 lg:p-6'>
			<div className='flex items-center justify-between gap-3'>
				<div className='flex items-center gap-3'>
					<div className='flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-lime-500 to-emerald-600 text-white shadow-sm'>
						<Sparkles className='size-5' />
					</div>
					<div>
						<p className='text-lg font-semibold tracking-tight'>TimerCheck</p>
						<p className='text-xs text-zinc-500'>Habit recovery dashboard</p>
					</div>
				</div>
				<Button
					variant='ghost'
					size='icon-sm'
					className='rounded-xl text-zinc-500'>
					<EllipsisVertical className='size-4' />
				</Button>
			</div>

			<div className='mt-6 space-y-6 sm:mt-8 sm:space-y-8'>
				<div>
					<p className='mb-3 text-sm text-zinc-500'>General</p>
					<nav className='grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1'>
						{primaryNavigation.map((item) => {
							const Icon = item.icon;

							return (
								<Link
									key={item.label}
									href={item.href}
									className={cn(
										"flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors",
										item.active
											? "border border-zinc-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.06)]"
											: "text-zinc-600 hover:bg-white hover:text-zinc-950",
									)}>
									<Icon className='size-4' />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</nav>
				</div>

				<div>
					<div className='mb-3 flex items-center justify-between'>
						<p className='text-sm text-zinc-500'>Tracking Targets</p>
						<Button
							variant='ghost'
							size='icon-sm'
							className='rounded-xl text-zinc-500'>
							<EllipsisVertical className='size-4' />
						</Button>
					</div>
					<div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-1'>
						{targets.map((target) => {
							const Icon = target.icon;

							return (
								<div
									key={target.name}
									className='flex items-start gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-colors hover:border-zinc-200 hover:bg-white'>
									<div
										className={cn(
											"mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl",
											target.accentClassName,
										)}>
										<Icon className='size-4' />
									</div>
									<div className='min-w-0'>
										<p className='text-sm font-medium text-zinc-900'>
											{target.name}
										</p>
										<p className='text-xs text-zinc-500'>{target.subtitle}</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			<div className='mt-6 space-y-3 border-t border-zinc-200/80 pt-6 lg:mt-auto lg:border-t-0 lg:pt-8'>
				<button className='flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-white hover:text-zinc-950'>
					<CircleHelp className='size-4' />
					Help Center
				</button>
				<Link
					href='/settings'
					className={cn(
						"flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-colors",
						settingsActive
							? "border border-zinc-200 bg-white font-medium text-zinc-950 shadow-[0_10px_25px_rgba(15,23,42,0.06)]"
							: "text-zinc-600 hover:bg-white hover:text-zinc-950",
					)}>
					<SunMedium className='size-4' />
					Settings
				</Link>
				<Button
					variant='outline'
					className='h-11 w-full rounded-2xl border-rose-300 bg-rose-500 px-5 text-white shadow-[0_14px_30px_rgba(244,63,94,0.24)] hover:border-rose-400 hover:bg-rose-400 hover:text-white'
					onClick={handleLogout}>
					<LogOut className='size-4' />
					Logout
				</Button>
				<div className='rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)]'>
					<p className='text-xs font-medium uppercase tracking-[0.22em] text-zinc-400'>
						{workspaceLabel}
					</p>
					<div className='mt-2 flex items-center gap-3'>
						<div className='flex size-11 items-center justify-center rounded-2xl bg-[#103f4a] text-lime-100'>
							<span className='text-sm font-semibold tracking-[0.18em]'>
								{userInitials}
							</span>
						</div>
						<div className='min-w-0'>
							<p className='truncate text-sm font-semibold text-zinc-900'>
								{userName}
							</p>
							<p className='truncate text-xs text-zinc-500'>{userEmail}</p>
						</div>
					</div>
				</div>
			</div>
		</aside>
	);
}
