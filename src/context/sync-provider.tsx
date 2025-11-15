'use client';

import React, { createContext, type ReactNode, useState, useEffect, useCallback } from 'react';
import { useInventory } from '@/hooks/use-app';
import { usePerforma } from '@/hooks/use-app';
import { syncWithServer } from '@/lib/services/syncService';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncContextType {
  isOnline: boolean;
  syncStatus: SyncStatus;
}

export const SyncContext = createContext<SyncContextType | undefined>(undefined);

const SYNC_INTERVAL = 30000; // 30 seconds

export function SyncProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const { inventory } = useInventory();
  const { performaRecords } = usePerforma();

  useEffect(() => {
    // Initial online status check
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
    }
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = useCallback(async () => {
    if (!isOnline) {
      setSyncStatus('idle');
      return;
    }
    if (syncStatus === 'syncing') return;

    setSyncStatus('syncing');
    try {
      await syncWithServer({ inventory, performaRecords });
      setSyncStatus('success');
    } catch (error) {
      console.error("Auto-sync failed:", error);
      setSyncStatus('error');
    }
  }, [isOnline, inventory, performaRecords, syncStatus]);

  useEffect(() => {
    // Trigger sync immediately if we come online and data has changed.
    if (isOnline && syncStatus !== 'syncing') {
      handleSync();
    }
  }, [isOnline, handleSync, syncStatus]);

  useEffect(() => {
    const intervalId = setInterval(handleSync, SYNC_INTERVAL);
    return () => clearInterval(intervalId);
  }, [handleSync]);

  const value = {
    isOnline,
    syncStatus,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
