import fs from "fs";
import path from "path";

export const whitelistPath = path.join(process.cwd(), "config", "allowed-emails.txt");

export function readWhitelist(): string[] {
  try {
    const raw = fs.readFileSync(whitelistPath, "utf8");
    const seen = new Set<string>();
    const emails: string[] = [];
    for (const line of raw.split(/\r?\n/)) {
      const email = line.trim().toLowerCase();
      if (!email || email.startsWith("#") || seen.has(email)) continue;
      seen.add(email);
      emails.push(email);
    }
    return emails;
  } catch {
    return [];
  }
}

export function isEmailAllowed(email: string): boolean {
  return readWhitelist().includes(email.trim().toLowerCase());
}
