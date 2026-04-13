import type { FormEvent } from "react";

export type PortalMode = "login" | "register";

export type PortalFormErrors = Partial<{
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}>;

export type PortalLoginValues = {
  email: string;
  password: string;
};

export type PortalRegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type PortalFeatureProps = {
  oauthEnabled: boolean;
};

export type PortalFeatureData = {
  brandEyebrow: string;
  title: string;
  subtitle: string;
  loginBenefits: string[];
  registerBenefits: string[];
  trustPoints: string[];
  oauthEnabled: boolean;
};

export type PortalHookResult = PortalFeatureData & {
  mode: PortalMode;
  isLogin: boolean;
  benefits: string[];
  loginValues: PortalLoginValues;
  registerValues: PortalRegisterValues;
  loginErrors: PortalFormErrors;
  registerErrors: PortalFormErrors;
  loginMessage: string | null;
  registerMessage: string | null;
  oauthMessage: string | null;
  isSubmittingLogin: boolean;
  isSubmittingRegister: boolean;
  isSubmittingOAuth: boolean;
  setMode: (mode: PortalMode) => void;
  updateLoginValue: (field: keyof PortalLoginValues, value: string) => void;
  updateRegisterValue: (field: keyof PortalRegisterValues, value: string) => void;
  submitLogin: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  submitRegister: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  submitGoogleAuth: () => Promise<void>;
};
