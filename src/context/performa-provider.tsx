'use client';

import React, { createContext, type ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { PerformaRecord, PerformaContextType } from '@/lib/types';
import { INITIAL_PERFORMA } from '@/lib/data';

export const PerformaContext = createContext<PerformaContextType | undefined>(undefined);

export function PerformaProvider({ children }: { children: ReactNode }) {
  const [performaRecords, setPerformaRecords] = useLocalStorage<PerformaRecord[]>('performaData', INITIAL_PERFORMA);

  const addPerformaRecord = useCallback((record: Omit<PerformaRecord, 'id'>) => {
    const newRecord = { ...record, id: `prf${Date.now()}` };
    setPerformaRecords(prev => [...prev, newRecord]);
  }, [setPerformaRecords]);

  const deletePerformaRecord = useCallback((id: string) => {
    setPerformaRecords(prev => prev.filter(record => record.id !== id));
  }, [setPerformaRecords]);

  const deleteAllPerformaRecords = useCallback(() => {
    setPerformaRecords([]);
  }, [setPerformaRecords]);

  const value = {
    performaRecords,
    addPerformaRecord,
    deletePerformaRecord,
    deleteAllPerformaRecords,
    setPerformaRecords,
  };

  return <PerformaContext.Provider value={value}>{children}</PerformaContext.Provider>;
}
