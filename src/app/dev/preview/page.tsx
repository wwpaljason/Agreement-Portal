import { notFound } from "next/navigation";
import { AgreementEditor } from "@/components/AgreementEditor";
import { defaultRoles } from "@/lib/templates/registry";
import { provisionalTenancy } from "@/lib/templates/provisional-tenancy";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { as } = await searchParams;
  const actor = as === "landlord" || as === "tenant" ? as : "agent";

  return (
    <AgreementEditor
      actor={actor}
      templateSlug={provisionalTenancy.slug}
      title="Preview"
      subtitle={`${provisionalTenancy.nameZh} ${provisionalTenancy.nameEn}`}
      values={{ landlordName: "陳大文", tenantName: "李小美", premisesAddress: "九龍太子道西 123 號" }}
      strikes={{}}
      fieldRoles={defaultRoles(provisionalTenancy)}
      saveUrl={null}
      landlordToken="preview-landlord-token-not-saved"
      tenantToken="preview-tenant-token-not-saved"
    />
  );
}
