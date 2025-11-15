'use client';

import { useInventory, usePerforma, useEngineLog } from '@/hooks/use-app';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History, Archive, Gauge, ClipboardList, FileJson, Trash2, Eye, Camera, Send, PackagePlus, PackageMinus } from 'lucide-react';
import type { LastRecord } from '@/lib/types';
import { useMemo, useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { EngineLogViewer } from '@/components/engine-log-viewer';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';


export default function LogActivityPage() {
  const { inventory } = useInventory();
  const { performaRecords, deletePerformaRecord } = usePerforma();
  const { engineLogs } = useEngineLog();
  const [isClient, setIsClient] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const allRecords = useMemo<LastRecord[]>(() => {
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
            if (parsedKeterangan && typeof parsedKeterangan === 'object') {
                if ('datetime' in parsedKeterangan) {
                    type = 'Engine Log';
                    summary = `Engine Log Entry`;
                    data = parsedKeterangan;
                } else if (parsedKeterangan.type === 'Restock') {
                    type = 'Restock';
                    summary = `Restocked ${parsedKeterangan.quantity} ${parsedKeterangan.unit} of "${parsedKeterangan.itemName}"`;
                    data = parsedKeterangan;
                } else if (parsedKeterangan.type === 'Used') {
                    type = 'Used';
                    summary = `Used ${parsedKeterangan.quantity} ${parsedKeterangan.unit} of "${parsedKeterangan.itemName}"`;
                    data = parsedKeterangan;
                }
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
        case 'Restock': return <PackagePlus className="h-4 w-4 text-muted-foreground" />;
        case 'Used': return <PackageMinus className="h-4 w-4 text-muted-foreground" />;
        default: return null;
    }
  }

  const handleViewLog = (record: LastRecord) => {
    if (record.type === 'Engine Log' && record.data) {
        setSelectedLog(record.data);
    }
  }

  const handleSaveToDevice = async () => {
    const elementToCapture = printRef.current;
    if (!elementToCapture) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not capture the log sheet.',
      });
      return;
    }

    toast({
      title: 'Generating Image...',
      description: 'Please wait while the log sheet is being captured.',
    });

    // Temporarily modify styles to capture full content
    const originalStyle = {
        maxHeight: elementToCapture.style.maxHeight,
        overflowY: elementToCapture.style.overflowY,
    };
    elementToCapture.style.maxHeight = 'none';
    elementToCapture.style.overflowY = 'visible';

    try {
      const canvas = await html2canvas(elementToCapture, {
        useCORS: true,
        scale: 2,
        // Allow canvas to expand to fit all content
        height: elementToCapture.scrollHeight,
        windowHeight: elementToCapture.scrollHeight,
      });

      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        const now = new Date();
        const fileName = `EngineLog_${format(now, 'yyyy-MM-dd_HH-mm-ss')}.png`;
        saveAs(blob, fileName);
        toast({
          title: 'Image Saved!',
          description: 'The log sheet has been saved to your device.',
        });
      }
    } catch (error) {
      console.error('Failed to save image:', error);
      toast({
        variant: 'destructive',
        title: 'Error Saving Image',
        description: 'Could not generate the image. Please try again.',
      });
    } finally {
        // Restore original styles
        elementToCapture.style.maxHeight = originalStyle.maxHeight;
        elementToCapture.style.overflowY = originalStyle.overflowY;
    }
  };
  
  if (!isClient) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-headline font-bold text-foreground">Log Activity</h2>
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
            <h2 className="text-2xl font-headline font-bold text-foreground">Log Activity</h2>
        </div>

        <div className="space-y-4">
            {allRecords.length > 0 ? allRecords.map((record) => (
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
                    {(record.type === 'Performa' || record.type === 'Engine Log' || record.type === 'Restock' || record.type === 'Used') && (
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
                                    This will permanently delete the record. This action cannot be undone.
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
                <p className="text-muted-foreground text-center">No recent activity found.</p>
                </CardContent>
            </Card>
            )}
        </div>

        <DialogContent className="max-w-3xl">
            <DialogHeader>
            <DialogTitle>Engine Log Preview</DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto" ref={printRef}>
                {selectedLog && <EngineLogViewer data={selectedLog} />}
            </div>
             <DialogFooter>
                <Button type="button" size="lg" variant="outline" onClick={handleSaveToDevice}>
                    <Camera className="mr-2 h-4 w-4" />
                    Save to Device
                </Button>
            </DialogFooter>
        </DialogContent>
        </div>
    </Dialog>
  );
}
