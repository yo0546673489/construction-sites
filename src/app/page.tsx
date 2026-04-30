import { redirect } from "next/navigation";

/**
 * עמוד הבית של הפלטפורמה — מפנה ישירות לאתר השיפוצניק (demo).
 * הדומיין הראשי = אתר השיפוצניק.
 * הדשבורד נגיש ב-https://admin.pro-digital.org או ב-/admin/login.
 */
export default function PlatformHome() {
  redirect("/sites/demo");
}
