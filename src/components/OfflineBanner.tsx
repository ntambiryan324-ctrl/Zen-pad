import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-600/90 backdrop-blur-md border border-amber-500/50 px-4 py-2.5 text-xs font-semibold text-white shadow-xl">
      <WifiOff className="w-4 h-4 animate-pulse text-amber-200" />
      <span>Offline Mode — ZenPad is running from local device cache.</span>
    </div>
  );
};
