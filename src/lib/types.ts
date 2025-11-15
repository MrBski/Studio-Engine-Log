export type InventoryCategory = "ME" | "AE" | "Others";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  location: string;
  category: InventoryCategory;
  timestamp: string;
}

export interface PerformaRecord {
  id: string;
  nama: string;
  tanggal: string;
  keterangan: string; // Will store the full JSON log
  jumlah: number;
}

export interface EngineLogSection {
  timestamp: string;
  parameters: Record<string, number>;
}

export interface EngineLogRecord {
  id: string;
  timestamp: string;
  sections: EngineLogSection[];
}

export interface LastRecord {
    id: string;
    type: 'Inventory' | 'Performa' | 'EngineLog' | 'Engine Log' | 'Restock' | 'Used' | 'Amprahan';
    summary: string;
    timestamp: string;
    category?: InventoryCategory;
    data?: any;
}

export interface AppSettings {
  dailyTankMultiplier: number;
}

// Context types
export type ShipContextType = {
  shipName: string;
  setShipName: (name: string) => void;
};

export type InventoryContextType = {
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'timestamp'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  setInventory: (items: InventoryItem[]) => void;
  adjustStock: (id: string, quantity: number) => void;
};

export type PerformaContextType = {
  performaRecords: PerformaRecord[];
  addPerformaRecord: (record: Omit<PerformaRecord, 'id'>) => void;
  deletePerformaRecord: (id: string) => void;
  deleteAllPerformaRecords: () => void;
  setPerformaRecords: (records: PerformaRecord[]) => void;
};

export type EngineLogContextType = {
  engineLogs: EngineLogRecord[];
  addEngineLog: (sections: EngineLogSection[]) => void;
};

export type SettingsContextType = {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
};
