'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function ConnectivityStatus() {
  const [isOnline, setIsOnline] = useState(true);

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

  return (
    <Badge variant="outline" className={cn(
        "flex items-center gap-2 transition-colors",
        isOnline ? "text-green-600 border-green-200 bg-green-50" : "text-red-600 border-red-200 bg-red-50",
        "dark:text-white dark:border-opacity-50",
        isOnline ? "dark:bg-green-900/50 dark:border-green-500/50" : "dark:bg-red-900/50 dark:border-red-500/50"
      )}>
      {isOnline ? (
        <Wifi className="h-3.5 w-3.5" />
      ) : (
        <WifiOff className="h-3.5 w-3.5" />
      )}
      <span className="text-xs font-medium">{isOnline ? 'Online' : 'Offline'}</span>
    </Badge>
  );
}
