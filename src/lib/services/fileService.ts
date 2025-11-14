import type { InventoryItem, PerformaRecord } from '@/lib/types';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const importFromXlsx = (file: File): Promise<{ inventoryData: InventoryItem[], performaData: PerformaRecord[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        const inventorySheet = wb.Sheets['Inventory'];
        const performaSheet = wb.Sheets['Performa'];
        
        const inventoryData: InventoryItem[] = inventorySheet ? XLSX.utils.sheet_to_json(inventorySheet) : [];
        const performaData: PerformaRecord[] = performaSheet ? XLSX.utils.sheet_to_json(performaSheet) : [];
        
        resolve({ inventoryData, performaData });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const exportToXlsx = (inventory: InventoryItem[], performa: PerformaRecord[], shipName: string) => {
  const inventorySheet = XLSX.utils.json_to_sheet(inventory);
  const performaSheet = XLSX.utils.json_to_sheet(performa);
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, inventorySheet, 'Inventory');
  XLSX.utils.book_append_sheet(wb, performaSheet, 'Performa');
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const fileName = `${shipName.replace(/ /g, '_')}_DataExport_${new Date().toISOString().split('T')[0]}.xlsx`;

  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
};
