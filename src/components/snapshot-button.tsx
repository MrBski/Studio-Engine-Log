
'use client';

import React from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { Button, type ButtonProps } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera } from 'lucide-react';

interface SnapshotButtonProps extends ButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  fileNamePrefix: string;
  captureOptions?: Partial<html2canvas.Options>;
}

export function SnapshotButton({
  targetRef,
  fileNamePrefix,
  captureOptions,
  children,
  ...props
}: SnapshotButtonProps) {
  const { toast } = useToast();

  const handleSaveSnapshot = async () => {
    const elementToCapture = targetRef.current;
    if (!elementToCapture) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find the element to capture.',
      });
      return;
    }

    toast({
      title: 'Generating Image...',
      description: 'Please wait while the snapshot is being created.',
    });
    
    // Temporarily modify styles to ensure the full content is captured
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
        backgroundColor: '#262A34', // Matches dark card background
        height: elementToCapture.scrollHeight,
        windowHeight: elementToCapture.scrollHeight,
        ...captureOptions,
      });

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        const now = new Date();
        const fileName = `${fileNamePrefix}_${format(now, 'yyyy-MM-dd_HH-mm-ss')}.png`;
        saveAs(blob, fileName);
        toast({
          title: 'Image Saved!',
          description: 'The snapshot has been saved to your device.',
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

  return (
    <Button onClick={handleSaveSnapshot} {...props}>
      <Camera className="mr-2 h-4 w-4" />
      {children || 'Save to Device'}
    </Button>
  );
}
