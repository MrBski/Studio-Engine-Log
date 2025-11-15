'use client';

import { useInventory, usePerforma, useEngineLog } from '@/hooks/use-app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Archive, Gauge, ClipboardList, FileJson } from 'lucide-react';
import type { LastRecord } from '@/lib/types';
import { useMemo } from 'react';

export default function LastRecordPage() {
  const { inventory } = useInventory();
  const { performaRecords } = usePerforma();
  const { engineLogs } = useEngineLog();

  const isJsonString = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  const lastRecords = useMemo<LastRecord[]>(() => {
    const records: LastRecord[] = [];
    
    if (inventory.length > 0) {
      const lastInv = [...inventory].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      if (lastInv) {
        records.push({
          id: `last-inv-${lastInv.id}`,
          type: 'Inventory',
          summary: `"${lastInv.name}" updated (${lastInv.quantity} ${lastInv.unit})`,
          timestamp: lastInv.timestamp,
        });
      }
    }
    
    if (performaRecords.length > 0) {
       const lastPerf = [...performaRecords].sort((a,b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())[0];
      if (lastPerf) {
        let type: LastRecord['type'] = 'Performa';
        let summary = `Record "${lastPerf.nama}" for ${lastPerf.jumlah}`;
        
        if (isJsonString(lastPerf.keterangan)) {
          type = 'Engine Log';
          summary = lastPerf.nama;
        }

        records.push({
          id: `last-perf-${lastPerf.id}`,
          type: type,
          summary: summary,
          timestamp: lastPerf.tanggal,
        });
      }
    }
    
    if (engineLogs.length > 0) {
        const lastEngineLog = engineLogs[0];
        if(lastEngineLog) {
            records.push({
                id: `last-log-${lastEngineLog.id}`,
                type: 'EngineLog',
                summary: `Saved new log with ${lastEngineLog.sections.length} entries.`,
                timestamp: lastEngineLog.timestamp,
            });
        }
    }

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

    