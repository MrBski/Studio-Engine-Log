'use client';

import { usePerforma } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Gauge, Ban, FileJson } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EngineLogViewer } from '@/components/engine-log-viewer';
import { useEffect, useState } from 'react';

const JsonViewer = ({ jsonData }: { jsonData: string }) => {
  let data;
  try {
    data = JSON.parse(jsonData);
  } catch (e) {
    return <pre className="whitespace-pre-wrap text-sm text-destructive">{jsonData}</pre>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm"><FileJson className="mr-2 h-4 w-4" /> View Log</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Engine Log Details</DialogTitle>
          <DialogDescription>Read-only view of the saved engine log.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto rounded-md bg-muted/20 p-2">
            <EngineLogViewer data={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default function PerformaPage() {
  const { performaRecords, deletePerformaRecord, deleteAllPerformaRecords } = usePerforma();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Sort records by date, most recent first
  const sortedData = [...performaRecords].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const isJsonString = (str: string) => {
    if (!str || typeof str !== 'string') return false;
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Gauge className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-headline font-bold text-foreground">Performa Data</h2>
        </div>
        {sortedData.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all {sortedData.length} performa records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAllPerformaRecords}>
                  Yes, delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {sortedData.length === 0 ? (
        <Card className="text-center py-12">
            <CardContent className="space-y-4">
                <Ban className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="font-semibold">No Performa Data</h3>
                <p className="text-muted-foreground">There are no performa records saved yet.</p>
                <Button asChild>
                    <Link href="/input">Add First Record</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedData.map((item) => (
            <Card key={item.id}>
              <div className="flex items-center p-4">
                <div className="flex-1 space-y-1">
                    <p className="font-semibold">{item.nama}</p>
                    <p className="text-sm text-muted-foreground">
                        {new Date(item.tanggal).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {isJsonString(item.keterangan) ? (
                        <JsonViewer jsonData={item.keterangan} />
                    ) : (
                        <div className="text-right">
                          <p className="font-semibold">{item.jumlah}</p>
                          {item.keterangan && <p className="text-sm text-muted-foreground truncate max-w-xs">{item.keterangan}</p>}
                        </div>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive flex-shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this record?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the record named "{item.nama}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePerformaRecord(item.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
