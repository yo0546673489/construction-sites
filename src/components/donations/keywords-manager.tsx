// components/donations/keywords-manager.tsx
'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tag, Sparkles } from 'lucide-react';
import {
  createKeywordAction,
  updateKeywordAction,
  deleteKeywordAction,
} from '@/app/admin/settings/donations/actions';

interface Keyword {
  id: string;
  keyword: string;
  campaignName: string;
  color: string;
  isActive: boolean;
}

interface Props {
  tenantId: string;
  keywords: Keyword[];
}

const COLORS = [
  '#10b981', '#14b8a6', '#3b82f6', '#8b5cf6',
  '#ec4899', '#f43f5e', '#f97316', '#eab308',
];

export function KeywordsManager({ keywords }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    campaignName: '',
    color: COLORS[0],
  });

  const resetForm = () => {
    setFormData({ keyword: '', campaignName: '', color: COLORS[0] });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.keyword.trim() || !formData.campaignName.trim()) {
      alert('יש למלא את שני השדות: שם הקמפיין ומילת המפתח');
      return;
    }
    await createKeywordAction(formData);
    resetForm();
  };

  const handleUpdate = async (id: string) => {
    if (!formData.keyword.trim() || !formData.campaignName.trim()) {
      alert('יש למלא את שני השדות');
      return;
    }
    await updateKeywordAction(id, formData);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'למחוק את הקמפיין? תרומות קיימות יישמרו אבל לא יקושרו לקמפיין.'
      )
    )
      return;
    await deleteKeywordAction(id);
  };

  const startEdit = (k: Keyword) => {
    setEditingId(k.id);
    setFormData({
      keyword: k.keyword,
      campaignName: k.campaignName,
      color: k.color,
    });
  };

  const inputClass =
    'w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400';

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-6">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            מילות מפתח לקמפיינים
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            כל קמפיין מחבר תרומות מ-Gmail לקמפיין פרסום ב-Meta
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-emerald-500 to-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/40"
          >
            <Plus className="size-4" />
            הוסף קמפיין
          </button>
        )}
      </div>

      <div className="space-y-4 p-6">
        {/* הסבר */}
        <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <div className="text-xs leading-relaxed text-slate-700">
            <span className="font-bold text-emerald-700">איך זה עובד:</span>{' '}
            <span className="font-bold">שם הקמפיין</span> — נשתמש בשם הזה כדי
            להתאים אוטומטית לקמפיין Meta (כל קמפיין שהשם שלו מכיל את הטקסט
            הזה). <span className="font-bold">מילת מפתח</span> — הטקסט שמופיע
            בהערות במייל מנדרים פלוס לזיהוי התרומה.
          </div>
        </div>

        {/* טופס הוספה/עריכה */}
        {(isAdding || editingId) && (
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 via-white to-white p-5 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  שם הקמפיין
                </label>
                <input
                  type="text"
                  value={formData.campaignName}
                  onChange={(e) =>
                    setFormData({ ...formData, campaignName: e.target.value })
                  }
                  placeholder="מזון לתינוקות"
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  הטקסט שצריך להופיע בשם הקמפיין ב-Meta
                </p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  מילת מפתח (במייל מנדרים פלוס)
                </label>
                <input
                  type="text"
                  value={formData.keyword}
                  onChange={(e) =>
                    setFormData({ ...formData, keyword: e.target.value })
                  }
                  placeholder="פרוייקט 36"
                  className={inputClass}
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  הטקסט שמופיע בהערות של התרומה במייל
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                צבע
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: c })}
                    className={`size-8 rounded-full transition-transform ${
                      formData.color === c
                        ? 'ring-2 ring-offset-2 ring-offset-white ring-slate-900 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={
                  editingId ? () => handleUpdate(editingId) : handleAdd
                }
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-emerald-500 to-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/40"
              >
                <Save className="size-4" />
                {editingId ? 'עדכן' : 'הוסף'}
              </button>
              <button
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <X className="size-4" />
                ביטול
              </button>
            </div>
          </div>
        )}

        {/* רשימת קמפיינים */}
        {keywords.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
              <Tag className="size-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              עדיין לא הוגדרו קמפיינים
            </p>
            <p className="text-xs text-slate-400">
              הוסף קמפיין ראשון כדי להתחיל לעקוב אחר תרומות
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {keywords.map((k) => (
              <div
                key={k.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div
                    className="size-10 shrink-0 rounded-2xl shadow-sm"
                    style={{ backgroundColor: k.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900 truncate">
                      {k.campaignName}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="text-slate-400">מילת מפתח:</span>
                      <code className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">
                        {k.keyword}
                      </code>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => startEdit(k)}
                    className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                    title="ערוך"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(k.id)}
                    className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700"
                    title="מחק"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
