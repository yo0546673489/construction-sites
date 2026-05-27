"use client";

import { useState } from "react";
import { DownloadIcon, ImageIcon, Loader2Icon, SparklesIcon, AlertCircleIcon } from "lucide-react";

export function AdsGeneratorForm() {
  const [businessDescription, setBusinessDescription] = useState("");
  const [count, setCount] = useState(1);
  const [cookies, setCookies] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setHint(null);
    setImages([]);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/generate-ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessDescription, count, cookies }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "שגיאה לא ידועה");
        setHint(data.hint ?? null);
        return;
      }

      setImages(data.images ?? []);
    } catch {
      setError("שגיאת רשת — נסה שוב.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadImage(url: string, index: number) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `ad-image-${index + 1}.png`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(url, "_blank");
    }
  }

  return (
    <div className="space-y-8">
      {/* Form card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg shadow-violet-500/30">
              <SparklesIcon className="size-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">צור מודעות עם AI</div>
              <div className="text-xs text-slate-500">ChatGPT יוצר תמונות פרסומיות בשבילך</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Business description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              תיאור העסק
            </label>
            <textarea
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              placeholder="לדוגמה: מספרה מקצועית בתל אביב המתמחה בתספורות גברים..."
              rows={4}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 resize-none transition"
            />
            <p className="text-xs text-slate-400">
              תאר את העסק, קהל היעד, ושירותים/מוצרים עיקריים
            </p>
          </div>

          {/* Count */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              כמות תמונות
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={5}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                required
                className="w-24 rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-bold text-slate-900 text-center focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 transition"
              />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setCount(n)}
                    className={`flex size-9 items-center justify-center rounded-xl text-sm font-bold transition ${
                      count === n
                        ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-400">בין 1 ל-5 תמונות</p>
          </div>

          {/* ChatGPT Cookies */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Cookies של ChatGPT
            </label>
            <textarea
              value={cookies}
              onChange={(e) => setCookies(e.target.value)}
              placeholder={`הדבק כאן JSON מ-DevTools, לדוגמה:\n[{"name":"__Secure-next-auth.session-token","value":"...","domain":".chatgpt.com","path":"/"}]`}
              rows={5}
              required
              dir="ltr"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs font-mono text-slate-700 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 resize-none transition"
            />
            <p className="text-xs text-slate-400">
              פתח DevTools בדפדפן (F12) → Application → Cookies → chatgpt.com →
              העתק את ה-JSON, או הכנס כ-{" "}
              <code className="rounded bg-slate-100 px-1">name=value; name2=value2</code>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-rose-500" />
              <div>
                <div className="text-sm font-semibold text-rose-700">{error}</div>
                {hint && (
                  <div className="mt-1 text-xs text-rose-600">{hint}</div>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-l from-violet-500 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-violet-500/30 transition-all hover:shadow-lg hover:shadow-violet-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                מייצר תמונות... (עד 2 דקות)
              </>
            ) : (
              <>
                <SparklesIcon className="size-4" />
                צור מודעות
              </>
            )}
          </button>

          {loading && (
            <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-center text-xs text-violet-700">
              ChatGPT מייצר את התמונות — זה לוקח בין 30 שניות ל-2 דקות. אל תסגור את הדף.
            </div>
          )}
        </form>
      </div>

      {/* Results grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="size-4 text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">
              {images.length} תמונות נוצרו
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((src, i) => (
              <div
                key={i}
                className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`מודעה ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-semibold text-slate-700">
                    מודעה {i + 1}
                  </span>
                  <div className="flex gap-2">
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                    >
                      פתח
                    </a>
                    <button
                      onClick={() => downloadImage(src, i)}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-violet-500 to-violet-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:shadow-md hover:shadow-violet-500/30"
                    >
                      <DownloadIcon className="size-3" />
                      הורד
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
