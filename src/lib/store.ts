import { ObjectId, type Collection } from "mongodb";
import { randomBytes } from "crypto";
import { getDb, PortalError } from "./mongodb";
import {
  getTemplate,
  resolveRoles,
  templateFields,
  templateStrikeIds,
} from "./templates/registry";
import type { Role } from "./templates/types";

export type AgreementDoc = {
  _id: ObjectId;
  templateSlug: string;
  title: string;
  values: Record<string, string>;
  strikes: Record<string, boolean>;
  createdBy: string;
  landlordToken: string;
  tenantToken: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TemplateConfigDoc = {
  slug: string;
  fieldRoles: Record<string, Role>;
  updatedBy: string;
  updatedAt: Date;
};

export type AgentAgreement = {
  id: string;
  templateSlug: string;
  title: string;
  values: Record<string, string>;
  strikes: Record<string, boolean>;
  fieldRoles: Record<string, Role>;
  createdBy: string;
  landlordToken: string;
  tenantToken: string;
  createdAt: string;
  updatedAt: string;
};

export type PartyAgreement = {
  templateSlug: string;
  title: string;
  values: Record<string, string>;
  strikes: Record<string, boolean>;
  fieldRoles: Record<string, Role>;
  role: "landlord" | "tenant";
  updatedAt: string;
};

const MAX_VALUE = 2000;

function token() {
  return randomBytes(32).toString("base64url");
}

async function agreements(): Promise<Collection<AgreementDoc>> {
  const db = await getDb();
  return db.collection<AgreementDoc>("agreements");
}

async function configs(): Promise<Collection<TemplateConfigDoc>> {
  const db = await getDb();
  return db.collection<TemplateConfigDoc>("templateConfigs");
}

export async function getFieldRoles(slug: string): Promise<Record<string, Role>> {
  const template = getTemplate(slug);
  if (!template) throw new PortalError("Unknown template.");
  const doc = await (await configs()).findOne({ slug });
  return resolveRoles(template, doc?.fieldRoles);
}

export async function saveFieldRoles(slug: string, incoming: unknown, email: string) {
  const template = getTemplate(slug);
  if (!template) throw new PortalError("Unknown template.");
  if (!incoming || typeof incoming !== "object") throw new PortalError("Bad roles.");
  const fieldRoles = resolveRoles(template, incoming as Record<string, unknown>);
  await (await configs()).updateOne(
    { slug },
    { $set: { slug, fieldRoles, updatedBy: email, updatedAt: new Date() } },
    { upsert: true },
  );
  return fieldRoles;
}

function cleanValues(templateSlug: string, input: unknown, allowed: Set<string>) {
  const template = getTemplate(templateSlug);
  if (!template) throw new PortalError("Unknown template.");
  if (input == null) return {};
  if (typeof input !== "object") throw new PortalError("Bad values.");
  const known = new Set(templateFields(template).map((field) => field.id));
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!known.has(key) || !allowed.has(key)) continue;
    if (typeof value !== "string") throw new PortalError("Bad values.");
    out[key] = value.slice(0, MAX_VALUE);
  }
  return out;
}

function cleanStrikes(templateSlug: string, input: unknown) {
  const template = getTemplate(templateSlug);
  if (!template) throw new PortalError("Unknown template.");
  if (input == null) return {};
  if (typeof input !== "object") throw new PortalError("Bad strikes.");
  const known = new Set(templateStrikeIds(template));
  const out: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!known.has(key)) continue;
    if (typeof value !== "boolean") throw new PortalError("Bad strikes.");
    out[key] = value;
  }
  return out;
}

// Option ids contain dots. Mongo treats dots in $set paths as nesting, so
// `strikes.strike.breakWho.landlord` was stored as a tree and never read back.
function strikeStorageKey(id: string) {
  return id.replaceAll(".", "|");
}

export function readStrikes(templateSlug: string, raw: unknown): Record<string, boolean> {
  const template = getTemplate(templateSlug);
  const known = new Set(template ? templateStrikeIds(template) : []);
  const out: Record<string, boolean> = {};

  const visit = (node: unknown, prefix: string) => {
    if (!node || typeof node !== "object" || Array.isArray(node)) return;
    for (const [rawKey, value] of Object.entries(node as Record<string, unknown>)) {
      const key = rawKey.replaceAll("|", ".");
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "boolean") {
        if (known.has(path)) out[path] = value;
      } else {
        visit(value, path);
      }
    }
  };

  visit(raw, "");
  return out;
}

function cleanTitle(input: unknown): string | undefined {
  if (input == null) return undefined;
  if (typeof input !== "string") throw new PortalError("Bad title.");
  const title = input.trim().slice(0, 200);
  return title || "Untitled agreement";
}

