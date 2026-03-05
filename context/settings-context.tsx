"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeGlobalSettings, saveGlobalSettings } from "@/lib/firestore-sync";

interface SettingsContextType {
  registrationEnabled: boolean;
  isLoaded: boolean;
  setRegistrationEnabled: (val: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  registrationEnabled: true,
  isLoaded: false,
  setRegistrationEnabled: async () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [registrationEnabled, setRegistrationEnabledState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsub = subscribeGlobalSettings((data) => {
      setRegistrationEnabledState(data.registrationEnabled);
      setIsLoaded(true);
    });
    return () => unsub();
  }, []);

  const setRegistrationEnabled = async (val: boolean) => {
    setRegistrationEnabledState(val);
    await saveGlobalSettings({ registrationEnabled: val });
  };

  return (
    <SettingsContext.Provider value={{ registrationEnabled, isLoaded, setRegistrationEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
