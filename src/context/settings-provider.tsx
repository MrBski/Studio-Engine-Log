'use client';

import React, { createContext, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AppSettings, SettingsContextType } from '@/lib/types';

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: AppSettings = {
  dailyTankMultiplier: 21,
  engineerName: 'Mr. Basuki',
  engineerPosition: '3/E',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>('appSettings', defaultSettings);

  const value = {
    settings,
    setSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
