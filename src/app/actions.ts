"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PortalError } from "@/lib/mongodb";
import { createAgreement, deleteAgreement, saveFieldRoles } from "@/lib/store";

async function emailOrLogin() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/login");
  return email;
}

function rethrowRedirect(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest: unknown }).digest).startsWith("NEXT_REDIRECT")
  ) {
    throw error;
  }
  if (error instanceof PortalError) throw error;
  console.error(error);
  throw new PortalError("Could not reach MongoDB. Check MONGODB_URI in .env.local.");
}

export async function createAgreementAction(formData: FormData) {
  const email = await emailOrLogin();
  const slug = String(formData.get("templateSlug") ?? "");
  try {
    const id = await createAgreement(slug, email);
    redirect(`/agreements/${id}`);
  } catch (error) {
    rethrowRedirect(error);
  }
}

export async function saveRolesAction(slug: string, roles: Record<string, string>) {
  const email = await emailOrLogin();
  try {
    await saveFieldRoles(slug, roles, email);
  } catch (error) {
    rethrowRedirect(error);
  }
}

export async function deleteAgreementAction(id: string) {
  await emailOrLogin();
  try {
    const ok = await deleteAgreement(id);
    if (!ok) throw new PortalError("Agreement not found.");
  } catch (error) {
    rethrowRedirect(error);
  }
  redirect("/");
}
