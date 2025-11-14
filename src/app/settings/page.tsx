'use client';

import { useShip, useInventory, usePerforma } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, FileUp, FileDown, RefreshCw } from 'lucide-react';
import { importFromXlsx, exportToXlsx } from '@/lib/services/fileService';
import { syncWithServer } from '@/lib/services/syncService';
import { useRef, type ChangeEvent } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { shipName, setShipName: setContextShipName } = useShip();
  const { inventory, setInventory } = useInventory();
  const { performaRecords, setPerformaRecords } = usePerforma();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Local state for input to avoid updating context on every keystroke
  const [localShipName, setLocalShipName] = React.useState(shipName);

  React.useEffect(() => {
    setLocalShipName(shipName);
  }, [shipName]);

  const handleFileImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { inventoryData, performaData } = await importFromXlsx(file);
        setInventory(inventoryData);
        setPerformaRecords(performaData);
        toast({
          title: "Import Successful",
          description: "Inventory and performa data have been loaded from the file.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: "There was an error processing the XLSX file.",
        });
        console.error(error);
      }
    }
  };

  const handleExport = () => {
    try {
      exportToXlsx(inventory, performaRecords, shipName);
       toast({
        title: "Export Started",
        description: `Data for ${shipName} is being exported.`,
      });
    } catch(error) {
       toast({
          variant: "destructive",
          title: "Export Failed",
          description: "There was an error exporting data.",
        });
        console.error(error);
    }
  };
  
  const handleSync = async () => {
    toast({ title: "Syncing...", description: "Attempting to sync data with the server." });
    try {
      await syncWithServer({ inventory, performaRecords });
      toast({ title: "Sync Successful", description: "Your data is now up-to-date." });
    } catch (error) {
       toast({
          variant: "destructive",
          title: "Sync Failed",
          description: "Could not connect to the server. Please try again later.",
        });
      console.error(error);
    }
  };

  const handleNameSave = () => {
    setContextShipName(localShipName);
    toast({
        title: "Ship Name Updated",
        description: `The ship name has been set to "${localShipName}".`,
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-headline font-bold text-foreground">Settings</h2>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Ship Configuration</CardTitle>
            <CardDescription>Set the name of your ship. This will be used in exports and reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shipName">Ship Name</Label>
              <div className="flex gap-2">
                <Input id="shipName" value={localShipName} onChange={(e) => setLocalShipName(e.target.value)} placeholder="e.g., MV Sea Pilot" />
                <Button onClick={handleNameSave}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Import, export, or sync your ship's data. Useful for backups and sharing.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
             <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileImport}
              accept=".xlsx, .xls"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <FileUp className="mr-2 h-4 w-4" />
              Import from XLSX
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Export to XLSX
            </Button>
            <Button onClick={handleSync}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync with Server
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
