import { requireTenantUser } from "@/lib/auth-helpers";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "הגדרות — דשבורד" };

export default async function SettingsPage() {
  const { tenant } = await requireTenantUser();

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#C9A24A]">
          ניהול
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
          הגדרות
        </h1>
        <p className="mt-2 text-sm text-white/55">
          אינטגרציות וטרקינג עבור האתר שלך.
        </p>
      </div>

      <SettingsForm
        initialPixelCode={tenant.facebookPixelCode ?? ""}
        initialClarityCode={tenant.clarityCode ?? ""}
        initialClarityApiToken={tenant.clarityApiToken ?? ""}
        tenantSlug={tenant.slug}
      />
    </div>
  );
}
