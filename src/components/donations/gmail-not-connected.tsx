// components/donations/gmail-not-connected.tsx
import { Mail, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Props {
  error?: string | null;
}

export function GmailNotConnected({ error }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-blue-500/15 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-700" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          חבר את Gmail כדי לראות תרומות
        </h2>

        <p className="text-slate-600 mb-6">
          המערכת תחפש מיילים עם מילות מפתח שתגדיר ותציג את כל פרטי התרומות
          (סכום, תורם, תאריך) בצורה יפה ומסודרת.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3 mb-4 flex items-start gap-2 text-right">
            <AlertCircle className="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        <Link
          href="/admin/settings/donations"
          className="inline-flex items-center gap-2 bg-emerald-500 text-zinc-900 px-6 py-3 rounded-lg hover:bg-emerald-500/90 transition-colors font-medium"
        >
          <Mail className="w-5 h-5" />
          עבור להגדרות
        </Link>

        <div className="mt-8 text-right rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900 mb-2">איך זה עובד?</h3>
          <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside marker:text-slate-400">
            <li>חבר את חשבון ה-Gmail של העמותה</li>
            <li>הגדר מילות מפתח (כמו &quot;פרויקט 36&quot;)</li>
            <li>הקפד לכתוב את מילות המפתח בהערות הקמפיין ב&quot;נדרים פלוס&quot;</li>
            <li>המערכת תחפש את המיילים אוטומטית כל שעה</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
