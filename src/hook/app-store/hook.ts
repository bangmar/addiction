import { create } from "zustand";

type AppStore = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  toggleSidebar: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  isSidebarOpen: false,
  setIsSidebarOpen: (value) => set({ isSidebarOpen: value }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
