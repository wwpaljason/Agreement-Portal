import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { templates } from "@/lib/templates/registry";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  return (
    <main className="wrap">
      <h1>Templates</h1>
      <p className="lede">Choose who can edit each field. New agreements pick up the roles you save here.</p>
      <div className="template-grid">
        {templates.map((template) => (
          <a key={template.slug} className="card" href={`/templates/${template.slug}`}>
            <h2>
              {template.nameZh} {template.nameEn}
            </h2>
            <p>
              {template.pages} pages · {template.description}
            </p>
          </a>
        ))}
      </div>
    </main>
  );
}
