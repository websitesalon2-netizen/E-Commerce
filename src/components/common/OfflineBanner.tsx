import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div id="offline-network-banner" className="bg-amber-950 text-amber-100 px-4 py-3 sticky top-0 z-50 border-b border-amber-800 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
          <span>
            <strong>Internet connection unavailable.</strong> Please check your connection and try again.
          </span>
        </div>
        <button
          id="offline-retry-btn"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-800 hover:bg-amber-700 text-white rounded-md text-xs font-medium transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      </div>
    </div>
  );
};
