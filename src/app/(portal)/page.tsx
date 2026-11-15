import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createAgreementAction } from "@/app/actions";
import { listAgreements } from "@/lib/store";
import { getTemplate, templates } from "@/lib/templates/registry";

export const dynamic = "force-dynamic";

function stamp(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Hong_Kong",
  }).format(new Date(iso));
}

export default async function HomePage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  let rows: Awaited<ReturnType<typeof listAgreements>> = [];
  let dbError = "";
  try {
    rows = await listAgreements();
  } catch (error) {
    dbError = error instanceof Error ? error.message : "Could not reach MongoDB.";
  }

  return (
    <main className="wrap">
      <h1>Agreements</h1>
      <p className="lede">Signed-in agents share this list. Landlord and tenant links are on each agreement.</p>
      {dbError && <p className="banner">{dbError}</p>}
      <div className="create-row" style={{ marginBottom: 22 }}>
        {templates.map((template) => (
          <form key={template.slug} action={createAgreementAction}>
            <input type="hidden" name="templateSlug" value={template.slug} />
            <button className="btn primary" type="submit" disabled={!!dbError}>
              New {template.nameEn}
            </button>
          </form>
        ))}
      </div>
      {rows.length === 0 ? (
        <div className="card">
          <h2>Nothing here yet</h2>
          <p>Create a provisional tenancy agreement, then send the party links.</p>
        </div>
      ) : (
        <div className="agreement-list">
          {rows.map((row) => {
            const template = getTemplate(row.templateSlug);
            const premises = row.values.premisesAddress;
            return (
              <a key={row.id} className="card" href={`/agreements/${row.id}`}>
                <h2>{row.title}</h2>
                <p>
                  {template ? `${template.nameZh} · ${template.nameEn}` : row.templateSlug}
                  {premises ? ` · ${premises}` : ""}
                </p>
                <div className="meta">
                  Updated {stamp(row.updatedAt)} · {row.createdBy}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