export async function createAgreement(slug: string, email: string) {
  const template = getTemplate(slug);
  if (!template) throw new PortalError("Unknown template.");
  const now = new Date();
  const doc: AgreementDoc = {
    _id: new ObjectId(),
    templateSlug: slug,
    title: `${template.nameEn}`,
    values: {},
    strikes: {},
    createdBy: email,
    landlordToken: token(),
    tenantToken: token(),
    createdAt: now,
    updatedAt: now,
  };
  await (await agreements()).insertOne(doc);
  return doc._id.toHexString();
}

function toAgent(doc: AgreementDoc, fieldRoles: Record<string, Role>): AgentAgreement {
  return {
    id: doc._id.toHexString(),
    templateSlug: doc.templateSlug,
    title: doc.title,
    values: doc.values ?? {},
    strikes: readStrikes(doc.templateSlug, doc.strikes),
    fieldRoles,
    createdBy: doc.createdBy,
    landlordToken: doc.landlordToken,
    tenantToken: doc.tenantToken,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function listAgreements(): Promise<AgentAgreement[]> {
  const docs = await (await agreements()).find({}).sort({ updatedAt: -1 }).toArray();
  const roleCache = new Map<string, Record<string, Role>>();
  const rows: AgentAgreement[] = [];
  for (const doc of docs) {
    let roles = roleCache.get(doc.templateSlug);
    if (!roles) {
      roles = await getFieldRoles(doc.templateSlug);
      roleCache.set(doc.templateSlug, roles);
    }
    rows.push(toAgent(doc, roles));
  }
  return rows;
}

export async function getAgreement(id: string): Promise<AgentAgreement | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await (await agreements()).findOne({ _id: new ObjectId(id) });
  if (!doc) return null;
  return toAgent(doc, await getFieldRoles(doc.templateSlug));
}

export async function getAgreementByToken(partyToken: string): Promise<PartyAgreement | null> {
  if (!partyToken || partyToken.length < 20) return null;
  const col = await agreements();
  const doc = await col.findOne({
    $or: [{ landlordToken: partyToken }, { tenantToken: partyToken }],
  });
  if (!doc) return null;
  const role = doc.landlordToken === partyToken ? "landlord" : "tenant";
  return {
    templateSlug: doc.templateSlug,
    title: doc.title,
    values: doc.values ?? {},
    strikes: readStrikes(doc.templateSlug, doc.strikes),
    fieldRoles: await getFieldRoles(doc.templateSlug),
    role,
    updatedAt: doc.updatedAt.toISOString(),
  };
}

async function applyPatch(
  filter: Record<string, unknown>,
  templateSlug: string,
  values: Record<string, string>,
  strikes: Record<string, boolean>,
  title: string | undefined,
  currentStrikes: unknown,
) {
  const set: Record<string, unknown> = { updatedAt: new Date() };
  for (const [key, value] of Object.entries(values)) set[`values.${key}`] = value;
  if (title !== undefined) set.title = title;
  if (Object.keys(strikes).length) {
    const merged = { ...readStrikes(templateSlug, currentStrikes), ...strikes };
    const stored: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(merged)) stored[strikeStorageKey(key)] = value;
    set.strikes = stored;
  }
  const result = await (await agreements()).updateOne(filter, { $set: set });
  return result.matchedCount > 0;
}

export async function updateAgreementAsAgent(id: string, body: unknown) {
  if (!ObjectId.isValid(id)) return false;
  if (!body || typeof body !== "object") throw new PortalError("Bad request.");
  const existing = await (await agreements()).findOne({ _id: new ObjectId(id) });
  if (!existing) return false;
  const roles = await getFieldRoles(existing.templateSlug);
  const allowed = new Set(Object.keys(roles));
  const payload = body as Record<string, unknown>;
  const values = cleanValues(existing.templateSlug, payload.values, allowed);
  const strikes = cleanStrikes(existing.templateSlug, payload.strikes);
  const title = cleanTitle(payload.title);
  return applyPatch({ _id: existing._id }, existing.templateSlug, values, strikes, title, existing.strikes);
}

export async function updateAgreementAsParty(partyToken: string, body: unknown) {
  const existing = await (await agreements()).findOne({
    $or: [{ landlordToken: partyToken }, { tenantToken: partyToken }],
  });
  if (!existing) return false;
  if (!body || typeof body !== "object") throw new PortalError("Bad request.");
  const role = existing.landlordToken === partyToken ? "landlord" : "tenant";
  const roles = await getFieldRoles(existing.templateSlug);
  const allowed = new Set(
    Object.entries(roles)
      .filter(([, fieldRole]) => fieldRole === role)
      .map(([fieldId]) => fieldId),
  );
  const payload = body as Record<string, unknown>;
  const values = cleanValues(existing.templateSlug, payload.values, allowed);
  return applyPatch(
    role === "landlord" ? { landlordToken: partyToken } : { tenantToken: partyToken },
    existing.templateSlug,
    values,
    {},
    undefined,
    existing.strikes,
  );
}

export async function deleteAgreement(id: string) {
  if (!ObjectId.isValid(id)) return false;
  const result = await (await agreements()).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
