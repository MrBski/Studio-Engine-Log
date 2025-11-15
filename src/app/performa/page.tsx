'use client';

import { usePerforma } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Gauge, Ban, FileJson } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
        <Button variant="outline" size="sm"><FileJson className="mr-2 h-4 w-4" /> View JSON</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>JSON Data</DialogTitle>
          <DialogDescription>Full data for this log entry.</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto rounded-md bg-muted/50 p-4">
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default function PerformaPage() {
  const { performaRecords, deletePerformaRecord, deleteAllPerformaRecords } = usePerforma();
  
  // Sort records by date, most recent first
  const sortedData = [...performaRecords].sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const isJsonString = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
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
        <div className="grid gap-4 md:grid-cols-2">
          {sortedData.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{item.nama}</CardTitle>
                <CardDescription>
                  {new Date(item.tanggal).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                {isJsonString(item.keterangan) ? (
                    <JsonViewer jsonData={item.keterangan} />
                ) : (
                    <>
                      <p><span className="font-semibold text-muted-foreground">Quantity:</span> {item.jumlah}</p>
                      {item.keterangan && <p><span className="font-semibold text-muted-foreground">Notes:</span> {item.keterangan}</p>}
                    </>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

    