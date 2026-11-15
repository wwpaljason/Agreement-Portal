import { notFound } from "next/navigation";
import { AgreementEditor } from "@/components/AgreementEditor";
import { getAgreementByToken } from "@/lib/store";
import { getTemplate } from "@/lib/templates/registry";

export const dynamic = "force-dynamic";

export default async function PartyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const agreement = await getAgreementByToken(token);
  if (!agreement) notFound();
  const template = getTemplate(agreement.templateSlug);
  if (!template) notFound();

  return (
    <AgreementEditor
      actor={agreement.role}
      templateSlug={agreement.templateSlug}
      title={agreement.title}
      subtitle={`${template.nameZh} ${template.nameEn}`}
      values={agreement.values}
      strikes={agreement.strikes}
      fieldRoles={agreement.fieldRoles}
      saveUrl={`/api/p/${token}`}
    />
  );
}
