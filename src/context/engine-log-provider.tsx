'use client';

import React, { createContext, type ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { EngineLogRecord, EngineLogSection, EngineLogContextType } from '@/lib/types';

export const EngineLogContext = createContext<EngineLogContextType | undefined>(undefined);

export function EngineLogProvider({ children }: { children: ReactNode }) {
  const [engineLogs, setEngineLogs] = useLocalStorage<EngineLogRecord[]>('engineLogs', []);

  const addEngineLog = useCallback((sections: EngineLogSection[]) => {
    const newLog: EngineLogRecord = {
      id: `eng${Date.now()}`,
      timestamp: new Date().toISOString(),
      sections,
    };
    setEngineLogs(prev => [newLog, ...prev]);
  }, [setEngineLogs]);

  const value = {
    engineLogs,
    addEngineLog,
  };

  return <EngineLogContext.Provider value={value}>{children}</EngineLogContext.Provider>;
}
