import axios from "axios";
import type { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  loginSchema,
  registerFormSchema,
  type LoginInput,
  type RegisterFormInput,
} from "@/lib/auth-schema";

import { registerWithCredentials, type AuthApiError } from "./api";
import type {
  PortalFeatureData,
  PortalFeatureProps,
  PortalFormErrors,
  PortalHookResult,
  PortalLoginValues,
  PortalMode,
  PortalRegisterValues,
} from "./types";

const initialLoginValues: PortalLoginValues = {
  email: "",
  password: "",
};

const initialRegisterValues: PortalRegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function flattenErrors(errors?: Record<string, string[] | undefined>): PortalFormErrors {
  if (!errors) {
    return {};
  }

  return Object.entries(errors).reduce<PortalFormErrors>((accumulator, [key, value]) => {
    if (value?.[0] && key in initialRegisterValues) {
      accumulator[key as keyof PortalFormErrors] = value[0];
    }

    return accumulator;
  }, {});
}

function mapLoginErrors(values: LoginInput) {
  const result = loginSchema.safeParse(values);

  if (result.success) {
    return null;
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  return {
    email: fieldErrors.email?.[0],
    password: fieldErrors.password?.[0],
  } satisfies PortalFormErrors;
}

function mapRegisterErrors(values: RegisterFormInput) {
  const result = registerFormSchema.safeParse(values);

  if (result.success) {
    return null;
  }

  const fieldErrors = result.error.flatten().fieldErrors;

  return {
    name: fieldErrors.name?.[0],
    email: fieldErrors.email?.[0],
    password: fieldErrors.password?.[0],
    confirmPassword: fieldErrors.confirmPassword?.[0],
  } satisfies PortalFormErrors;
}

export default function usePortal({ oauthEnabled }: PortalFeatureProps): PortalHookResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<PortalMode>("login");
  const [loginValues, setLoginValues] = useState<PortalLoginValues>(initialLoginValues);
  const [registerValues, setRegisterValues] = useState<PortalRegisterValues>(initialRegisterValues);
  const [loginErrors, setLoginErrors] = useState<PortalFormErrors>({});
  const [registerErrors, setRegisterErrors] = useState<PortalFormErrors>({});
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [isSubmittingOAuth, setIsSubmittingOAuth] = useState(false);

  const content: PortalFeatureData = {
    brandEyebrow: "USER PORTAL",
    title: "Access your recovery workspace",
    subtitle:
      "Masuk atau buat akun baru untuk mengelola habits, alerts, dan download desktop tracker dari satu portal yang sama.",
    loginBenefits: [
      "Lanjutkan ke dashboard habit tracker Anda",
      "Sinkronkan konfigurasi dengan desktop agent",
      "Lihat alert dan report recovery terbaru",
    ],
    registerBenefits: [
      "Buat workspace recovery baru dalam beberapa langkah",
      "Siapkan habit intervention untuk domain dan executable",
      "Aktifkan alur download desktop app dan export report",
    ],
    trustPoints: [
      "Credentials login dengan validasi client dan server",
      "Google OAuth siap dipakai dari halaman portal yang sama",
      "Session redirect sudah sinkron dengan protected routes",
    ],
    oauthEnabled,
  };

  const isLogin = mode === "login";
  const benefits = isLogin ? content.loginBenefits : content.registerBenefits;

  const callbackUrl = useMemo(() => searchParams.get("callbackUrl") ?? "/", [searchParams]);

  const oauthMessage = useMemo(() => {
    const error = searchParams.get("error");

    if (!error) {
      return null;
    }

    if (error === "OAuthAccountNotLinked") {
      return "Email ini sudah terdaftar dengan metode login lain. Gunakan password atau akun Google yang sama seperti sebelumnya.";
    }

    if (error === "AccessDenied") {
      return "Login OAuth dibatalkan atau ditolak.";
    }

    return "Autentikasi OAuth gagal. Coba lagi beberapa saat lagi.";
  }, [searchParams]);

  function updateLoginValue(field: keyof PortalLoginValues, value: string) {
    setLoginValues((current) => ({ ...current, [field]: value }));
    setLoginErrors((current) => ({ ...current, [field]: undefined }));
    setLoginMessage(null);
  }

  function updateRegisterValue(field: keyof PortalRegisterValues, value: string) {
    setRegisterValues((current) => ({ ...current, [field]: value }));
    setRegisterErrors((current) => ({ ...current, [field]: undefined }));
    setRegisterMessage(null);
  }

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginMessage(null);

    const validationErrors = mapLoginErrors(loginValues);
    if (validationErrors) {
      setLoginErrors(validationErrors);
      return;
    }

    setIsSubmittingLogin(true);
    setLoginErrors({});

    try {
      const result = await signIn("credentials", {
        email: loginValues.email,
        password: loginValues.password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setLoginMessage("Email atau password tidak valid.");
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    } finally {
      setIsSubmittingLogin(false);
    }
  }

  async function submitRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegisterMessage(null);

    const validationErrors = mapRegisterErrors(registerValues);
    if (validationErrors) {
      setRegisterErrors(validationErrors);
      return;
    }

    setIsSubmittingRegister(true);
    setRegisterErrors({});

    try {
      await registerWithCredentials({
        name: registerValues.name,
        email: registerValues.email,
        password: registerValues.password,
      });

      const result = await signIn("credentials", {
        email: registerValues.email,
        password: registerValues.password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setRegisterMessage("Akun berhasil dibuat, tetapi login otomatis gagal. Silakan login manual.");
        setMode("login");
        setLoginValues({
          email: registerValues.email,
          password: "",
        });
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseError = (error as AxiosError<AuthApiError>).response?.data;
        setRegisterErrors(flattenErrors(responseError?.errors));
        setRegisterMessage(responseError?.message ?? "Registrasi gagal. Coba lagi.");
        return;
      }

      setRegisterMessage("Registrasi gagal. Coba lagi.");
    } finally {
      setIsSubmittingRegister(false);
    }
  }

  async function submitGoogleAuth() {
    if (!content.oauthEnabled) {
      return;
    }

    setIsSubmittingOAuth(true);

    try {
      await signIn("google", { callbackUrl });
    } finally {
      setIsSubmittingOAuth(false);
    }
  }

  return {
    ...content,
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
  };
}
