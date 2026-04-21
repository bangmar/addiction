"use client";

import { motion } from "framer-motion";
import { Search, ShieldAlert, TriangleAlert, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import DashboardSidebar from "@/src/components/ui/sidebar";
import IconTile from "@/src/components/ui/icon-tile";
import SectionCard from "@/src/components/ui/section-card";
import { cn } from "@/lib/utils";

import useAlerts from "./hook";
import EditPolicyModal from "./edit-policy-modal";
import ReviewIncidentModal from "./review-incident-modal";

const fadeInUp = {
	initial: { opacity: 0, y: 18 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, amount: 0.2 },
	transition: { duration: 0.45, ease: "easeOut" as const },
};

export default function AlertsFeature() {
	const {
		channels,
		incidents,
		overviewStats,
		policies,
		searchPlaceholder,
		syncStatus,
		isLoading,
		selectedIncident,
		isReviewModalOpen,
		isSubmittingReview,
		reviewError,
		selectedPolicy,
		isPolicyModalOpen,
		isSubmittingPolicy,
		policyError,
		notice,
		openReviewModal,
		closeReviewModal,
		submitReview,
		openPolicyModal,
		closePolicyModal,
		submitPolicy,
	} = useAlerts();

	return (
		<>
			<div className='min-h-screen bg-[#d9d9d9] p-3 text-zinc-950 sm:p-4 lg:p-6'>
				<motion.main
					initial={{ opacity: 0, scale: 0.98 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					className='mx-auto grid w-full max-w-[160rem] overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] xl:grid-cols-[280px_minmax(0,1fr)]'>
					<DashboardSidebar />

					<section className='min-w-0 bg-white'>
						<div className='border-b border-zinc-200/80 px-4 py-4 sm:px-6 xl:px-8'>
							<div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
								<div>
									<p className='text-sm font-medium tracking-[0.24em] text-rose-600'>
										ALERT AUTOMATION
									</p>
									<h1 className='mt-2 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl'>
										Monitor intervention alerts in real time
									</h1>
									<p className='mt-2 max-w-3xl text-sm text-zinc-500 sm:text-base'>
										Halaman ini fokus ke violation alert, budget warning, desktop
										toast delivery, dan review incident yang tersimpan dari desktop agent.
									</p>
								</div>

								<div className='flex min-w-0 items-center gap-3 rounded-2xl border border-zinc-200 bg-[#fcfcfc] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] xl:max-w-110 xl:flex-1'>
									<Search className='size-4 shrink-0 text-zinc-500' />
									<span className='truncate text-sm text-zinc-500'>
										{searchPlaceholder}
									</span>
								</div>
							</div>
						</div>

						<div className='grid gap-5 p-4 sm:p-6 2xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] xl:p-8'>
							<div className='space-y-5'>
								<motion.div {...fadeInUp}>
									<section className='rounded-[28px] border border-rose-100 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.10),transparent_45%),linear-gradient(135deg,#fffafa,#f8f7f7)] p-5 shadow-[0_18px_40px_rgba(244,63,94,0.10)] sm:p-6'>
										<div className='flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between'>
											<div>
												<div className='mb-4 flex items-center gap-2 text-sm font-medium tracking-wide text-rose-600'>
													<span className='size-2 rounded-full bg-rose-500' />
													<span>INTERVENTION CONTROL CENTER</span>
												</div>
												<h2 className='text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[2.05rem]'>
													Detect, notify, and escalate risky behavior faster
												</h2>
												<p className='mt-2 max-w-2xl text-base text-zinc-500 sm:text-lg'>
													Saat desktop mengirim notification, incident juga akan tercatat di alert service agar bisa direview dari web.
												</p>
											</div>

											<div className='flex flex-wrap gap-3'>
												<Button
													variant='outline'
													className='h-11 rounded-2xl border-rose-300 bg-rose-500 px-5 text-white shadow-[0_14px_30px_rgba(244,63,94,0.24)] hover:border-rose-400 hover:bg-rose-400 hover:text-white'
												onClick={openPolicyModal}
												disabled={policies.length === 0}>
													<ShieldAlert className='size-4' />
													Edit policy
												</Button>
											</div>
										</div>

										<div className='mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
											{overviewStats.map((stat) => (
												<div
													key={stat.label}
													className='rounded-[22px] border border-white/80 bg-white/80 p-4 shadow-sm'>
													<p className='text-sm text-zinc-500'>{stat.label}</p>
													<p className='mt-2 text-2xl font-semibold tracking-tight text-zinc-950'>
														{stat.value}
													</p>
													<p className='mt-1 text-xs text-zinc-500'>
														{stat.detail}
													</p>
												</div>
											))}
										</div>

										{notice ? (
											<div
												className={cn(
													"mt-4 rounded-[22px] border px-4 py-3 text-sm font-medium",
													notice.type === "success"
														? "border-emerald-200 bg-emerald-50 text-emerald-700"
														: "border-rose-200 bg-rose-50 text-rose-700",
												)}>
												{notice.message}
											</div>
										) : null}
									</section>
								</motion.div>

								<motion.div {...fadeInUp}>
									<SectionCard
										title='Recent incidents'
										description='Feed alert utama dari desktop agent dan AI policy engine.'
										contentClassName='space-y-4'>
										{isLoading ? (
											<div className='rounded-[24px] border border-dashed border-zinc-200 p-5 text-sm text-zinc-500'>
												Loading alerts...
											</div>
										) : null}

										{!isLoading && incidents.length === 0 ? (
											<div className='rounded-[24px] border border-dashed border-zinc-200 p-5 text-sm text-zinc-500'>
												Belum ada alert. Nanti alert akan muncul saat desktop agent mengirim notification event.
											</div>
										) : null}

										{incidents.map((incident) => (
											<div
												key={incident.id}
												className='rounded-[24px] border border-zinc-200 p-4 shadow-sm sm:p-5'>
												<div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
													<div>
														<div className='flex flex-wrap items-center gap-2'>
															<h3 className='text-lg font-semibold text-zinc-950'>
																{incident.title}
															</h3>
															<span className={cn("rounded-full px-3 py-1 text-xs font-semibold", incident.severityClassName)}>
																{incident.severity}
															</span>
															<span className={cn("rounded-full px-3 py-1 text-xs font-semibold", incident.sourceClassName)}>
																{incident.sourceLabel}
															</span>
															{incident.reviewed ? (
																<span className='rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700'>
																	Reviewed
																</span>
															) : null}
														</div>
														<p className='mt-1 text-sm text-zinc-500'>
															{incident.category} · {incident.timestamp}
														</p>
													</div>

													<Button
														variant='outline'
														className='h-10 rounded-2xl border-rose-300 bg-rose-500 px-4 text-white shadow-[0_14px_30px_rgba(244,63,94,0.24)] hover:border-rose-400 hover:bg-rose-400 hover:text-white'
														onClick={() => openReviewModal(incident)}>
														Review incident
													</Button>
												</div>

												<p className='mt-4 text-sm leading-6 text-zinc-600'>
													{incident.message}
												</p>
												<div className='mt-4 rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-zinc-700'>
													Recommended next step:{" "}
													<span className='font-semibold text-zinc-950'>
														{incident.resolution}
													</span>
												</div>
												{incident.reviewNotes ? (
													<div className='mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800'>
														<span className='font-semibold text-emerald-900'>Review note:</span> {incident.reviewNotes}
													</div>
												) : null}
											</div>
										))}
									</SectionCard>
								</motion.div>

								<motion.div {...fadeInUp}>
									<SectionCard
										title='Alert policies'
										description='Rule yang mengatur kapan incident dibuat dan notifikasi dikirim.'
										contentClassName='space-y-3'>
										{policies.map((policy) => (
											<div
												key={policy.id}
												className='flex flex-col gap-4 rounded-[24px] border border-zinc-200 p-4 shadow-sm sm:flex-row sm:items-start'>
												<IconTile
													icon={policy.icon}
													className={cn("border-none", policy.accentClassName)}
												/>
												<div className='min-w-0 flex-1'>
													<p className='font-semibold text-zinc-950'>
														{policy.title}
													</p>
													<p className='mt-1 text-sm text-zinc-500'>
														{policy.description}
													</p>
													<div className='mt-4 grid gap-3 sm:grid-cols-2'>
														<div>
															<p className='text-xs uppercase tracking-[0.2em] text-zinc-400'>
																Trigger
															</p>
															<p className='mt-1 text-sm font-medium text-zinc-900'>
																{policy.trigger}
															</p>
														</div>
														<div>
															<p className='text-xs uppercase tracking-[0.2em] text-zinc-400'>
																Action
															</p>
															<p className='mt-1 text-sm font-medium text-zinc-900'>
																{policy.action}
															</p>
														</div>
													</div>
												</div>
											</div>
										))}
									</SectionCard>
								</motion.div>
							</div>

							<div className='space-y-5'>
								<motion.div {...fadeInUp}>
									<SectionCard
										title='Delivery channels'
										contentClassName='space-y-3'>
										{channels.map((channel) => (
											<div
												key={channel.title}
												className='rounded-[22px] border border-zinc-200 p-4 shadow-sm'>
												<div className='flex flex-wrap items-center justify-between gap-3'>
													<p className='font-semibold text-zinc-950'>
														{channel.title}
													</p>
													<span
														className={cn(
															"rounded-full px-3 py-1 text-xs font-semibold",
															channel.statusClassName,
														)}>
														{channel.status}
													</span>
												</div>
												<p className='mt-2 text-sm text-zinc-500'>
													{channel.description}
												</p>
											</div>
										))}
									</SectionCard>
								</motion.div>

								<motion.div {...fadeInUp}>
									<SectionCard
										title='Pipeline status'
										contentClassName='space-y-3'>
										<div className='rounded-[22px] border border-emerald-200 bg-emerald-50/70 p-4'>
											<p className='flex items-center gap-2 text-sm font-semibold text-emerald-700'>
												<Zap className='size-4' />
												Alert delivery
											</p>
											<p className='mt-2 text-sm text-emerald-800'>
												{syncStatus}
											</p>
										</div>
										<div className='rounded-[22px] border border-zinc-200 bg-zinc-50 p-4'>
											<p className='flex items-center gap-2 text-sm font-semibold text-zinc-800'>
												<TriangleAlert className='size-4 text-rose-500' />
												PRD alignment
											</p>
											<p className='mt-2 text-sm text-zinc-600'>
												Alerts page covers desktop toast notification,
												zero-tolerance abstinence detection, and moderate-mode
												budget warnings.
											</p>
										</div>
									</SectionCard>
								</motion.div>
							</div>
						</div>
					</section>
				</motion.main>
			</div>

			<ReviewIncidentModal
				key={selectedIncident?.id ?? "review-incident-modal"}
				incident={selectedIncident}
				open={isReviewModalOpen}
				isSubmitting={isSubmittingReview}
				error={reviewError}
				onClose={closeReviewModal}
				onSubmit={submitReview}
			/>

			<EditPolicyModal
				key={selectedPolicy?.id ?? "edit-policy-modal"}
				policy={selectedPolicy}
				open={isPolicyModalOpen}
				isSubmitting={isSubmittingPolicy}
				error={policyError}
				onClose={closePolicyModal}
				onSubmit={submitPolicy}
			/>
		</>
	);
}
