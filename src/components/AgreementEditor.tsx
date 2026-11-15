"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import { deleteAgreementAction } from "@/app/actions";
import { getTemplate } from "@/lib/templates/registry";
import type { Role } from "@/lib/templates/types";
import { EditorProvider, type EditorState } from "./editor-context";
import { MobileForm } from "./MobileForm";
import { TenancyAgreementDocument } from "./tenancy-agreement/TenancyAgreementDocument";
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

const ScaledBody = memo(function ScaledBody({ children }: { children: ReactNode }) {
  return children;
});

type PinchAnchor = { docX: number; docY: number; clientX: number; clientY: number };

function touchSpan(touches: TouchList) {
  const a = touches[0];
  const b = touches[1];
  if (!a || !b) return 0;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function ScaledDoc({
  fitWidth,
  onFitWidth,
  pages,
  children,
}: {
  fitWidth: boolean;
  onFitWidth: (fitWidth: boolean) => void;
  pages: number;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [fitScale, setFitScale] = useState(1);
  const scaleRef = useRef(1);
  const fitScaleRef = useRef(1);
  const fitWidthRef = useRef(fitWidth);
  const manualRef = useRef(false);
  const pinchingRef = useRef(false);
  const anchorRef = useRef<PinchAnchor | null>(null);
  const onFitWidthRef = useRef(onFitWidth);
  onFitWidthRef.current = onFitWidth;

  const commitScale = useCallback((next: number) => {
    const clamped = Math.min(1, Math.max(fitScaleRef.current, next));
    scaleRef.current = clamped;
    setScale((current) => (Math.abs(current - clamped) < 0.0001 ? current : clamped));
    return clamped;
  }, []);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    document.documentElement.classList.add("doc-pinch");
    const measure = () => {
      const fit = Math.min(1, frame.clientWidth / PAGE_W);
      fitScaleRef.current = fit;
      setFitScale((current) => (Math.abs(current - fit) < 0.0001 ? current : fit));
      if (pinchingRef.current || manualRef.current) {
        commitScale(scaleRef.current);
        return;
      }
      commitScale(fitWidthRef.current ? fit : 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("doc-pinch");
    };
  }, [commitScale]);

  useLayoutEffect(() => {
    fitWidthRef.current = fitWidth;
    if (pinchingRef.current) return;
    manualRef.current = false;
    commitScale(fitWidth ? fitScaleRef.current : 1);
  }, [fitWidth, commitScale]);

  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    const scroller = scrollerRef.current;
    if (!anchor || !scroller || scale <= 0) return;
    anchorRef.current = null;
    const width = PAGE_W * scale;
    const rect = scroller.getBoundingClientRect();
    const localX = anchor.clientX - rect.left;
    if (width > scroller.clientWidth + 0.5) {
      scroller.scrollLeft = anchor.docX * scale - localX;
    } else {
      scroller.scrollLeft = 0;
    }
    const placed = scroller.getBoundingClientRect();
    const desiredTop = anchor.clientY - anchor.docY * scale;
    const delta = placed.top - desiredTop;
    if (Math.abs(delta) > 0.5) window.scrollBy(0, delta);
  }, [scale]);

  useEffect(() => {
    let startDist = 0;
    let startScale = 1;
    let listening = false;

    const finish = () => {
      if (listening) {
        document.removeEventListener("touchmove", onTouchMove);
        listening = false;
      }
      if (!pinchingRef.current) return;
      pinchingRef.current = false;
      startDist = 0;
      const fit = fitScaleRef.current;
      const current = scaleRef.current;
      if (1 - current <= 0.005) {
        manualRef.current = false;
        fitWidthRef.current = false;
        commitScale(1);
        onFitWidthRef.current(false);
        return;
      }
      if (Math.abs(current - fit) <= 0.005) {
        manualRef.current = false;
        fitWidthRef.current = true;
        commitScale(fit);
        onFitWidthRef.current(true);
        return;
      }
      manualRef.current = true;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length < 2 || startDist <= 0) return;
      event.preventDefault();
      const scroller = scrollerRef.current;
      const current = scaleRef.current;
      if (!scroller || current <= 0) return;
      const next = Math.min(1, Math.max(fitScaleRef.current, startScale * (touchSpan(event.touches) / startDist)));
      if (Math.abs(next - current) < 0.0005) return;
      const rect = scroller.getBoundingClientRect();
      const midX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      const midY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
      const width = PAGE_W * current;
      const visualLeft =
        width <= scroller.clientWidth + 0.5 ? (scroller.clientWidth - width) / 2 - scroller.scrollLeft : -scroller.scrollLeft;
      anchorRef.current = {
        docX: (midX - rect.left - visualLeft) / current,
        docY: (midY - rect.top) / current,
        clientX: midX,
        clientY: midY,
      };
      manualRef.current = true;
      commitScale(next);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 2) return;
      startDist = touchSpan(event.touches);
      startScale = scaleRef.current;
      pinchingRef.current = true;
      manualRef.current = true;
      if (listening) return;
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      listening = true;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (event.touches.length >= 2) return;
      finish();
    };

    const blockGesture = (event: Event) => {
      event.preventDefault();
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
    document.addEventListener("gesturestart", blockGesture, { passive: false, capture: true });
    document.addEventListener("gesturechange", blockGesture, { passive: false, capture: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
      document.removeEventListener("gesturestart", blockGesture, { capture: true });
      document.removeEventListener("gesturechange", blockGesture, { capture: true });
      if (listening) document.removeEventListener("touchmove", onTouchMove);
    };
  }, [commitScale]);

  const wider = scale > fitScale + 0.001;

  return (
    <div ref={frameRef} className="scale-frame">
      <div
        ref={scrollerRef}
        style={{
          height: (PAGE_H * pages + 18 * Math.max(0, pages - 1)) * scale,
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflowX: wider ? "auto" : "hidden",
          overflowY: "hidden",
          overscrollBehaviorX: "contain",
        }}
      >
        <div style={{ width: PAGE_W * scale, margin: "0 auto" }}>
          <div style={{ width: PAGE_W, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <ScaledBody>{children}</ScaledBody>
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
        const patch: Record<string, boolean> = { [id]: next };
        if (next) {
          const group = getTemplate(props.templateSlug)
            ?.sections.flatMap((section) => section.strikes ?? [])
            .find((item) => item.exclusive && item.options.some((option) => option.id === id));
          if (group) {
            for (const option of group.options) {
              if (option.id !== id) patch[option.id] = false;
            }
          }
        }
        Object.assign(dirtyStrikes.current, patch);
        return { ...current, ...patch };
      });
      schedule();
    },
    [props.actor, props.templateSlug, schedule],
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
  const pageCount = getTemplate(props.templateSlug)?.pages ?? 2;
  const visual =
    props.templateSlug === "provisional-tenancy" || props.templateSlug === "tenancy-agreement";

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
        ) : visual ? (
          <ScaledDoc fitWidth={fitWidth} onFitWidth={setFitWidth} pages={pageCount}>
            <TemplateDocument slug={props.templateSlug} mode="edit" />
          </ScaledDoc>
        ) : (
          <MobileForm />
        )}
      </div>

      <div className="print-root" aria-hidden="true">
        {visual && <TemplateDocument slug={props.templateSlug} mode="print" />}
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

function TemplateDocument({ slug, mode }: { slug: string; mode: "edit" | "print" }) {
  if (slug === "tenancy-agreement") return <TenancyAgreementDocument mode={mode} />;
  if (slug === "provisional-tenancy") return <TenancyDocument mode={mode} />;
  return null;
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
