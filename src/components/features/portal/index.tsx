"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	CheckCircle2,
	Eye,
	EyeOff,
	LoaderCircle,
	LogIn,
	ShieldCheck,
	UserPlus,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SectionCard from "@/src/components/ui/section-card";

import usePortal from "./hook";
import type { PortalFeatureProps, PortalMode } from "./types";

const portalModes: { value: PortalMode; label: string }[] = [
	{ value: "login", label: "Login" },
	{ value: "register", label: "Register" },
];

type FieldErrorProps = {
	message?: string;
};

type PasswordFieldProps = {
	id: string;
	label: string;
	value: string;
	placeholder: string;
	isVisible: boolean;
	onToggleVisibility: () => void;
	onChange: (value: string) => void;
	error?: string;
};

function FieldError({ message }: Readonly<FieldErrorProps>) {
	if (!message) {
		return null;
	}

	return <p className='text-sm text-rose-500'>{message}</p>;
}

function PasswordField({
	id,
	label,
	value,
	placeholder,
	isVisible,
	onToggleVisibility,
	onChange,
	error,
}: Readonly<PasswordFieldProps>) {
	return (
		<div className='space-y-2'>
			<label className='text-sm font-medium text-zinc-700' htmlFor={id}>
				{label}
			</label>
			<div className='relative'>
				<input
					id={id}
					type={isVisible ? "text" : "password"}
					value={value}
					onChange={(event) => onChange(event.target.value)}
					placeholder={placeholder}
					className='h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 pr-12 text-sm outline-none transition focus:border-lime-400'
				/>
				<button
					type='button'
					onClick={onToggleVisibility}
					className='absolute inset-y-0 right-0 flex w-12 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-800'
					aria-label={isVisible ? "Hide password" : "Show password"}>
					{isVisible ? (
						<EyeOff className='size-4' />
					) : (
						<Eye className='size-4' />
					)}
				</button>
			</div>
			<FieldError message={error} />
		</div>
	);
}

