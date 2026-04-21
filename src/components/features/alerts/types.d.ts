import type { LucideIcon } from "lucide-react";

export type AlertOverviewStat = {
  label: string;
  value: string;
  detail: string;
};

export type AlertRecord = {
  id: string;
  title: string;
  category: string;
  timestamp: string;
  severity: "Critical" | "High" | "Medium";
  message: string;
  resolution: string;
  source: "desktop-notification" | "manual-test";
  deliveryStatus: "sent" | "pending" | "failed";
  reviewed: boolean;
  reviewNotes: string | null;
  reviewedAt: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type AlertIncident = AlertRecord & {
  severityClassName: string;
  sourceLabel: string;
  sourceClassName: string;
};

export type AlertPolicy = {
  id: string;
  title: string;
  description: string;
  trigger: string;
  action: string;
  icon: LucideIcon;
  accentClassName: string;
};

export type AlertChannel = {
  title: string;
  description: string;
  status: string;
  statusClassName: string;
};

export type AlertsData = {
  searchPlaceholder: string;
  overviewStats: AlertOverviewStat[];
  incidents: AlertIncident[];
  policies: AlertPolicy[];
  channels: AlertChannel[];
  syncStatus: string;
  isLoading: boolean;
  selectedIncident: AlertIncident | null;
  isReviewModalOpen: boolean;
  isSubmittingReview: boolean;
  reviewError: string | null;
  selectedPolicy: AlertPolicy | null;
  isPolicyModalOpen: boolean;
  isSubmittingPolicy: boolean;
  policyError: string | null;
  notice: { type: "success" | "error"; message: string } | null;
  openReviewModal: (incident: AlertIncident) => void;
  closeReviewModal: () => void;
  submitReview: (notes: string) => Promise<void>;
  openPolicyModal: () => void;
  closePolicyModal: () => void;
  submitPolicy: (values: { title: string; description: string; trigger: string; action: string }) => Promise<void>;
};
