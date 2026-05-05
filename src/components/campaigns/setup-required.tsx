// components/campaigns/setup-required.tsx
import { AlertCircle, ExternalLink } from 'lucide-react';

interface Props {
  tenantName: string;
}

export function SetupRequired({ tenantName }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          חשבון פרסום עדיין לא מוגדר
        </h2>
        <p className="text-gray-600 mb-6">
          כדי לראות נתוני קמפיינים פייסבוק עבור {tenantName}, מנהל המערכת צריך
          להגדיר את מזהה חשבון הפרסום.
        </p>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-right">
          <h3 className="font-semibold text-blue-900 mb-2">למנהל המערכת:</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>
              היכנס ל-
              <a
                href="https://business.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline inline-flex items-center gap-1"
              >
                Meta Business Manager
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>נווט ל-Business Settings → Accounts → Ad Accounts</li>
            <li>
              העתק את ה-Account ID של הלקוח (פורמט:{' '}
              <code className="bg-blue-100 px-1 rounded">act_123456789</code>)
            </li>
            <li>עדכן בדף ההגדרות של הלקוח בדשבורד</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
