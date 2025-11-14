'use client';

import React, { createContext, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { ShipContextType } from '@/lib/types';

export const ShipContext = createContext<ShipContextType | undefined>(undefined);

export function ShipProvider({ children }: { children: ReactNode }) {
  const [shipName, setShipName] = useLocalStorage<string>('shipName', 'bisa di Edit');

  const value = {
    shipName,
    setShipName,
  };

  return <ShipContext.Provider value={value}>{children}</ShipContext.Provider>;
}
