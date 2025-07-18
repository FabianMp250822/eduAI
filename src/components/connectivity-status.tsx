
'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSyncStatus } from '@/hooks/use-sync';

export function ConnectivityStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const { isSyncing, syncProgress, allTopicsCount } = useSyncStatus();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
      setIsOnline(window.navigator.onLine);
    }
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <Badge variant="outline" className={cn(
          "text-red-600 border-red-200 bg-red-50",
          "dark:text-white dark:bg-red-900/50 dark:border-red-500/50"
        )}>
        <WifiOff className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Sin conexión</span>
      </Badge>
    );
  }

  if (isSyncing) {
    return (
      <Badge variant="outline" className={cn(
          "text-blue-600 border-blue-200 bg-blue-50",
          "dark:text-white dark:bg-blue-900/50 dark:border-blue-500/50"
        )}>
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        <span className="text-xs font-medium">Sincronizando ({Math.round(syncProgress)}%)</span>
      </Badge>
    );
  }

  // Online and finished syncing (or no topics to sync)
  return (
    <Badge variant="outline" className={cn(
        "text-green-600 border-green-200 bg-green-50",
        "dark:text-white dark:bg-green-900/50 dark:border-green-500/50"
      )}>
      <CheckCircle className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">Sincronizado</span>
    </Badge>
  );
}
