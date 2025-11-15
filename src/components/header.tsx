'use client';

import { useShip } from '@/hooks/use-app';
import { EngineLogLogo } from './icons';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';
import { useSync } from '@/hooks/use-app';
import { cn } from '@/lib/utils';
import { CheckCircle, RefreshCw, WifiOff } from 'lucide-react';

function SyncStatus() {
  const { isOnline, syncStatus } = useSync();
  
  if (!isOnline) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <WifiOff className="h-4 w-4" />
        <span>Offline</span>
      </div>
    );
  }

  switch (syncStatus) {
    case 'syncing':
      return (
        <div className="flex items-center gap-2 text-sm font-medium text-amber-500 animate-pulse">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Syncing...</span>
        </div>
      );
    case 'success':
      return (
        <div className="flex items-center gap-2 text-sm font-medium text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span>Up to date</span>
        </div>
      );
    case 'error':
       return (
        <div className="flex items-center gap-2 text-sm font-medium text-destructive">
          <WifiOff className="h-4 w-4" />
          <span>Sync Failed</span>
        </div>
      );
    default:
      return null;
  }
}


export function Header() {
  const { shipName } = useShip();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <EngineLogLogo className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <h1 className="font-headline text-xl font-bold leading-tight">Engine Log</h1>
            {isMounted ? (
              <p className="text-sm text-muted-foreground font-medium -mt-0.5">{shipName}</p>
            ) : (
              <Skeleton className="h-5 w-24 mt-0.5" />
            )}
          </div>
        </div>
        <div className="hidden sm:block">
            {isMounted ? <SyncStatus /> : <Skeleton className="h-6 w-28" />}
        </div>
      </div>
    </header>
  );
}
