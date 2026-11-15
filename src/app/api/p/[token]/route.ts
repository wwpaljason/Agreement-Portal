import { NextResponse } from "next/server";
import { PortalError } from "@/lib/mongodb";
import { updateAgreementAsParty } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ token: string }> }) {
  const { token } = await context.params;
  const body = await request.json().catch(() => null);
  try {
    const ok = await updateAgreementAsParty(token, body);
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
