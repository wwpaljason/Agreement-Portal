"use client";

import { getTemplate } from "@/lib/templates/registry";
import { roleLabel } from "@/lib/templates/registry";
import { useEditor } from "./editor-context";

export function MobileForm() {
  const editor = useEditor();
  const template = getTemplate(editor.templateSlug);
  if (!template) return null;

  return (
    <div className="mobile-form">

      {template.sections.map((section) => {
        if (!section.fields.length && !section.strikes?.length) return null;
        return (
          <section key={section.id} className="form-section">
            <h2>
              <span>{section.zh}</span>
              {section.en}
            </h2>
            {section.fields.map((field) => {
              const role = editor.fieldRoles[field.id] ?? field.defaultRole;
              const editable = editor.canEditField(field.id);
              return (
                <label key={field.id} className="m-field">
                  <span className="m-label">
                    <span className="m-zh">{field.labelZh}</span>
                    <span className="m-en">{field.labelEn}</span>
                    <span className={`role-pill role-${role}`}>{roleLabel(role)}</span>
                  </span>
                  <input
                    value={editor.values[field.id] ?? ""}
                    readOnly={!editable}
                    maxLength={2000}
                    autoComplete="off"
                    spellCheck={false}
                    onChange={(event) => editor.setValue(field.id, event.target.value)}
                  />
                </label>
              );
            })}
            {section.strikes?.map((group) => {
              const check = group.kind === "check";
              return (
                <div key={group.id} className="strike-group">
                  <div className="m-zh">{group.labelZh}</div>
                  <div className="m-en">
                    {group.labelEn}
                    {check ? (group.exclusive ? ". Tick one." : ". Tick what applies.") : ". Strike what does not apply."}
                  </div>
                  <div className="strike-options">
                    {group.options.map((option) => {
                      const on = !!editor.strikes[option.id];
                      return (
                        <button
                          type="button"
                          key={option.id}
                          className={check ? (on ? "checked" : "") : on ? "struck" : ""}
                          aria-pressed={on}
                          disabled={!editor.canEditStrikes}
                          onClick={() => editor.toggleStrike(option.id)}
                        >
                          <span>{option.zh}</span>
                          <span>{option.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
