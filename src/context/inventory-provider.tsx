'use client';

import React, { createContext, type ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { InventoryItem, InventoryContextType } from '@/lib/types';
import { INITIAL_INVENTORY } from '@/lib/data';

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('inventory', INITIAL_INVENTORY);

  const addInventoryItem = useCallback((item: Omit<InventoryItem, 'id' | 'timestamp'>) => {
    const newItem: InventoryItem = { ...item, id: `inv${Date.now()}`, timestamp: new Date().toISOString() };
    setInventory(prev => [...prev, newItem]);
  }, [setInventory]);

  const updateInventoryItem = useCallback((updatedItem: InventoryItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? {...updatedItem, timestamp: new Date().toISOString()} : item));
  }, [setInventory]);

  const deleteInventoryItem = useCallback((id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  }, [setInventory]);

  const value = {
    inventory,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    setInventory
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}
