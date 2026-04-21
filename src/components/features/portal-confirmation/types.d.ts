export type PortalConfirmationFeatureProps = {
  requestId: string;
  code: string;
};

export type PortalConfirmationStatus = "loading" | "ready" | "processing" | "approved" | "rejected" | "expired" | "error";
