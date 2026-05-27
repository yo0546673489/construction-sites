// components/campaigns/setup-required.tsx
import Link from 'next/link';
import { AlertCircle, ExternalLink, Settings } from 'lucide-react';

interface Props {
  tenantName: string;
}

export function SetupRequired({ tenantName }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-amber-500/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          חשבון פרסום עדיין לא מוגדר
        </h2>
        <p className="text-slate-600 mb-6">
          כדי לראות נתוני קמפיינים פייסבוק עבור {tenantName}, צריך להגדיר את
          מזהה חשבון הפרסום (Ad Account ID).
        </p>

        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 bg-emerald-500 text-zinc-900 px-6 py-3 rounded-lg hover:bg-emerald-500/90 transition-colors font-medium"
        >
          <Settings className="w-5 h-5" />
          עבור להגדרות
        </Link>

        <div className="mt-8 text-right rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="font-semibold text-slate-900 mb-3">איך מוצאים את ה-Account ID?</h3>
          <ol className="text-sm text-slate-700 space-y-2 list-decimal list-inside marker:text-slate-400">
            <li>
              היכנס ל-
              <a
                href="https://business.facebook.com/settings/ad-accounts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 underline inline-flex items-center gap-1 hover:text-emerald-700"
              >
                Meta Business Manager
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>נווט ל-Business Settings → Accounts → Ad Accounts</li>
            <li>
              העתק את ה-Account ID (פורמט:{' '}
              <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded font-mono text-xs">
                act_123456789
              </code>
              )
            </li>
            <li>חזור לדף ההגדרות והדבק בשדה &quot;מזהה חשבון פרסום Meta&quot;</li>
          </ol>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          ה-token של Meta כבר מוגדר במערכת — צריך רק את ה-ID של חשבון הפרסום הספציפי
        </div>
      </div>
    </div>
  );
}
