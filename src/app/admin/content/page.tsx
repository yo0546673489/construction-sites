import { requireTenantUser } from "@/lib/auth-helpers";
import { parseSiteContent } from "@/lib/content";
import { parseCharityContent } from "@/lib/charity-content";
import { ContentEditor } from "@/components/admin/content-editor";
import { CharityContentEditor } from "@/components/admin/charity-content-editor";

export const metadata = { title: "עריכת תוכן — דשבורד" };

export default async function ContentPage() {
  const { tenant } = await requireTenantUser();

  /* ============== Dispatcher לפי template ============== */
  if (tenant.template === "charity") {
    const content = parseCharityContent(tenant.content);
    return (
      <CharityContentEditor initial={content} tenantSlug={tenant.slug} />
    );
  }

  /* ============== ברירת מחדל — שיפוצניק (Visual Editor) ============== */
  const content = parseSiteContent(tenant.content);
  return <ContentEditor initial={content} tenantSlug={tenant.slug} />;
}
