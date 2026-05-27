// components/donations/connection-status.tsx
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  type: 'success' | 'error';
  message: string;
}

export function ConnectionStatus({ type, message }: Props) {
  const isSuccess = type === 'success';
  
  return (
    <div className={`rounded-xl border p-4 flex items-start gap-3 ${
      isSuccess
        ? 'bg-emerald-500/10 border-emerald-400/30'
        : 'bg-red-500/10 border-red-400/30'
    }`}>
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
      )}
      <p className={`text-sm font-medium ${
        isSuccess ? 'text-emerald-800' : 'text-red-800'
      }`}>
        {message}
      </p>
    </div>
  );
}
