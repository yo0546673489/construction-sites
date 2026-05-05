// components/donations/keywords-manager.tsx
'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { 
  createKeywordAction, 
  updateKeywordAction, 
  deleteKeywordAction 
} from '@/app/admin/settings/donations/actions';

interface Keyword {
  id: string;
  keyword: string;
  campaignName: string;
  metaCampaignId: string | null;
  color: string;
  isActive: boolean;
}

interface Props {
  tenantId: string;
  keywords: Keyword[];
  hasMetaAccount: boolean;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f97316', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b',
];

export function KeywordsManager({ keywords, hasMetaAccount }: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    keyword: '',
    campaignName: '',
    metaCampaignId: '',
    color: COLORS[0],
  });

  const resetForm = () => {
    setFormData({ keyword: '', campaignName: '', metaCampaignId: '', color: COLORS[0] });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = async () => {
    if (!formData.keyword.trim() || !formData.campaignName.trim()) {
      alert('יש למלא את כל השדות');
      return;
    }
    await createKeywordAction(formData);
    resetForm();
  };

  const handleUpdate = async (id: string) => {
    await updateKeywordAction(id, formData);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק את מילת המפתח? תרומות קיימות יישמרו אבל לא יקושרו לקמפיין.')) return;
    await deleteKeywordAction(id);
  };

  const startEdit = (k: Keyword) => {
    setEditingId(k.id);
    setFormData({
      keyword: k.keyword,
      campaignName: k.campaignName,
      metaCampaignId: k.metaCampaignId || '',
      color: k.color,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">מילות מפתח לקמפיינים</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            הוסף קמפיין
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        כשאתה מקים קמפיין ב"נדרים פלוס" (או מערכת תרומות אחרת), הוסף לשדה
        "הערות" את מילת המפתח. המערכת תזהה את התרומות אוטומטית.
      </p>

      {/* טופס הוספה/עריכה */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                שם הקמפיין
              </label>
              <input
                type="text"
                value={formData.campaignName}
                onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                placeholder="סבב חורף 2026"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                מילת מפתח (הופיעה במייל)
              </label>
              <input
                type="text"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                placeholder="פרויקט 36"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {hasMetaAccount && (
            <div>
              <label className="block text-sm font-medium mb-1">
                מזהה קמפיין Meta (אופציונלי)
              </label>
              <input
                type="text"
                value={formData.metaCampaignId}
                onChange={(e) => setFormData({ ...formData, metaCampaignId: e.target.value })}
                placeholder="123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                כשמקושר - תראה ROAS אוטומטית בדף הקמפיינים
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">צבע</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={`w-8 h-8 rounded-full ${
                    formData.color === c ? 'ring-2 ring-offset-2 ring-gray-900' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={editingId ? () => handleUpdate(editingId) : handleAdd}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'עדכן' : 'הוסף'}
            </button>
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              <X className="w-4 h-4" />
              ביטול
            </button>
          </div>
        </div>
      )}

      {/* רשימת מילות מפתח */}
      {keywords.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          עדיין לא הוגדרו מילות מפתח
        </div>
      ) : (
        <div className="space-y-2">
          {keywords.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: k.color }}
                />
                <div>
                  <div className="font-medium">{k.campaignName}</div>
                  <div className="text-sm text-gray-500">
                    מילת מפתח: <code className="bg-white px-2 py-0.5 rounded">{k.keyword}</code>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => startEdit(k)}
                  className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(k.id)}
                  className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
