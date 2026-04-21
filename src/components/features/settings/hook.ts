import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import {
  getSettingsProfile,
  updateSettingsPassword,
  updateSettingsProfile,
  type SettingsApiError,
} from "./api";
import type {
  LoginDeviceFilter,
  PasswordFormValues,
  SettingsData,
  SettingsInsight,
  SettingsNotice,
} from "./types";

const languageOptions = [
  { label: "Bahasa Indonesia", value: "id" },
  { label: "English", value: "en" },
] as const;

const passwordRequirements = [
  { label: "Minimal 8 karakter" },
  { label: "Gabungan huruf besar dan kecil" },
  { label: "Minimal satu angka" },
] as const;

const loginDeviceFilters: LoginDeviceFilter[] = [
  "All devices",
  "Web dashboard",
  "Desktop app",
  "Mobile app",
];

const insights: SettingsInsight[] = [
  {
    title: "Profile guidance",
    description:
      "Perbarui nama profile dan bahasa aplikasi agar pengalaman workspace lebih personal tanpa mengubah foto profile dulu.",
  },
  {
    title: "Security note",
    description:
      "Reset password dipisah dari profile utama agar perubahan account settings tetap jelas dan aman.",
  },
  {
    title: "Login review",
    description:
      "Login log diambil dari service settings agar halaman ini siap dihubungkan ke riwayat akses yang lebih detail nanti.",
  },
];

const defaultPasswordForm: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "TC";
  const parts = source.split(/\s+/).filter(Boolean).slice(0, 2);

  if (parts.length === 0) {
    return "TC";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function formatUpdatedAt(value?: string | null) {
  if (!value) {
    return "Belum ada perubahan profile.";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Belum ada perubahan profile.";
  }

  return `Last updated ${new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)}`;
}

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as { response?: { data?: SettingsApiError } };
  return axiosError.response?.data?.message ?? fallback;
}

export default function useSettings(): SettingsData {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [draftProfileName, setDraftProfileName] = useState("");
  const [draftSelectedLanguage, setDraftSelectedLanguage] = useState<"id" | "en">("id");
  const [isProfileDirty, setIsProfileDirty] = useState(false);
  const [selectedLoginDeviceFilter, setSelectedLoginDeviceFilter] =
    useState<LoginDeviceFilter>("All devices");
  const [passwordForm, setPasswordForm] = useState<PasswordFormValues>(defaultPasswordForm);
  const [profileNotice, setProfileNotice] = useState<SettingsNotice | null>(null);
  const [passwordNotice, setPasswordNotice] = useState<SettingsNotice | null>(null);

  const settingsQuery = useQuery({
    queryKey: ["settings-profile"],
    queryFn: getSettingsProfile,
  });

  const saveProfileMutation = useMutation({
    mutationFn: updateSettingsProfile,
    onSuccess: async (result) => {
      setProfileNotice({ type: "success", message: result.message });
      await queryClient.invalidateQueries({ queryKey: ["settings-profile"] });
    },
    onError: (error) => {
      setProfileNotice({
        type: "error",
        message: getErrorMessage(error, "Failed to update profile settings."),
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: updateSettingsPassword,
    onSuccess: (result) => {
      setPasswordNotice({ type: "success", message: result.message });
      setPasswordForm(defaultPasswordForm);
    },
    onError: (error) => {
      setPasswordNotice({
        type: "error",
        message: getErrorMessage(error, "Failed to update password."),
      });
    },
  });

  const baseProfileName = settingsQuery.data?.profile.name ?? session?.user?.name ?? "";
  const baseSelectedLanguage =
    settingsQuery.data?.profile.preferredLanguage === "en" ? "en" : "id";
  const currentEmail = settingsQuery.data?.profile.email ?? session?.user?.email ?? "";
  const currentName = isProfileDirty ? draftProfileName : baseProfileName;
  const selectedLanguage = isProfileDirty ? draftSelectedLanguage : baseSelectedLanguage;

  const profileCompletion = useMemo(() => {
    let completed = 0;
    if (currentName.trim()) {
      completed += 1;
    }
    if (currentEmail.trim()) {
      completed += 1;
    }
    if (selectedLanguage) {
      completed += 1;
    }

    return completed / 3;
  }, [currentEmail, currentName, selectedLanguage]);

  const filteredLoginLogs = useMemo(() => {
    const logs = settingsQuery.data?.loginLogs ?? [];
    if (selectedLoginDeviceFilter === "All devices") {
      return logs;
    }

    return logs.filter((log) => log.device === selectedLoginDeviceFilter);
  }, [selectedLoginDeviceFilter, settingsQuery.data?.loginLogs]);

  function setProfileName(value: string) {
    setProfileNotice(null);
    setIsProfileDirty(true);
    setDraftProfileName(value);
  }

  function setSelectedLanguage(value: "id" | "en") {
    setProfileNotice(null);
    setIsProfileDirty(true);
    setDraftSelectedLanguage(value);
  }

  async function handleSaveProfile() {
    setProfileNotice(null);
    await saveProfileMutation.mutateAsync({
      name: currentName.trim(),
      preferredLanguage: selectedLanguage,
    });
    setIsProfileDirty(false);
    setDraftProfileName("");
    setDraftSelectedLanguage(baseSelectedLanguage);
  }

  function handleResetProfile() {
    setProfileNotice(null);
    setIsProfileDirty(false);
    setDraftProfileName("");
    setDraftSelectedLanguage(baseSelectedLanguage);
  }

  function handlePasswordFieldChange(field: keyof PasswordFormValues, value: string) {
    setPasswordNotice(null);
    setPasswordForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleResetPassword() {
    setPasswordNotice(null);
    await resetPasswordMutation.mutateAsync(passwordForm);
  }

  return {
    searchPlaceholder: "Search profile settings, sessions, login history...",
    languageOptions: [...languageOptions],
    selectedLanguage,
    setSelectedLanguage,
    passwordRequirements: [...passwordRequirements],
    loginDeviceFilters,
    selectedLoginDeviceFilter,
    setSelectedLoginDeviceFilter,
    filteredLoginLogs,
    insights,
    profileCompletion,
    profileUpdatedAt: formatUpdatedAt(settingsQuery.data?.profile.updatedAt),
    profileName: currentName,
    setProfileName,
    profileEmail: currentEmail,
    profileInitials: getInitials(currentName, currentEmail),
    profileRoleLabel: "Recovery workspace owner",
    isLoading: settingsQuery.isLoading,
    isProfileSaving: saveProfileMutation.isPending,
    isPasswordSaving: resetPasswordMutation.isPending,
    profileNotice,
    passwordNotice,
    passwordForm,
    handlePasswordFieldChange,
    handleSaveProfile,
    handleResetProfile,
    handleResetPassword,
  };
}
