// components/donations/connection-status.tsx
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  type: 'success' | 'error';
  message: string;
}

export function ConnectionStatus({ type, message }: Props) {
  const isSuccess = type === 'success';
  
  return (
    <div className={`rounded-lg border p-4 flex items-start gap-3 ${
      isSuccess 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      )}
      <p className={`text-sm font-medium ${
        isSuccess ? 'text-green-800' : 'text-red-800'
      }`}>
        {message}
      </p>
    </div>
  );
}
