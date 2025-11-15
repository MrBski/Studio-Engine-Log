'use client';

import type { ReactNode } from 'react';
import { ShipProvider } from './ship-provider';
import { InventoryProvider } from './inventory-provider';
import { PerformaProvider } from './performa-provider';
import { EngineLogProvider } from './engine-log-provider';
import { AnalysisProvider } from './analysis-provider';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <ShipProvider>
      <InventoryProvider>
        <PerformaProvider>
          <EngineLogProvider>
            <AnalysisProvider>
                {children}
            </AnalysisProvider>
          </EngineLogProvider>
        </PerformaProvider>
      </InventoryProvider>
    </ShipProvider>
  );
}
