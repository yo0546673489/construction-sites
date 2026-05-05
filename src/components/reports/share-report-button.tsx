// components/reports/share-report-button.tsx
'use client';

import { useState, useTransition } from 'react';
import { Share2, X, Copy, Check, ExternalLink } from 'lucide-react';
import { createShareableReport } from '@/app/admin/reports/actions';

export function ShareReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const [formData, setFormData] = useState({
    title: '',
    showSpend: true,
    showDonations: true,
    showRoas: true,
    showCampaigns: true,
    expiresInDays: 30,
    password: '',
    dateRangeDays: 30,
  });

  const handleCreate = () => {
    if (!formData.title.trim()) {
      alert('יש להזין שם לדוח');
      return;
    }

    startTransition(async () => {
      try {
        const result = await createShareableReport({
          title: formData.title,
          showSpend: formData.showSpend,
          showDonations: formData.showDonations,
          showRoas: formData.showRoas,
          showCampaigns: formData.showCampaigns,
          expiresInDays: formData.expiresInDays || undefined,
          password: formData.password || undefined,
          dateRangeDays: formData.dateRangeDays,
        });
        setCreatedUrl(result.url);
      } catch (e) {
        alert('שגיאה ביצירת הדוח');
      }
    });
  };

  const handleCopy = async () => {
    if (!createdUrl) return;
    await navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedUrl(null);
    setCopied(false);
    setFormData({
      title: '',
      showSpend: true,
      showDonations: true,
      showRoas: true,
      showCampaigns: true,
      expiresInDays: 30,
      password: '',
      dateRangeDays: 30,
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        שתף דוח
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">צור קישור שיתוף</h2>
              <button 
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createdUrl ? (
              // הצג את הקישור שנוצר
              <div className="p-6 space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900 mb-2">
                    ✅ הקישור נוצר בהצלחה!
                  </p>
                  <p className="text-xs text-green-700">
                    שלח את הקישור הזה ללקוח. הוא יוכל לצפות בדוח בלי להיכנס למערכת.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">קישור הדוח:</label>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={createdUrl}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                      onFocus={(e) => e.target.select()}
                    />
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'הועתק' : 'העתק'}
                    </button>
                  </div>
                </div>

                <a
                  href={createdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  פתח את הדוח בטאב חדש
                </a>

                <button
                  onClick={handleClose}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200"
                >
                  סגור
                </button>
              </div>
            ) : (
              // טופס יצירה
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    שם הדוח (יראה ללקוח)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="דוח חודשי - מאי 2026"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">טווח נתונים</label>
                  <select
                    value={formData.dateRangeDays}
                    onChange={(e) => setFormData({ ...formData, dateRangeDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value={7}>7 ימים אחרונים</option>
                    <option value={30}>30 ימים אחרונים</option>
                    <option value={90}>90 ימים אחרונים</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">מה להציג בדוח?</label>
                  <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showDonations}
                        onChange={(e) => setFormData({ ...formData, showDonations: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">💰 תרומות</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showSpend}
                        onChange={(e) => setFormData({ ...formData, showSpend: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">💸 הוצאות פרסום (כבה אם הלקוח לא צריך לראות)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showRoas}
                        onChange={(e) => setFormData({ ...formData, showRoas: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">⚡ ROAS ותובנות</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.showCampaigns}
                        onChange={(e) => setFormData({ ...formData, showCampaigns: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">📊 פירוט קמפיינים</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    תפוגה (ימים)
                  </label>
                  <input
                    type="number"
                    value={formData.expiresInDays}
                    onChange={(e) => setFormData({ ...formData, expiresInDays: Number(e.target.value) })}
                    min={1}
                    max={365}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    הקישור יפוג אוטומטית אחרי תקופה זו
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    סיסמה (אופציונלי)
                  </label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="השאר ריק לגישה חופשית"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    אם תוסיף סיסמה, הלקוח יצטרך להזין אותה לפני צפייה
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleCreate}
                    disabled={isPending}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isPending ? 'יוצר...' : 'צור קישור'}
                  </button>
                  <button
                    onClick={handleClose}
                    className="px-4 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    ביטול
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
