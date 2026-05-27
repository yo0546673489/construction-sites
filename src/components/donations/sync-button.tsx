// components/donations/sync-button.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

interface Props {
  /** טווח הימים שמסונכרן (ברירת מחדל 7). מועבר ל-API. */
  daysBack?: number;
}

export function SyncButton({ daysBack = 7 }: Props) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleSync = () => {
    setMessage(null);
    setIsError(false);
    startTransition(async () => {
      try {
        const res = await fetch('/api/donations/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ daysBack }),
        });
        const data = await res.json();

        if (data.success) {
          setMessage(`✅ סונכרנו ${data.newDonations} תרומות חדשות (מתוך ${data.totalProcessed} שנבדקו)`);
          router.refresh();
        } else {
          setIsError(true);
          setMessage(`❌ שגיאה: ${(data.errors || []).join(', ') || 'לא ידוע'}`);
        }
      } catch {
        setIsError(true);
        setMessage('❌ שגיאה בסנכרון');
      }

      setTimeout(() => setMessage(null), 6000);
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleSync}
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-emerald-500 text-zinc-900 px-4 py-2 rounded-lg hover:bg-emerald-500/90 disabled:opacity-50 transition-all font-medium"
      >
        <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
        {isPending ? `מסנכרן ${daysBack} ימים...` : `סנכרן ${daysBack} ימים`}
      </button>
      {message && (
        <div
          className={`absolute top-full left-0 mt-2 rounded-lg shadow-lg p-3 text-sm whitespace-nowrap z-10 border ${
            isError
              ? 'bg-red-500/15 border-red-400/40 text-red-800'
              : 'bg-emerald-500/15 border-emerald-400/40 text-emerald-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
