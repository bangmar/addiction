import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { BellRing, MonitorSmartphone, ShieldAlert } from "lucide-react";
import axios from "axios";

import { getAlerts, getAlertPolicies, reviewAlert, updateAlertPolicy } from "./api";
import type { AlertPoliciesResponse, AlertsResponse } from "./api";
import type {
  AlertChannel,
  AlertIncident,
  AlertOverviewStat,
  AlertPolicy,
  AlertRecord,
  AlertsData,
} from "./types";

function getSeverityClassName(severity: AlertRecord["severity"]) {
  switch (severity) {
    case "Critical":
      return "bg-rose-500/10 text-rose-700";
    case "High":
      return "bg-amber-500/10 text-amber-700";
    default:
      return "bg-violet-500/10 text-violet-700";
  }
}

function getSourceMeta(source: AlertRecord["source"]) {
  if (source === "manual-test") {
    return {
      label: "Manual test",
      className: "bg-sky-500/10 text-sky-700",
    };
  }

  return {
    label: "Desktop notification",
    className: "bg-emerald-500/10 text-emerald-700",
  };
}

function getPolicyVisuals(policyId: string) {
  switch (policyId) {
    case "budget-reached-notification":
      return {
        icon: BellRing,
        accentClassName: "bg-lime-500/10 text-lime-700",
      };
    case "abstinence-violation":
      return {
        icon: ShieldAlert,
        accentClassName: "bg-rose-500/10 text-rose-700",
      };
    default:
      return {
        icon: MonitorSmartphone,
        accentClassName: "bg-sky-500/10 text-sky-700",
      };
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export default function useAlerts(): AlertsData {
  const queryClient = useQueryClient();
  const { status } = useSession();
  const [selectedIncident, setSelectedIncident] = useState<AlertIncident | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<AlertPolicy | null>(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const alertsQuery = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
    enabled: status === "authenticated",
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const policiesQuery = useQuery({
    queryKey: ["alert-policies"],
    queryFn: getAlertPolicies,
    enabled: status === "authenticated",
    refetchOnWindowFocus: true,
    retry: 2,
  });

  const reviewAlertMutation = useMutation({
    mutationFn: ({ alertId, notes }: { alertId: string; notes: string }) => reviewAlert(alertId, notes),
    onSuccess: async (response, variables) => {
      queryClient.setQueryData<AlertsResponse | undefined>(["alerts"], (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          alerts: current.alerts.map((record) =>
            record.id === variables.alertId
              ? {
                  ...record,
                  reviewed: response.alert.reviewed,
                  reviewNotes: response.alert.reviewNotes,
                  reviewedAt: response.alert.reviewedAt,
                  updatedAt: response.alert.updatedAt,
                }
              : record,
          ),
        };
      });
      setNotice({ type: "success", message: response.message });
      setReviewError(null);
      setIsReviewModalOpen(false);
      setSelectedIncident(null);
      await queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: (error) => {
      setReviewError(getErrorMessage(error, "Failed to review alert."));
    },
  });

  const updatePolicyMutation = useMutation({
    mutationFn: ({
      policyId,
      values,
    }: {
      policyId: string;
      values: { title: string; description: string; trigger: string; action: string };
    }) => updateAlertPolicy(policyId, values),
    onSuccess: async (response, variables) => {
      queryClient.setQueryData<AlertPoliciesResponse | undefined>(["alert-policies"], (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          policies: current.policies.map((policy) =>
            policy.id === variables.policyId
              ? {
                  ...policy,
                  title: response.policy.title,
                  description: response.policy.description,
                  trigger: response.policy.trigger,
                  action: response.policy.action,
                }
              : policy,
          ),
        };
      });
      setNotice({ type: "success", message: response.message });
      setPolicyError(null);
      setIsPolicyModalOpen(false);
      setSelectedPolicy(null);
      await queryClient.invalidateQueries({ queryKey: ["alert-policies"] });
    },
    onError: (error) => {
      setPolicyError(getErrorMessage(error, "Failed to update alert policy."));
    },
  });

  const records = useMemo(
    () => (status === "authenticated" ? alertsQuery.data?.alerts ?? [] : []),
    [status, alertsQuery.data?.alerts],
  );

  const policies = useMemo<AlertPolicy[]>(() => {
    if (status !== "authenticated") {
      return [];
    }

    return (policiesQuery.data?.policies ?? []).map((policy) => ({
      ...policy,
      ...getPolicyVisuals(policy.id),
    }));
  }, [status, policiesQuery.data?.policies]);

  const incidents: AlertIncident[] = useMemo(
    () =>
      records.map((record) => {
        const sourceMeta = getSourceMeta(record.source);

        return {
          ...record,
          severityClassName: getSeverityClassName(record.severity),
          sourceLabel: sourceMeta.label,
          sourceClassName: sourceMeta.className,
        };
      }),
    [records],
  );

  const overviewStats: AlertOverviewStat[] = useMemo(() => {
    const todayDate = new Date().toDateString();
    const alertsToday = records.filter((record) => new Date(record.createdAt).toDateString() === todayDate).length;
    const critical = records.filter((record) => record.severity === "Critical").length;
    const sent = records.filter((record) => record.deliveryStatus === "sent").length;

    return [
      { label: "Alerts today", value: String(alertsToday).padStart(2, "0"), detail: "Alert records created today" },
      { label: "Critical", value: String(critical).padStart(2, "0"), detail: "Zero-tolerance incidents requiring attention" },
      { label: "Notifications sent", value: String(sent).padStart(2, "0"), detail: "Desktop delivery recorded to the alert service" },
    ];
  }, [records]);

  const channels: AlertChannel[] = [
    {
      title: "Desktop toast notification",
      description: "Primary channel untuk budget habis dan abstinence violation.",
      status: records.some((record) => record.deliveryStatus === "sent") ? "Active" : "Waiting",
      statusClassName: records.some((record) => record.deliveryStatus === "sent")
        ? "bg-emerald-500/10 text-emerald-700"
        : "bg-zinc-200 text-zinc-700",
    },
    {
      title: "Dashboard incident timeline",
      description: "Semua incident dicatat untuk review dan reporting.",
      status: records.length > 0 ? "Synced" : "Empty",
      statusClassName: records.length > 0 ? "bg-emerald-500/10 text-emerald-700" : "bg-zinc-200 text-zinc-700",
    },
    {
      title: "Review workflow",
      description: "Incident review tersimpan sebagai decision log di dashboard.",
      status: incidents.some((incident) => !incident.reviewed) ? "Needs review" : "Stable",
      statusClassName: incidents.some((incident) => !incident.reviewed)
        ? "bg-amber-500/10 text-amber-700"
        : "bg-emerald-500/10 text-emerald-700",
    },
  ];

  function openReviewModal(incident: AlertIncident) {
    setReviewError(null);
    setSelectedIncident(incident);
    setIsReviewModalOpen(true);
  }

  function closeReviewModal() {
    setReviewError(null);
    setIsReviewModalOpen(false);
    setSelectedIncident(null);
  }

  async function submitReview(notes: string) {
    if (!selectedIncident) {
      return;
    }

    const trimmedNotes = notes.trim();
    if (!trimmedNotes) {
      setReviewError("Review notes are required.");
      return;
    }

    setNotice(null);
    setReviewError(null);
    await reviewAlertMutation.mutateAsync({
      alertId: selectedIncident.id,
      notes: trimmedNotes,
    });
  }

  function openPolicyModal() {
    setPolicyError(null);
    setSelectedPolicy(policies[0] ?? null);
    setIsPolicyModalOpen(true);
  }

  function closePolicyModal() {
    setPolicyError(null);
    setIsPolicyModalOpen(false);
    setSelectedPolicy(null);
  }

  async function submitPolicy(values: {
    title: string;
    description: string;
    trigger: string;
    action: string;
  }) {
    if (!selectedPolicy) {
      return;
    }

    const nextValues = {
      title: values.title.trim(),
      description: values.description.trim(),
      trigger: values.trigger.trim(),
      action: values.action.trim(),
    };

    if (!nextValues.title || !nextValues.description || !nextValues.trigger || !nextValues.action) {
      setPolicyError("All policy fields are required.");
      return;
    }

    setNotice(null);
    setPolicyError(null);
    await updatePolicyMutation.mutateAsync({
      policyId: selectedPolicy.id,
      values: nextValues,
    });
  }

  const queryErrorMessage = alertsQuery.error
    ? getErrorMessage(alertsQuery.error, "Failed to load alerts.")
    : policiesQuery.error
      ? getErrorMessage(policiesQuery.error, "Failed to load alert policies.")
      : null;

  return {
    searchPlaceholder: "Search incidents, triggers, notification rules...",
    overviewStats,
    incidents,
    policies,
    channels,
    syncStatus:
      status !== "authenticated"
        ? "Sign in to review desktop alerts from your workspace"
        : records.length > 0
          ? `Alert pipeline healthy · ${records[0]?.title ?? "Latest alert"} stored in dashboard`
          : "Alert pipeline waiting for the first desktop notification.",
    isLoading: status === "loading" || alertsQuery.isLoading || policiesQuery.isLoading,
    selectedIncident,
    isReviewModalOpen,
    isSubmittingReview: reviewAlertMutation.isPending,
    reviewError,
    selectedPolicy,
    isPolicyModalOpen,
    isSubmittingPolicy: updatePolicyMutation.isPending,
    policyError,
    notice: notice ?? (queryErrorMessage ? { type: "error", message: queryErrorMessage } : null),
    openReviewModal,
    closeReviewModal,
    submitReview,
    openPolicyModal,
    closePolicyModal,
    submitPolicy,
  };
}
