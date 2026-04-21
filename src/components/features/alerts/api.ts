import axios from "axios";

import type { AlertPolicy, AlertRecord } from "./types";

export type AlertsResponse = {
  alerts: AlertRecord[];
};

export type AlertPoliciesResponse = {
  policies: Omit<AlertPolicy, "icon" | "accentClassName">[];
};

export async function getAlerts() {
  const response = await axios.get("/api/alerts");
  return response.data as AlertsResponse;
}

export async function createAlert(payload: {
  title: string;
  category: string;
  severity: "Critical" | "High" | "Medium";
  message: string;
  resolution: string;
  source?: "desktop-notification" | "manual-test";
  deliveryStatus?: "sent" | "pending" | "failed";
  timestamp?: string;
}) {
  const response = await axios.post("/api/alerts", payload);
  return response.data as {
    message: string;
    alert: AlertRecord;
  };
}

export async function getAlertPolicies() {
  const response = await axios.get("/api/alerts/policies");
  return response.data as AlertPoliciesResponse;
}

export async function reviewAlert(alertId: string, notes: string) {
  const response = await axios.post(`/api/alerts/${alertId}/review`, { notes });
  return response.data as {
    message: string;
    alert: Pick<AlertRecord, "id" | "reviewed" | "reviewNotes" | "reviewedAt" | "updatedAt">;
  };
}

export async function updateAlertPolicy(
  policyId: string,
  payload: {
    title: string;
    description: string;
    trigger: string;
    action: string;
  },
) {
  const response = await axios.patch(`/api/alerts/policies/${policyId}`, payload);
  return response.data as {
    message: string;
    policy: Omit<AlertPolicy, "icon" | "accentClassName">;
  };
}