export default function PortalFeature({
	oauthEnabled,
}: Readonly<PortalFeatureProps>) {
	const {
		brandEyebrow,
		title,
		subtitle,
		trustPoints,
		mode,
		isLogin,
		benefits,
		loginValues,
		registerValues,
		loginErrors,
		registerErrors,
		loginMessage,
		registerMessage,
		oauthMessage,
		isSubmittingLogin,
		isSubmittingRegister,
		isSubmittingOAuth,
		setMode,
		updateLoginValue,
		updateRegisterValue,
		submitLogin,
		submitRegister,
		submitGoogleAuth,
	} = usePortal({ oauthEnabled });
	const [showLoginPassword, setShowLoginPassword] = useState(false);
	const [showRegisterPassword, setShowRegisterPassword] = useState(false);
	const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
		useState(false);

	const isSubmitting = isLogin ? isSubmittingLogin : isSubmittingRegister;
	const activeMessage = isLogin ? loginMessage : registerMessage;
	const submitLabel = isLogin
		? "Login to dashboard"
		: "Create account & continue";
	const oauthLabel = useMemo(() => {
		if (!oauthEnabled) {
			return "Google OAuth belum dikonfigurasi";
		}

		return isLogin ? "Masuk dengan Google" : "Daftar dengan Google";
	}, [isLogin, oauthEnabled]);

	return (
		<div className='min-h-screen bg-[#d9d9d9] p-3 text-zinc-950 sm:p-4 lg:p-6'>
			<main className='mx-auto grid w-full max-w-7xl overflow-hidden rounded-[24px] border border-white/70 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] xl:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.25fr)]'>
				<section className='bg-[radial-gradient(circle_at_top_left,rgba(132,204,22,0.14),transparent_40%),linear-gradient(135deg,#fafffb,#f7f8f8)] p-6 sm:p-8 xl:p-10'>
					<p className='text-sm font-medium tracking-[0.24em] text-lime-600'>
						{brandEyebrow}
					</p>
					<h1 className='mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl'>
						{title}
					</h1>
					<p className='mt-3 max-w-2xl text-sm text-zinc-500 sm:text-base'>
						{subtitle}
					</p>

					<div className='mt-8 grid gap-4 sm:grid-cols-3 xl:grid-cols-1'>
						{trustPoints.map((point) => (
							<div
								key={point}
								className='rounded-[22px] border border-white/80 bg-white/80 p-4 shadow-sm'>
								<p className='flex items-start gap-3 text-sm text-zinc-700'>
									<ShieldCheck className='mt-0.5 size-4 shrink-0 text-lime-600' />
									<span>{point}</span>
								</p>
							</div>
						))}
					</div>
				</section>

				<section className='border-t border-zinc-200/80 p-4 sm:p-6 xl:border-t-0 xl:border-l xl:p-10'>
					<SectionCard
						title='Portal access'
						description='Gunakan satu halaman yang sama untuk login atau register dengan credentials atau Google OAuth.'
						contentClassName='space-y-5'>
						<div className='inline-flex w-full rounded-2xl border border-lime-100 bg-lime-50/60 p-1'>
							{portalModes.map((item) => {
								const active = mode === item.value;

								return (
									<button
										key={item.value}
										type='button'
										onClick={() => setMode(item.value)}
										className={cn(
											"flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
											active
												? "bg-lime-500 text-white shadow-[0_12px_24px_rgba(132,204,22,0.28)]"
												: "text-zinc-500 hover:text-zinc-700",
										)}>
										{item.label}
									</button>
								);
							})}
						</div>

						<motion.div
							layout
							transition={{ duration: 0.28, ease: "easeOut" }}
							className='overflow-hidden'>
							<AnimatePresence mode='wait' initial={false}>
								<motion.div
									key={mode}
									layout
									initial={{ opacity: 0, y: 12 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -12 }}
									transition={{ duration: 0.24, ease: "easeOut" }}
									className='space-y-5'>
									<div className='rounded-[22px] border border-zinc-200 bg-white p-4 sm:p-5'>
										<p className='text-sm font-semibold text-zinc-950'>
											{isLogin ? "Masuk lebih cepat" : "Mulai lebih cepat"}
										</p>
										<p className='mt-1 text-sm text-zinc-500'>
											{isLogin
												? "Pakai akun Google untuk langsung membuka workspace recovery Anda."
												: "Pakai akun Google untuk membuat akun baru dan lanjut ke setup workspace lebih cepat."}
										</p>

										<Button
											className='mt-4 h-12 w-full rounded-2xl px-5'
											type='button'
											disabled={!oauthEnabled || isSubmittingOAuth}
											onClick={submitGoogleAuth}>
											{isSubmittingOAuth ? (
												<LoaderCircle className='size-4 animate-spin' />
											) : null}
											<svg
												viewBox='0 0 24 24'
												aria-hidden='true'
												className='size-5 rounded-full bg-white p-0.5'>
												<path
													fill='#4285F4'
													d='M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.7h5.39a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.97-4.33 2.97-7.26Z'
												/>
												<path
													fill='#34A853'
													d='M12 22c2.7 0 4.96-.9 6.62-2.45l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.58-4.1H3.08v2.58A9.99 9.99 0 0 0 12 22Z'
												/>
												<path
													fill='#FBBC05'
													d='M6.42 13.9A5.97 5.97 0 0 1 6.1 12c0-.66.11-1.3.32-1.9V7.52H3.08A9.99 9.99 0 0 0 2 12c0 1.6.38 3.12 1.08 4.48l3.34-2.58Z'
												/>
												<path
													fill='#EA4335'
													d='M12 5.98c1.47 0 2.8.5 3.85 1.5l2.88-2.88C16.95 2.98 14.7 2 12 2A9.99 9.99 0 0 0 3.08 7.52L6.42 10.1c.78-2.35 2.98-4.12 5.58-4.12Z'
												/>
											</svg>
											{oauthLabel}
										</Button>

										{oauthMessage ? (
											<p className='mt-3 text-sm text-rose-500'>
												{oauthMessage}
											</p>
										) : null}
									</div>

									<form
										className='space-y-5'
										onSubmit={isLogin ? submitLogin : submitRegister}>
										<div className='grid gap-4'>
											<div className='space-y-2'>
												<label
													className='text-sm font-medium text-zinc-700'
													htmlFor={`portal-email-${mode}`}>
													Email
												</label>
												<input
													id={`portal-email-${mode}`}
													type='email'
													value={
														isLogin ? loginValues.email : registerValues.email
													}
													onChange={(event) => {
														if (isLogin) {
															updateLoginValue("email", event.target.value);
															return;
														}

														updateRegisterValue("email", event.target.value);
													}}
													placeholder='you@example.com'
													className='h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-lime-400'
												/>
												<FieldError
													message={
														isLogin ? loginErrors.email : registerErrors.email
													}
												/>
											</div>

											{isLogin ? (
												<PasswordField
													id='portal-password-login'
													label='Password'
													value={loginValues.password}
													placeholder='Enter your password'
													isVisible={showLoginPassword}
													onToggleVisibility={() =>
														setShowLoginPassword((current) => !current)
													}
													onChange={(value) =>
														updateLoginValue("password", value)
													}
													error={loginErrors.password}
												/>
											) : (
												<>
													<PasswordField
														id='portal-password-register'
														label='Password'
														value={registerValues.password}
														placeholder='Create a secure password'
														isVisible={showRegisterPassword}
														onToggleVisibility={() =>
															setShowRegisterPassword((current) => !current)
														}
														onChange={(value) =>
															updateRegisterValue("password", value)
														}
														error={registerErrors.password}
													/>

													<div className='space-y-2'>
														<label
															className='text-sm font-medium text-zinc-700'
															htmlFor='portal-name-register'>
															Workspace name
														</label>
														<input
															id='portal-name-register'
															type='text'
															value={registerValues.name}
															onChange={(event) =>
																updateRegisterValue("name", event.target.value)
															}
															placeholder='Digital Recovery Lab'
															className='h-12 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none transition focus:border-lime-400'
														/>
														<FieldError message={registerErrors.name} />
													</div>

													<PasswordField
														id='portal-confirm-password-register'
														label='Confirm password'
														value={registerValues.confirmPassword}
														placeholder='Confirm your password'
														isVisible={showRegisterConfirmPassword}
														onToggleVisibility={() =>
															setShowRegisterConfirmPassword(
																(current) => !current,
															)
														}
														onChange={(value) =>
															updateRegisterValue("confirmPassword", value)
														}
														error={registerErrors.confirmPassword}
													/>
												</>
											)}
										</div>

										<div className='rounded-[22px] bg-zinc-50 p-4 sm:p-5'>
											<p className='text-sm font-semibold text-zinc-950'>
												{isLogin
													? "What you can continue"
													: "What you can set up"}
											</p>
											<ul className='mt-3 grid gap-2 sm:grid-cols-2'>
												{benefits.map((item) => (
													<li
														key={item}
														className='flex gap-2 text-sm text-zinc-600'>
														<CheckCircle2 className='mt-0.5 size-4 shrink-0 text-lime-600' />
														<span>{item}</span>
													</li>
												))}
											</ul>
										</div>

										{activeMessage ? (
											<p className='text-sm text-rose-500'>{activeMessage}</p>
										) : null}

										<div className='space-y-3'>
											<Button
												type='submit'
												className='h-11 w-full rounded-2xl px-5'
												disabled={isSubmitting}>
												{isSubmitting ? (
													<LoaderCircle className='size-4 animate-spin' />
												) : null}
												{isLogin ? (
													<LogIn className='size-4' />
												) : (
													<UserPlus className='size-4' />
												)}
												{submitLabel}
											</Button>

											{isLogin ? (
												<button
													type='button'
													className='w-full text-center text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800'>
													Forgot password
												</button>
											) : null}
										</div>
									</form>
								</motion.div>
							</AnimatePresence>
						</motion.div>
					</SectionCard>
				</section>
			</main>
		</div>
	);
}
