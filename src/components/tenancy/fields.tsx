"use client";

import type { ReactNode } from "react";
import { getTemplate, templateFields } from "@/lib/templates/registry";
import { useDocMode, useEditor } from "../editor-context";

const widthClass = {
  grow: "fill-grow",
  xs: "w-xs",
  sm: "w-sm",
  md: "w-md",
  lg: "w-lg",
  remark: "remark-input",
} as const;

export function Fill({ id, width }: { id: string; width: keyof typeof widthClass }) {
  const editor = useEditor();
  const mode = useDocMode();
  const template = getTemplate(editor.templateSlug);
  const field = template ? templateFields(template).find((item) => item.id === id) : undefined;
  const role = editor.fieldRoles[id] ?? field?.defaultRole ?? "agent";
  const editable = mode === "edit" && editor.canEditField(id);

  return (
    <input
      className={["fill-input", widthClass[width], editable ? `is-editable role-${role}` : "is-locked"].join(" ")}
      aria-label={field?.labelEn ?? id}
      value={editor.values[id] ?? ""}
      readOnly={!editable}
      tabIndex={editable ? 0 : -1}
      maxLength={2000}
      autoComplete="off"
      spellCheck={false}
      onChange={(event) => editor.setValue(id, event.target.value)}
    />
  );
}

export function Opt({ id, children }: { id: string; children: ReactNode }) {
  const editor = useEditor();
  const mode = useDocMode();
  const interactive = mode === "edit" && editor.canEditStrikes;
  const struck = !!editor.strikes[id];

  return (
    <span
      className={struck ? "strike-opt struck" : "strike-opt"}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      title={interactive ? "點擊切換刪除線 Click to strike" : undefined}
      onClick={interactive ? () => editor.toggleStrike(id) : undefined}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                editor.toggleStrike(id);
              }
            }
          : undefined
      }
    >
      {children}
    </span>
  );
}
