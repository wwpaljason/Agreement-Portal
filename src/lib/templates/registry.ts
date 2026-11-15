import { provisionalTenancy } from "./provisional-tenancy";
import type { Role, TemplateDef } from "./types";

export const templates: TemplateDef[] = [provisionalTenancy];

export function getTemplate(slug: string): TemplateDef | null {
  return templates.find((template) => template.slug === slug) ?? null;
}

export function templateFields(template: TemplateDef) {
  return template.sections.flatMap((section) => section.fields);
}

export function templateStrikeIds(template: TemplateDef): string[] {
  return template.sections.flatMap((section) =>
    (section.strikes ?? []).flatMap((group) => group.options.map((option) => option.id)),
  );
}

export function defaultRoles(template: TemplateDef): Record<string, Role> {
  const roles: Record<string, Role> = {};
  for (const field of templateFields(template)) roles[field.id] = field.defaultRole;
  return roles;
}

export function resolveRoles(
  template: TemplateDef,
  saved: Record<string, unknown> | null | undefined,
): Record<string, Role> {
  const roles = defaultRoles(template);
  if (!saved) return roles;
  for (const field of templateFields(template)) {
    const role = saved[field.id];
    if (role === "agent" || role === "landlord" || role === "tenant") roles[field.id] = role;
  }
  return roles;
}

export function roleLabel(role: Role): string {
  if (role === "landlord") return "Landlord";
  if (role === "tenant") return "Tenant";
  return "Agent";
}
