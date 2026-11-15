import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { AgreementEditor } from "@/components/AgreementEditor";
import { getAgreement } from "@/lib/store";
import { getTemplate } from "@/lib/templates/registry";

export const dynamic = "force-dynamic";

export default async function AgreementPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const { id } = await params;
  const agreement = await getAgreement(id);
  if (!agreement) notFound();
  const template = getTemplate(agreement.templateSlug);
  if (!template) notFound();

  return (
    <AgreementEditor
      actor="agent"
      agreementId={agreement.id}
      templateSlug={agreement.templateSlug}
      title={agreement.title}
      subtitle={`${template.nameZh} ${template.nameEn}`}
      values={agreement.values}
      strikes={agreement.strikes}
      fieldRoles={agreement.fieldRoles}
      saveUrl={`/api/agreements/${agreement.id}`}
      landlordToken={agreement.landlordToken}
      tenantToken={agreement.tenantToken}
    />
  );
}
