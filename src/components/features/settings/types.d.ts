export type LanguageOption = {
  label: string;
  value: "id" | "en";
};

export type PasswordRequirement = {
  label: string;
};

export type LoginDeviceFilter = "All devices" | "Web dashboard" | "Desktop app" | "Mobile app";

export type LoginLogItem = {
  title: string;
  timestamp: string;
  device: LoginDeviceFilter;
  location: string;
  accentClassName: string;
};

export type SettingsInsight = {
  title: string;
  description: string;
};

export type SettingsNotice = {
  type: "success" | "error";
  message: string;
};

export type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type SettingsData = {
  searchPlaceholder: string;
  languageOptions: LanguageOption[];
  selectedLanguage: "id" | "en";
  setSelectedLanguage: (value: "id" | "en") => void;
  passwordRequirements: PasswordRequirement[];
  loginDeviceFilters: LoginDeviceFilter[];
  selectedLoginDeviceFilter: LoginDeviceFilter;
  setSelectedLoginDeviceFilter: (value: LoginDeviceFilter) => void;
  filteredLoginLogs: LoginLogItem[];
  insights: SettingsInsight[];
  profileCompletion: number;
  profileUpdatedAt: string;
  profileName: string;
  setProfileName: (value: string) => void;
  profileEmail: string;
  profileInitials: string;
  profileRoleLabel: string;
  isLoading: boolean;
  isProfileSaving: boolean;
  isPasswordSaving: boolean;
  profileNotice: SettingsNotice | null;
  passwordNotice: SettingsNotice | null;
  passwordForm: PasswordFormValues;
  handlePasswordFieldChange: (field: keyof PasswordFormValues, value: string) => void;
  handleSaveProfile: () => Promise<void>;
  handleResetProfile: () => void;
  handleResetPassword: () => Promise<void>;
};
