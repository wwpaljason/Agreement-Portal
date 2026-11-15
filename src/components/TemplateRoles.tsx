"use client";

import { useState, useTransition } from "react";
import { saveRolesAction } from "@/app/actions";
import { defaultRoles, getTemplate, roleLabel } from "@/lib/templates/registry";
import type { Role } from "@/lib/templates/types";

const roles: Role[] = ["agent", "landlord", "tenant"];

export function TemplateRoles({ slug, initial }: { slug: string; initial: Record<string, Role> }) {
  const template = getTemplate(slug);
  const [current, setCurrent] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [, startTransition] = useTransition();
  if (!template) return null;
  const defaults = defaultRoles(template);

  function save(next: Record<string, Role>) {
    setStatus("saving");
    startTransition(async () => {
      try {
        await saveRolesAction(slug, next);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <div className="roles">
      <div className="roles-bar">
        <p>
          Party links can only change the fields you assign to them. Inside the portal you can still edit every field.
          Strikethrough choices stay with the agent.
        </p>
        <div className="roles-actions">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setCurrent(defaults);
              setStatus("idle");
            }}
          >
            Reset to defaults
          </button>
          <button type="button" className="btn primary" onClick={() => save(current)}>
            Save roles
          </button>
          <span className={`save-state save-${status}`}>
            {status === "saving" && "Saving…"}
            {status === "saved" && "Saved"}
            {status === "error" && "Not saved"}
          </span>
        </div>
      </div>
      {template.sections.map((section) =>
        section.fields.length ? (
          <section key={section.id} className="form-section">
            <h2>
              <span>{section.zh}</span>
              {section.en}
            </h2>
            {section.fields.map((field) => (
              <div key={field.id} className="role-row">
                <div>
                  <div className="m-zh">{field.labelZh}</div>
                  <div className="m-en">{field.labelEn}</div>
                </div>
                <div className="seg">
                  {roles.map((role) => (
                    <button
                      type="button"
                      key={role}
                      className={current[field.id] === role ? `on role-${role}` : ""}
                      onClick={() => {
                        setCurrent((prev) => ({ ...prev, [field.id]: role }));
                        setStatus("idle");
                      }}
                    >
                      {roleLabel(role)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null,
      )}
    </div>
  );
}
