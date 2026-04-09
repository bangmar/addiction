"use client";

import { motion } from "framer-motion";
import {
	CircleHelp,
	Clock3,
	MoreHorizontal,
	Play,
	Search,
	TimerReset,
	Zap,
} from "lucide-react";

import IconTile from "@/src/components/ui/icon-tile";
import SectionCard from "@/src/components/ui/section-card";
import { cn } from "@/lib/utils";

import AnalyticsChart from "./analytics-chart";
import useDashboard from "./hook";
import DashboardSidebar from "./sidebar";
import SummaryChart from "./summary-chart";

const fadeInUp = {
	initial: { opacity: 0, y: 18 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, amount: 0.2 },
	transition: { duration: 0.45, ease: "easeOut" as const },
};

export default function DashboardFeature() {
	const {
		activeSession,
		analytics,
		desktopStatus,
		highlightDate,
		highlightValue,
		primaryNavigation,
		programs,
		programsLabel,
		recentActivities,
		riskSources,
		searchPlaceholder,
		selectedPeriod,
		statCards,
		summarySegments,
		summaryStats,
		targets,
		teamOnlineCount,
		workspaceLabel,
		workspaceName,
	} = useDashboard();

	return (
		<div className='min-h-screen bg-[#d9d9d9] p-3 text-zinc-950 sm:p-4 lg:p-6'>
			<motion.main
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className='mx-auto grid w-full max-w-370 overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] xl:grid-cols-[280px_minmax(0,1fr)]'>
				<DashboardSidebar
					primaryNavigation={primaryNavigation}
					targets={targets}
					workspaceLabel={workspaceLabel}
					workspaceName={workspaceName}
				/>

				<section className='min-w-0 bg-white'>
					<div className='flex flex-col gap-4 border-b border-zinc-200/80 px-4 py-4 sm:px-6 lg:px-6 xl:px-8'>
						<div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
							<div className='flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-200 bg-[#fcfcfc] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] lg:max-w-110 lg:flex-1'>
								<Search className='size-4 shrink-0 text-zinc-500' />
								<span className='truncate text-sm text-zinc-500'>
									{searchPlaceholder}
								</span>
								<span className='rounded-lg border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500'>
									/
								</span>
							</div>
						</div>
					</div>

					<div className='grid gap-5 p-4 sm:p-6 2xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] xl:p-8'>
						<div className='space-y-5'>
							<motion.section
								{...fadeInUp}
								className='grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(260px,0.9fr)]'>
								<div className='rounded-[28px] border border-lime-100 bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.12),transparent_45%),linear-gradient(135deg,#fafffb,#f7f8f8)] p-5 shadow-[0_18px_40px_rgba(132,204,22,0.08)] sm:p-6'>
									<div className='flex items-start justify-between gap-4'>
										<div>
											<div className='mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-lime-600'>
												<span className='size-2 rounded-full bg-lime-500' />
												{activeSession.eyebrow}
											</div>
											<h1 className='text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[2.05rem]'>
												{activeSession.title}
											</h1>
											<p className='mt-2 text-base text-zinc-500 sm:text-lg'>
												{activeSession.subtitle}
											</p>
										</div>
									</div>
									<div className='mt-8 flex flex-wrap items-end justify-between gap-4 sm:mt-10'>
										<div className='text-[2.3rem] font-medium leading-none tracking-tight text-zinc-950 sm:text-[3.2rem]'>
											{activeSession.duration}
										</div>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.97 }}
											className='flex size-14 items-center justify-center rounded-full bg-linear-to-br from-lime-400 to-lime-500 text-white shadow-[0_20px_35px_rgba(132,204,22,0.35)] sm:size-16'>
											<Zap className='size-6 fill-current' />
										</motion.button>
									</div>
								</div>

								<div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-1'>
									{statCards.map((card) => {
										const Icon = card.icon;

										return (
											<div
												key={card.label}
												className='rounded-[24px] border border-zinc-200 bg-white p-5 shadow-[0_18px_35px_rgba(15,23,42,0.04)]'>
												<div className='flex items-start justify-between gap-4'>
													<IconTile icon={Icon} />
													<span className='text-sm font-semibold text-emerald-500'>
														{card.delta}
													</span>
												</div>
												<p className='mt-4 text-sm text-zinc-500'>
													{card.label}
												</p>
												<p className='mt-1 text-[2rem] font-semibold tracking-tight text-zinc-950'>
													{card.value}
												</p>
											</div>
										);
									})}
								</div>
							</motion.section>

							<motion.div {...fadeInUp}>
								<SectionCard
									title='Usage Analytics'
									action={
										<div className='inline-flex w-fit rounded-2xl border border-zinc-200 bg-zinc-50 p-1 text-sm text-zinc-500'>
											{[selectedPeriod, "Weekly", "Monthly"].map((period) => (
												<button
													key={period}
													className={cn(
														"rounded-xl px-3 py-2 transition-colors sm:px-4",
														period === selectedPeriod &&
															"bg-white text-zinc-950 shadow-sm",
													)}>
													{period}
												</button>
											))}
										</div>
									}
									contentClassName='px-4 py-5 sm:px-6 sm:py-6'>
									<AnalyticsChart
										points={analytics}
										activeLabel={highlightDate}
										activeValue={highlightValue}
									/>
								</SectionCard>
							</motion.div>

							<motion.div {...fadeInUp}>
								<SectionCard
									title='Intervention Activity'
									action={
										<button className='text-sm font-semibold text-emerald-600'>
											See All
										</button>
									}
									contentClassName='px-3 py-3 sm:px-4'>
									<div className='space-y-3 md:hidden'>
										{recentActivities.map((activity) => (
											<div
												key={activity.title}
												className='rounded-2xl border border-zinc-200 p-4 shadow-sm'>
												<div className='flex items-start justify-between gap-3'>
													<div className='min-w-0'>
														<p className='font-medium text-zinc-950'>
															{activity.title}
														</p>
														<p className='mt-1 text-sm text-zinc-500'>
															{activity.project}
														</p>
													</div>
													<span
														className={cn(
															"inline-flex shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
															activity.tagClassName,
														)}>
														{activity.tag}
													</span>
												</div>
												<div className='mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500'>
													<span>{activity.timestamp}</span>
													<span className='flex items-center gap-2 font-medium text-zinc-700'>
														<Clock3 className='size-4 text-zinc-400' />
														{activity.duration}
													</span>
												</div>
											</div>
										))}
									</div>

									<div className='hidden overflow-x-auto md:block'>
										<div className='min-w-180 space-y-1'>
											{recentActivities.map((activity) => (
												<div
													key={activity.title}
													className='grid grid-cols-[minmax(220px,1.8fr)_110px_140px_110px_42px_32px] items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-zinc-50'>
													<div>
														<p className='font-medium text-zinc-950'>
															{activity.title}
														</p>
														<p className='text-sm text-zinc-500'>
															{activity.project}
														</p>
													</div>
													<span
														className={cn(
															"inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold",
															activity.tagClassName,
														)}>
														{activity.tag}
													</span>
													<p className='text-sm text-zinc-500'>
														{activity.timestamp}
													</p>
													<p className='flex items-center gap-2 text-sm font-medium text-zinc-700'>
														<Clock3 className='size-4 text-zinc-400' />
														{activity.duration}
													</p>
													<button className='flex size-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100'>
														<Play className='size-4' />
													</button>
													<button className='flex size-8 items-center justify-center text-zinc-500'>
														<MoreHorizontal className='size-4' />
													</button>
												</div>
											))}
										</div>
									</div>
								</SectionCard>
							</motion.div>
						</div>

						<div className='space-y-5'>
							<motion.div {...fadeInUp}>
								<SectionCard
									title='Summary'
									action={<CircleHelp className='size-5 text-zinc-400' />}>
									<div className='space-y-5'>
										<div className='grid grid-cols-2 gap-4 sm:grid-cols-4 2xl:grid-cols-2'>
											{summaryStats.map((item) => (
												<div key={item.label}>
													<p className='text-sm text-zinc-500'>{item.label}</p>
													<p className='mt-1 text-lg font-semibold tracking-tight text-zinc-950'>
														{item.value}
													</p>
												</div>
											))}
										</div>

										<div className='rounded-[24px] bg-zinc-50 p-3'>
											<SummaryChart segments={summarySegments} />
										</div>

										<div className='flex flex-wrap gap-4 text-sm text-zinc-600'>
											{summarySegments.map((segment) => (
												<span
													key={segment.label}
													className='flex items-center gap-2'>
													<span
														className='size-2.5 rounded-full'
														style={{ backgroundColor: segment.color }}
													/>
													{segment.label}
												</span>
											))}
										</div>
									</div>
								</SectionCard>
							</motion.div>

							<motion.div {...fadeInUp}>
								<SectionCard
									title='High Risk Sources'
									action={
										<p className='text-sm font-medium text-zinc-500'>
											<span className='mr-2 inline-block size-2 rounded-full bg-emerald-500' />
											{teamOnlineCount}
										</p>
									}
									contentClassName='px-3 py-3 sm:px-4'>
									<div className='space-y-1'>
										{riskSources.map((source) => (
											<div
												key={source.name}
												className='grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl px-2 py-3 transition-colors hover:bg-zinc-50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center'>
												<div className='relative flex size-12 items-center justify-center rounded-full bg-[#f2ece6] text-sm font-semibold text-zinc-700'>
													{source.avatar}
													<span
														className={cn(
															"absolute bottom-0 right-0 size-3 rounded-full border-2 border-white",
															source.online ? "bg-emerald-500" : "bg-zinc-300",
														)}
													/>
												</div>
												<div className='min-w-0'>
													<p className='truncate font-medium text-zinc-950'>
														{source.name}
													</p>
													<p className='truncate text-sm text-zinc-500'>
														{source.category}
													</p>
												</div>
												<div className='col-span-2 flex items-center justify-between gap-3 pl-15 text-sm sm:col-span-1 sm:block sm:pl-0 sm:text-right'>
													<p className='font-medium text-zinc-950'>
														{source.trackedTime}
													</p>
													<p className='mt-1 flex items-center gap-1 text-zinc-600 sm:justify-end'>
														<Zap className='size-3.5 text-amber-400' />
														{source.riskLevel}
													</p>
												</div>
											</div>
										))}
									</div>
								</SectionCard>
							</motion.div>

							<motion.div {...fadeInUp}>
								<SectionCard
									title='Recovery Programs'
									action={<CircleHelp className='size-5 text-zinc-400' />}>
									<div className='space-y-5'>
										<div>
											<div className='mb-3 flex items-center justify-between text-sm text-zinc-500'>
												<p className='flex items-center gap-2'>
													<Zap className='size-4' />
													Active Programs
												</p>
												<span className='font-semibold text-lime-600'>
													{programsLabel}
												</span>
											</div>
											<div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2'>
												{programs.map((program) => {
													const Icon = program.icon;

													return (
														<div
															key={program.name}
															className='rounded-[22px] border border-zinc-200 bg-[#fbfcff] p-4 shadow-sm'>
															<div className='flex items-start gap-3'>
																<IconTile
																	icon={Icon}
																	className={cn(
																		"border-none",
																		program.accentClassName,
																	)}
																/>
																<div>
																	<p className='font-semibold text-zinc-950'>
																		{program.name}
																	</p>
																	<p className='mt-1 text-sm text-zinc-500'>
																		{program.tasksRemaining}
																	</p>
																</div>
															</div>
														</div>
													);
												})}
											</div>
										</div>

										<div>
											<p className='mb-3 flex items-center gap-2 text-sm text-zinc-500'>
												<TimerReset className='size-4' />
												Desktop Agent Status
											</p>
											<div className='flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-zinc-200 p-4 shadow-sm'>
												<div>
													<p className='font-semibold text-zinc-950'>
														{desktopStatus.title}
													</p>
													<p className='mt-1 text-sm text-zinc-500'>
														{desktopStatus.subtitle}
													</p>
												</div>
												<motion.button
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.97 }}
													className='flex size-12 items-center justify-center rounded-full bg-linear-to-br from-lime-400 to-lime-500 text-white shadow-[0_15px_30px_rgba(132,204,22,0.28)]'>
													<Zap className='size-5 fill-current' />
												</motion.button>
											</div>
										</div>
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
