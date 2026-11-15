import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PortalError } from "@/lib/mongodb";
import { updateAgreementAsAgent } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  try {
    const ok = await updateAgreementAsAgent(id, body);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof PortalError) {
      const status = /Bad|Unknown/.test(error.message) ? 400 : 500;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
