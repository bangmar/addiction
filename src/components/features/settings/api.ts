import axios from "axios";

export type SettingsApiError = {
  message: string;
  errors?: Record<string, string[] | undefined>;
};

export type SettingsProfileResponse = {
  profile: {
    name: string;
    email: string;
    preferredLanguage: string;
    updatedAt: string | null;
    authProviders: string[];
  };
  loginLogs: Array<{
    title: string;
    timestamp: string;
    device: "All devices" | "Web dashboard" | "Desktop app" | "Mobile app";
    location: string;
    accentClassName: string;
  }>;
};

export type UpdateSettingsProfilePayload = {
  name: string;
  preferredLanguage: string;
};

export type UpdateSettingsPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export async function getSettingsProfile() {
  const response = await axios.get("/api/settings");
  return response.data as SettingsProfileResponse;
}

export async function updateSettingsProfile(payload: UpdateSettingsProfilePayload) {
  const response = await axios.put("/api/settings", payload);
  return response.data as {
    message: string;
    profile: {
      name: string;
      email: string;
      preferredLanguage: string;
      updatedAt: string;
    };
  };
}

export async function updateSettingsPassword(payload: UpdateSettingsPasswordPayload) {
  const response = await axios.post("/api/settings/password", payload);
  return response.data as { message: string };
}
