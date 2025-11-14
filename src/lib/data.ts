import type { InventoryItem, PerformaRecord } from '@/lib/types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv1628123456789',
    name: 'Piston Ring Set',
    quantity: 12,
    unit: 'sets',
    location: 'Engine Store - A1',
    category: 'ME',
    timestamp: new Date('2023-10-26T10:00:00Z').toISOString(),
  },
  {
    id: 'inv1628123456790',
    name: 'Fuel Injector',
    quantity: 8,
    unit: 'pieces',
    location: 'Engine Store - B2',
    category: 'ME',
    timestamp: new Date('2023-10-26T10:05:00Z').toISOString(),
  },
  {
    id: 'inv1628123456791',
    name: 'Generator Air Filter',
    quantity: 4,
    unit: 'pieces',
    location: 'Generator Room',
    category: 'AE',
    timestamp: new Date('2023-10-26T11:20:00Z').toISOString(),
  },
    {
    id: 'inv1628123456792',
    name: 'Cotton Rags',
    quantity: 50,
    unit: 'kg',
    location: 'General Store',
    category: 'Others',
    timestamp: new Date('2023-10-27T09:00:00Z').toISOString(),
    },
];

export const INITIAL_PERFORMA: PerformaRecord[] = [];
