'use client';

import { useInventory, usePerforma, useEngineLog } from '@/hooks/use-app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Archive, Gauge, ClipboardList, FileJson } from 'lucide-react';
import type { LastRecord } from '@/lib/types';
import { useMemo, useState, useEffect } from 'react';

export default function LastRecordPage() {
  const { inventory } = useInventory();
  const { performaRecords } = usePerforma();
  const { engineLogs } = useEngineLog();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const lastRecords = useMemo<LastRecord[]>(() => {
    const records: LastRecord[] = [];
    
    inventory.forEach(lastInv => {
        records.push({
          id: `last-inv-${lastInv.id}`,
          type: 'Inventory',
          summary: `"${lastInv.name}" updated (${lastInv.quantity} ${lastInv.unit})`,
          timestamp: lastInv.timestamp,
        });
    });
    
    performaRecords.forEach(lastPerf => {
        let type: LastRecord['type'] = 'Performa';
        let summary = `Record "${lastPerf.nama}" for ${lastPerf.jumlah}`;
        
        try {
            const parsedKeterangan = JSON.parse(lastPerf.keterangan);
            if (parsedKeterangan && typeof parsedKeterangan === 'object' && 'datetime' in parsedKeterangan) {
              type = 'Engine Log';
              summary = lastPerf.nama;
            }
        } catch (e) {
            // Not a JSON string, treat as normal performa record
        }

        records.push({
          id: `last-perf-${lastPerf.id}`,
          type: type,
          summary: summary,
          timestamp: lastPerf.tanggal,
        });
    });
    
    engineLogs.forEach(lastEngineLog => {
        records.push({
            id: `last-log-${lastEngineLog.id}`,
            type: 'EngineLog',
            summary: `Saved new log with ${lastEngineLog.sections.length} entries.`,
            timestamp: lastEngineLog.timestamp,
        });
    });

    return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [inventory, performaRecords, engineLogs]);

  const getIcon = (type: LastRecord['type']) => {
    switch (type) {
        case 'Inventory': return <Archive className="h-4 w-4 text-muted-foreground" />;
        case 'Performa': return <Gauge className="h-4 w-4 text-muted-foreground" />;
        case 'EngineLog': return <ClipboardList className="h-4 w-4 text-muted-foreground" />;
        case 'Engine Log': return <FileJson className="h-4 w-4 text-muted-foreground" />;
        default: return null;
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
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <History className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-headline font-bold text-foreground">Last Recorded Data</h2>
      </div>

      <div className="space-y-4">
        {lastRecords.length > 0 ? lastRecords.map((record) => (
          <Card key={record.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{record.type} Update</CardTitle>
              {getIcon(record.type)}
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{record.summary}</div>
              <p className="text-xs text-muted-foreground">
                Recorded on {new Date(record.timestamp).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">No recent records found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}