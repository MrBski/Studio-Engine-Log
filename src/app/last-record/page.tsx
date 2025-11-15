'use client';

import { useInventory, usePerforma, useEngineLog } from '@/hooks/use-app';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History, Archive, Gauge, ClipboardList, FileJson, Trash2, Eye } from 'lucide-react';
import type { LastRecord } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { EngineLogViewer } from '@/components/engine-log-viewer';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export default function LastRecordPage() {
  const { inventory } = useInventory();
  const { performaRecords, deletePerformaRecord } = usePerforma();
  const { engineLogs } = useEngineLog();
  const [isClient, setIsClient] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const lastRecords = useMemo<LastRecord[]>(() => {
    if (!isClient) return [];
    
    const records: LastRecord[] = [];
    
    inventory.forEach(lastInv => {
        records.push({
          id: `last-inv-${lastInv.id}`,
          type: 'Inventory',
          summary: `"${lastInv.name}" updated (${lastInv.quantity} ${lastInv.unit})`,
          timestamp: lastInv.timestamp,
          category: lastInv.category,
        });
    });
    
    performaRecords.forEach(lastPerf => {
        let type: LastRecord['type'] = 'Performa';
        let summary = `Record "${lastPerf.nama}" for ${lastPerf.jumlah}`;
        let data = null;
        
        try {
            const parsedKeterangan = JSON.parse(lastPerf.keterangan);
            if (parsedKeterangan && typeof parsedKeterangan === 'object' && 'datetime' in parsedKeterangan) {
              type = 'Engine Log';
              summary = lastPerf.nama;
              data = parsedKeterangan;
            }
        } catch (e) {
            // Not a JSON string, treat as normal performa record
        }

        records.push({
          id: lastPerf.id, // Use the original id for deletion
          type: type,
          summary: summary,
          timestamp: lastPerf.tanggal,
          data,
        });
    });
    
    engineLogs.forEach(lastEngineLog => {
        records.push({
            id: `last-log-${lastEngineLog.id}`,
            type: 'EngineLog',
            summary: `Anomaly log with ${lastEngineLog.sections.length} entries.`,
            timestamp: lastEngineLog.timestamp,
        });
    });

    return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [inventory, performaRecords, engineLogs, isClient]);

  const getIcon = (type: LastRecord['type']) => {
    switch (type) {
        case 'Inventory': return <Archive className="h-4 w-4 text-muted-foreground" />;
        case 'Performa': return <Gauge className="h-4 w-4 text-muted-foreground" />;
        case 'EngineLog': return <ClipboardList className="h-4 w-4 text-muted-foreground" />;
        case 'Engine Log': return <FileJson className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
  }

  const handleViewLog = (record: LastRecord) => {
    if (record.type === 'Engine Log' && record.data) {
        setSelectedLog(record.data);
    }
  }
  
  if (!isClient) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-headline font-bold text-foreground">Last Recorded Data</h2>
            </div>
            <div className="space-y-4">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center">Loading records...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
  }

  return (
    <Dialog onOpenChange={(open) => !open && setSelectedLog(null)}>
        <div className="space-y-8">
        <div className="flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-headline font-bold text-foreground">Last Recorded Data</h2>
        </div>

        <div className="space-y-4">
            {lastRecords.length > 0 ? lastRecords.map((record) => (
            <Card key={record.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                    {getIcon(record.type)}
                    <div>
                        <p className="font-semibold">{record.summary}</p>
                        <p className="text-xs text-muted-foreground">
                            {new Date(record.timestamp).toLocaleString()} - <span className="font-medium">{record.type} {record.category ? `(${record.category})` : ''}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {record.type === 'Engine Log' && (
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => handleViewLog(record)}>
                                <Eye className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                    )}
                    {(record.type === 'Performa' || record.type === 'Engine Log') && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete the record "{record.summary}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deletePerformaRecord(record.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </Card>
            )) : (
            <Card>
                <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">No recent records found.</p>
                </CardContent>
            </Card>
            )}
        </div>

        <DialogContent className="max-w-3xl">
            <DialogHeader>
            <DialogTitle>Engine Log Preview</DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto">
                {selectedLog && <EngineLogViewer data={selectedLog} />}
            </div>
        </DialogContent>
        </div>
    </Dialog>
  );
}
