// components/donations/sync-button.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

export function SyncButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSync = () => {
    setMessage(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/donations/sync', { method: 'POST' });
        const data = await res.json();
        
        if (data.success) {
          setMessage(`✅ סונכרנו ${data.newDonations} תרומות חדשות`);
          router.refresh();
        } else {
          setMessage(`❌ שגיאה: ${data.errors.join(', ')}`);
        }
      } catch (e) {
        setMessage('❌ שגיאה בסנכרון');
      }
      
      setTimeout(() => setMessage(null), 5000);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleSync}
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
        {isPending ? 'מסנכרן...' : 'סנכרן עכשיו'}
      </button>
      {message && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm whitespace-nowrap z-10">
          {message}
        </div>
      )}
    </div>
  );
}
