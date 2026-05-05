// components/donations/gmail-not-connected.tsx
import { Mail, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  error?: string | null;
}

export function GmailNotConnected({ error }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          חבר את Gmail כדי לראות תרומות
        </h2>
        
        <p className="text-gray-600 mb-6">
          המערכת תחפש מיילים עם מילות מפתח שתגדיר ותציג את כל פרטי התרומות
          (סכום, תורם, תאריך) בצורה יפה ומסודרת.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2 text-right">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        <Link
          href="/admin/settings/donations"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Mail className="w-5 h-5" />
          עבור להגדרות
        </Link>

        <div className="mt-8 text-right bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">איך זה עובד?</h3>
          <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
            <li>חבר את חשבון ה-Gmail של העמותה</li>
            <li>הגדר מילות מפתח (כמו "פרויקט 36")</li>
            <li>הקפד לכתוב את מילות המפתח בהערות הקמפיין ב"נדרים פלוס"</li>
            <li>המערכת תחפש את המיילים אוטומטית כל שעה</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
