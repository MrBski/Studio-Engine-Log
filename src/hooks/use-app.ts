'use client';

import { useContext } from 'react';
import { ShipContext, type ShipContextType } from '@/context/ship-provider';
import { InventoryContext, type InventoryContextType } from '@/context/inventory-provider';
import { PerformaContext, type PerformaContextType } from '@/context/performa-provider';
import { EngineLogContext, type EngineLogContextType } from '@/context/engine-log-provider';

export const useShip = (): ShipContextType => {
  const context = useContext(ShipContext);
  if (!context) {
    throw new Error('useShip must be used within a ShipProvider');
  }
  return context;
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const usePerforma = (): PerformaContextType => {
    const context = useContext(PerformaContext);
    if (!context) {
        throw new Error('usePerforma must be used within a PerformaProvider');
    }
    return context;
}

export const useEngineLog = (): EngineLogContextType => {
    const context = useContext(EngineLogContext);
    if (!context) {
        throw new Error('useEngineLog must be used within an EngineLogProvider');
    }
    return context;
}
