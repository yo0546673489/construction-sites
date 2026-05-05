// components/shared/error-state.tsx
import { AlertTriangle } from 'lucide-react';

interface Props {
  error: string;
}

export function ErrorState({ error }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">לא הצלחנו לטעון נתונים</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <div className="bg-gray-50 rounded-lg p-4 text-right text-sm text-gray-700">
          <p className="font-semibold mb-2">סיבות אפשריות:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>הטוקן של Meta פג תוקף או לא תקין</li>
            <li>אין הרשאה לחשבון הפרסום הזה</li>
            <li>מזהה חשבון הפרסום שגוי</li>
            <li>בעיית רשת זמנית</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
