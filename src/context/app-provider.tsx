'use client';

import type { ReactNode } from 'react';
import { ShipProvider } from './ship-provider';
import { InventoryProvider } from './inventory-provider';
import { PerformaProvider } from './performa-provider';
import { EngineLogProvider } from './engine-log-provider';
import { SettingsProvider } from './settings-provider';

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <ShipProvider>
        <InventoryProvider>
          <PerformaProvider>
            <EngineLogProvider>
              {children}
            </EngineLogProvider>
          </PerformaProvider>
        </InventoryProvider>
      </ShipProvider>
    </SettingsProvider>
  );
}
