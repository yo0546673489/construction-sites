import { redirect } from "next/navigation";

/**
 * fallback בלבד — בפועל ה-rewrite ב-next.config מנתב את `/` ל-/sites/demo
 * לפני שהקובץ הזה מורץ, אז ה-URL נשאר `pro-digital.org/` והתוכן הוא
 * אתר השיפוצניק.
 *
 * אם ה-rewrite לא רץ מסיבה כלשהי — נישאר בהפניה לדמו.
 */
export default function PlatformHome() {
  redirect("/sites/demo");
}
