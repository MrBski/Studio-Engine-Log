'use client';

import { useShip, useInventory, usePerforma, useSettings } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, FileUp, FileDown, RefreshCw } from 'lucide-react';
import { importFromXlsx, exportToXlsx } from '@/lib/services/fileService';
import { syncWithServer } from '@/lib/services/syncService';
import { useRef, type ChangeEvent, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { AppSettings } from '@/lib/types';

export default function SettingsPage() {
  const { shipName, setShipName: setContextShipName } = useShip();
  const { inventory, setInventory } = useInventory();
  const { performaRecords, setPerformaRecords } = usePerforma();
  const { settings, setSettings: setContextSettings } = useSettings();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [localShipName, setLocalShipName] = useState(shipName);
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalShipName(shipName);
  }, [shipName]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

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

  const handleSettingsSave = () => {
    setContextSettings(localSettings);
    toast({
      title: "Settings Updated",
      description: "Calculation settings have been saved.",
    });
  };

  const handleSettingsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumber = e.target.type === 'number';
    setLocalSettings(prev => ({
      ...prev,
      [name]: isNumber ? Number(value) : value,
    }));
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
                <Input id="shipName" value={localShipName || ''} onChange={(e) => setLocalShipName(e.target.value)} placeholder="e.g., MV Sea Pilot" />
                <Button onClick={handleNameSave}>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>On-Duty Engineer</CardTitle>
            <CardDescription>Set the default engineer for new log sheets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="engineerName">Engineer Name</Label>
               <Input id="engineerName" name="engineerName" value={localSettings?.engineerName || ''} onChange={handleSettingsChange} placeholder="e.g., Mr. Basuki" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="engineerPosition">Engineer Position</Label>
              <Input id="engineerPosition" name="engineerPosition" value={localSettings?.engineerPosition || ''} onChange={handleSettingsChange} placeholder="e.g., 3/E" />
            </div>
             <div className="pt-2">
                <Button onClick={handleSettingsSave}>Save Engineer Details</Button>
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calculation Settings</CardTitle>
            <CardDescription>Define multipliers for various calculations in the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dailyTankMultiplier">Daily Tank Multiplier (cm to Ltrs)</Label>
               <Input id="dailyTankMultiplier" name="dailyTankMultiplier" type="number" value={localSettings?.dailyTankMultiplier || 0} onChange={handleSettingsChange} placeholder="e.g., 21" />
            </div>
            <div className="pt-2">
              <Button onClick={handleSettingsSave}>Save Calculation Settings</Button>
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
