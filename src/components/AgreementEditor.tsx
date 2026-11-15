"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { deleteAgreementAction } from "@/app/actions";
import type { Role } from "@/lib/templates/types";
import { EditorProvider, type EditorState } from "./editor-context";
import { MobileForm } from "./MobileForm";
import { TenancyDocument } from "./tenancy/TenancyDocument";

type Actor = "agent" | "landlord" | "tenant";

type Props = {
  actor: Actor;
  templateSlug: string;
  title: string;
  subtitle: string;
  values: Record<string, string>;
  strikes: Record<string, boolean>;
  fieldRoles: Record<string, Role>;
  saveUrl: string | null;
  agreementId?: string;
  landlordToken?: string;
  tenantToken?: string;
};

const PAGE_W = (210 * 96) / 25.4;
const PAGE_H = (297 * 96) / 25.4;

function ScaledDoc({ fitWidth, children }: { fitWidth: boolean; children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const apply = () => {
      const next = frame.clientWidth / PAGE_W;
      setScale(fitWidth ? Math.min(1, next) : 1);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [fitWidth]);

  return (
    <div ref={frameRef} className="scale-frame">
      <div style={{ height: (PAGE_H * 2 + 18) * scale, overflow: fitWidth ? "hidden" : "auto" }}>
        <div style={{ width: PAGE_W * scale, margin: "0 auto" }}>
          <div style={{ width: PAGE_W, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgreementEditor(props: Props) {
  const [values, setValues] = useState(props.values);
  const [strikes, setStrikes] = useState(props.strikes);
  const [title, setTitle] = useState(props.title);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(props.saveUrl ? "saved" : "idle");
  const [view, setView] = useState<"form" | "document">("document");
  const [fitWidth, setFitWidth] = useState(true);
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingDelete, startDelete] = useTransition();
  const dirtyValues = useRef<Record<string, string>>({});
  const dirtyStrikes = useRef<Record<string, boolean>>({});
  const dirtyTitle = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (window.matchMedia("(max-width: 800px)").matches) setView("form");
    setOrigin(window.location.origin);
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    document.title = title.trim() || "Agreement";
  }, [title]);

  const canEditField = useCallback(
    (id: string) => {
      if (props.actor === "agent") return true;
      return props.fieldRoles[id] === props.actor;
    },
    [props.actor, props.fieldRoles],
  );

  const flush = useCallback(async () => {
    if (!props.saveUrl) return;
    const valuesPatch = dirtyValues.current;
    const strikesPatch = dirtyStrikes.current;
    const titlePatch = dirtyTitle.current;
    if (!Object.keys(valuesPatch).length && !Object.keys(strikesPatch).length && titlePatch == null) return;
    dirtyValues.current = {};
    dirtyStrikes.current = {};
    dirtyTitle.current = null;
    if (mounted.current) setStatus("saving");
    try {
      const response = await fetch(props.saveUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values: valuesPatch,
          strikes: strikesPatch,
          ...(titlePatch != null ? { title: titlePatch } : {}),
        }),
      });
      if (!response.ok) throw new Error("save failed");
      const pending =
        Object.keys(dirtyValues.current).length > 0 ||
        Object.keys(dirtyStrikes.current).length > 0 ||
        dirtyTitle.current != null;
      if (!mounted.current) return;
      setStatus(pending ? "saving" : "saved");
      if (pending) void flush();
    } catch {
      dirtyValues.current = { ...valuesPatch, ...dirtyValues.current };
      dirtyStrikes.current = { ...strikesPatch, ...dirtyStrikes.current };
      if (titlePatch != null && dirtyTitle.current == null) dirtyTitle.current = titlePatch;
      if (mounted.current) setStatus("error");
    }
  }, [props.saveUrl]);

  const schedule = useCallback(() => {
    if (!props.saveUrl) return;
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void flush();
    }, 450);
  }, [flush, props.saveUrl]);

  useEffect(() => {
    const onLeave = () => {
      if (timer.current) clearTimeout(timer.current);
      void flush();
    };
    window.addEventListener("pagehide", onLeave);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      if (timer.current) clearTimeout(timer.current);
      void flush();
    };
  }, [flush]);

  const setValue = useCallback(
    (id: string, value: string) => {
      if (!canEditField(id)) return;
      setValues((current) => ({ ...current, [id]: value }));
      dirtyValues.current[id] = value;
      schedule();
    },
    [canEditField, schedule],
  );

  const toggleStrike = useCallback(
    (id: string) => {
      if (props.actor !== "agent") return;
      setStrikes((current) => {
        const next = !current[id];
        dirtyStrikes.current[id] = next;
        return { ...current, [id]: next };
      });
      schedule();
    },
    [props.actor, schedule],
  );

  const editor = useMemo<EditorState>(
    () => ({
      actor: props.actor,
      templateSlug: props.templateSlug,
      values,
      strikes,
      fieldRoles: props.fieldRoles,
      setValue,
      toggleStrike,
      canEditField,
      canEditStrikes: props.actor === "agent",
    }),
    [props.actor, props.templateSlug, props.fieldRoles, values, strikes, setValue, toggleStrike, canEditField],
  );

  const mine = Object.values(props.fieldRoles).filter((role) => role === props.actor).length;

  async function copy(label: string, url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1400);
  }

  function printPdf() {
    document.title = title.trim() || "Agreement";
    if (timer.current) clearTimeout(timer.current);
    void flush();
    window.print();
  }

  const landlordUrl = origin && props.landlordToken ? `${origin}/p/${props.landlordToken}` : "";
  const tenantUrl = origin && props.tenantToken ? `${origin}/p/${props.tenantToken}` : "";

  return (
    <EditorProvider value={editor}>
      <div className="no-print editor-screen">
        <div className="editor-bar">
          <div className="editor-title-row">
            {props.actor === "agent" ? (
              <a className="back" href="/">
                Agreements
              </a>
            ) : (
              <span className="party-flag">
                {props.actor === "landlord" ? "業主 Landlord link" : "租客 Tenant link"}
              </span>
            )}
            {props.actor === "agent" ? (
              <input
                className="title-input"
                value={title}
                aria-label="Agreement title"
                maxLength={200}
                onChange={(event) => {
                  setTitle(event.target.value);
                  dirtyTitle.current = event.target.value;
                  schedule();
                }}
              />
            ) : (
              <strong className="party-title">{props.subtitle}</strong>
            )}
            <span className={`save-state save-${status}`}>
              {status === "saving" && "Saving…"}
              {status === "saved" && "Saved"}
              {status === "error" && "Not saved"}
              {status === "idle" && "Preview"}
            </span>
          </div>
          <div className="editor-actions">
            <div className="seg">
              <button type="button" className={view === "form" ? "on" : ""} onClick={() => setView("form")}>
                Form
              </button>
              <button type="button" className={view === "document" ? "on" : ""} onClick={() => setView("document")}>
                Document
              </button>
            </div>
            {view === "document" && (
              <button type="button" className="btn" onClick={() => setFitWidth((value) => !value)}>
                {fitWidth ? "Full size" : "Fit size"}
              </button>
            )}
            {props.actor === "agent" &&(<button type="button" className="btn primary" onClick={printPdf}>
              Export PDF
            </button>)}
            {props.actor === "agent" && props.agreementId && (
              <button type="button" className="btn danger" onClick={() => setConfirmDelete(true)}>
                Delete
              </button>
            )}
          </div>
          {props.actor === "agent" && (
            <div className="legend">
              <span className="role-pill role-agent">Agent</span>
              <span className="role-pill role-landlord">Landlord</span>
              <span className="role-pill role-tenant">Tenant</span>
              <a href={`/templates/${props.templateSlug}`}>Edit field roles</a>
            </div>
          )}
        </div>

        {props.actor === "agent" && landlordUrl && tenantUrl && (
          <div className="share-box">
            <ShareRow label="Landlord" url={landlordUrl} copied={copied === "Landlord"} onCopy={() => copy("Landlord", landlordUrl)} />
            <ShareRow label="Tenant" url={tenantUrl} copied={copied === "Tenant"} onCopy={() => copy("Tenant", tenantUrl)} />
          </div>
        )}

        {view === "form" ? (
          <MobileForm />
        ) : props.templateSlug === "provisional-tenancy" ? (
          <ScaledDoc fitWidth={fitWidth}>
            <TenancyDocument mode="edit" />
          </ScaledDoc>
        ) : (
          <MobileForm />
        )}
      </div>

      <div className="print-root" aria-hidden="true">
        {props.templateSlug === "provisional-tenancy" && <TenancyDocument mode="print" />}
      </div>

      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h3>Delete this agreement?</h3>
            <p>The landlord and tenant links stop working. This is not reversible.</p>
            <div className="modal-actions">
              <button type="button" className="btn" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn danger"
                disabled={pendingDelete}
                onClick={() => {
                  if (!props.agreementId) return;
                  startDelete(() => {
                    void deleteAgreementAction(props.agreementId!);
                  });
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </EditorProvider>
  );
}

function ShareRow({
  label,
  url,
  copied,
  onCopy,
}: {
  label: string;
  url: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="share-row">
      <span>{label}</span>
      <code>{url}</code>
      <button type="button" className="btn" onClick={onCopy}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
