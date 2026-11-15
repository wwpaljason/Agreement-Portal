import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { TemplateRoles } from "@/components/TemplateRoles";
import { getFieldRoles } from "@/lib/store";
import { defaultRoles, getTemplate } from "@/lib/templates/registry";

export const dynamic = "force-dynamic";

export default async function TemplateConfigPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  let roles = defaultRoles(template);
  let dbError = "";
  try {
    roles = await getFieldRoles(slug);
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Could not reach MongoDB.";
  }

  return (
    <main className="wrap">
      <a href="/templates">Templates</a>
      <h1>
        {template.nameZh}
        <br />
        {template.nameEn}
      </h1>
      <p className="lede">
        Defaults: landlord edits their name, address, and signature name. Tenant edits the same for themselves.
        Everything else belongs to the agent.
      </p>
      {dbError && <p className="banner">{dbError}</p>}
      <TemplateRoles slug={slug} initial={roles} />
    </main>
  );
}
