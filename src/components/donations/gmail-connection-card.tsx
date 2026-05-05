// components/donations/gmail-connection-card.tsx
import { Mail, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import { disconnectGmail } from '@/app/admin/settings/donations/actions';

interface Props {
  connection: {
    email: string;
    lastSyncAt: Date | null;
    syncEnabled: boolean;
    lastSyncError: string | null;
  } | null;
}

export function GmailConnectionCard({ connection }: Props) {
  if (!connection) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">חיבור Gmail</h2>
            <p className="text-gray-600 mb-4">
              חבר את חשבון ה-Gmail של העמותה כדי שהמערכת תוכל לחפש מיילים של
              תרומות. אנחנו נחפש רק מיילים שמכילים את מילות המפתח שתגדיר.
            </p>
            <a
              href="/api/gmail/connect"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Mail className="w-5 h-5" />
              חבר Gmail
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${connection.syncEnabled ? 'bg-green-50' : 'bg-red-50'}`}>
          {connection.syncEnabled ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-xl font-bold">Gmail מחובר</h2>
              <p className="text-gray-600 text-sm mt-1">{connection.email}</p>
            </div>
            <form action={disconnectGmail}>
              <button
                type="submit"
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="נתק"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="space-y-2 text-sm">
            {connection.lastSyncAt && (
              <p className="text-gray-600">
                ✅ סנכרון אחרון: {new Date(connection.lastSyncAt).toLocaleString('he-IL')}
              </p>
            )}
            
            {connection.lastSyncError && (
              <p className="text-red-600">
                ⚠️ שגיאה אחרונה: {connection.lastSyncError}
              </p>
            )}

            {!connection.syncEnabled && (
              <p className="text-orange-600">
                הסנכרון מושבת. ייתכן שהטוקן פג תוקף - יש לחבר מחדש.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
