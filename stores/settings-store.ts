import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  registrationEnabled: boolean;
  setRegistrationEnabled: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      registrationEnabled: true,
      setRegistrationEnabled: (val) => set({ registrationEnabled: val }),
    }),
    { name: "quran-settings" }
  )
);
