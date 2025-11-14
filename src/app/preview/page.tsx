'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Camera, FileImage } from 'lucide-react';

export default function PreviewPage() {
  const previewRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSaveSnapshot = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, { backgroundColor: '#0a192f' });
      const image = canvas.toDataURL('image/jpeg', 0.8);

      const history = JSON.parse(localStorage.getItem('snapshots') || '[]');
      history.push({
        id: Date.now(),
        image,
        time: new Date().toLocaleString(),
      });
      localStorage.setItem('snapshots', JSON.stringify(history));

      toast({
        title: 'Snapshot Saved!',
        description: 'The preview has been saved to your local snapshots.',
      });
      // Optionally navigate away
      // router.push('/performa');
    } catch (error) {
      console.error("Failed to save snapshot:", error);
      toast({
        variant: "destructive",
        title: 'Error Saving Snapshot',
        description: 'Could not save the snapshot. Please try again.',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Camera className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-headline font-bold text-foreground">Save Snapshot</h2>
      </div>
      
      <Card ref={previewRef} className="overflow-hidden">
        <CardHeader>
          <CardTitle>Preview Area</CardTitle>
          <CardDescription>
            This is the area that will be captured as a snapshot. You can place any content here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 bg-primary/10 p-8 rounded-lg text-center border-2 border-dashed border-primary/30">
            <FileImage className="mx-auto h-12 w-12 text-primary/50" />
            <p className="mt-4 font-semibold">Example Content</p>
            <p className="text-sm text-muted-foreground">
              Dynamic data or charts would be rendered here for capturing.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={handleSaveSnapshot} size="lg">
          <Camera className="mr-2 h-4 w-4" />
          Save Snapshot
        </Button>
      </div>
    </div>
  );
}
