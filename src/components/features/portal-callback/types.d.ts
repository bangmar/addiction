export type PortalCallbackStatus = "checking" | "success" | "error";

export type PortalCallbackData = {
  eyebrow: string;
  title: string;
  description: string;
  status: PortalCallbackStatus;
  callbackUrl: string;
  errorMessage: string | null;
};
