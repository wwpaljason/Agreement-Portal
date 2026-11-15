import { notFound } from "next/navigation";
import { AgreementEditor } from "@/components/AgreementEditor";
import { defaultRoles } from "@/lib/templates/registry";
import { provisionalTenancy } from "@/lib/templates/provisional-tenancy";
import { S, tenancyAgreement } from "@/lib/templates/tenancy-agreement";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ as?: string; template?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const { as, template: templateSlug } = await searchParams;
  const actor = as === "landlord" || as === "tenant" ? as : "agent";
  const template = templateSlug === tenancyAgreement.slug ? tenancyAgreement : provisionalTenancy;
  const tenancy = template.slug === tenancyAgreement.slug;

  return (
    <AgreementEditor
      actor={actor}
      templateSlug={template.slug}
      title="Preview"
      subtitle={`${template.nameZh} ${template.nameEn}`}
      values={
        tenancy
          ? {
              refNo: "TA-001",
              landlordName: "陳大文",
              tenantName: "李小美",
              premisesAddress: "九龍太子道西 123 號 5 樓 A 室",
              monthlyRent: "18000",
              rentDueDay: "1",
            }
          : { landlordName: "陳大文", tenantName: "李小美", premisesAddress: "九龍太子道西 123 號" }
      }
      strikes={tenancy ? { [S.useResidential]: true, [S.feeMgmtTenant]: true } : {}}
      fieldRoles={defaultRoles(template)}
      saveUrl={null}
      landlordToken="preview-landlord-token-not-saved"
      tenantToken="preview-tenant-token-not-saved"
    />
  );
}
