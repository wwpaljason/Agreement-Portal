"use client";

import { useLayoutEffect, type RefObject } from "react";

const MAX_FONT_PX = 11.2;
const MIN_FONT_PX = 5.5;

let measureCtx: CanvasRenderingContext2D | null = null;

function measurer() {
  if (measureCtx) return measureCtx;
  const canvas = document.createElement("canvas");
  measureCtx = canvas.getContext("2d");
  return measureCtx;
}

export function fitInput(input: HTMLInputElement) {
  const value = input.value;
  if (!value) {
    input.style.fontSize = `${MAX_FONT_PX}px`;
    delete input.dataset.overflow;
    return;
  }

  const style = window.getComputedStyle(input);
  const available =
    input.clientWidth -
    (parseFloat(style.paddingLeft) || 0) -
    (parseFloat(style.paddingRight) || 0) -
    2;
  if (available <= 0) return;

  const ctx = measurer();
  if (!ctx) return;
  const family = style.fontFamily || "sans-serif";
  const weight = style.fontWeight || "500";
  let size = MAX_FONT_PX;
  ctx.font = `${weight} ${size}px ${family}`;
  const natural = ctx.measureText(value).width;
  if (natural > available) {
    size = Math.max(MIN_FONT_PX, Math.floor(size * (available / natural) * 10) / 10);
    ctx.font = `${weight} ${size}px ${family}`;
    while (size > MIN_FONT_PX && ctx.measureText(value).width > available) {
      size = Math.max(MIN_FONT_PX, Math.round((size - 0.3) * 10) / 10);
      ctx.font = `${weight} ${size}px ${family}`;
    }
  }

  input.style.fontSize = `${size}px`;
  const overflows = ctx.measureText(value).width > available + 0.5;
  if (overflows) input.dataset.overflow = "1";
  else delete input.dataset.overflow;
}

function fitPageContent(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".page-content").forEach((content) => {
    const fit = content.querySelector<HTMLElement>(":scope > .page-fit");
    if (!fit) return;
    fit.style.transform = "";
    fit.style.width = "";
    const available = content.clientHeight;
    if (available <= 0) return;
    const needed = fit.offsetHeight;
    if (needed <= available + 1) return;
    const scale = available / needed;
    fit.style.transformOrigin = "top left";
    fit.style.width = `${100 / scale}%`;
    fit.style.transform = `scale(${scale})`;
    const visual = fit.getBoundingClientRect().height;
    if (visual > available + 1) {
      const next = scale * (available / visual);
      fit.style.width = `${100 / next}%`;
      fit.style.transform = `scale(${next})`;
    }
  });
}

export function useFitInputs(rootRef: RefObject<HTMLElement | null>, watch: unknown) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const run = () => {
      fitPageContent(root);
      root.querySelectorAll<HTMLInputElement>("input.fill-input").forEach(fitInput);
    };
    run();
    const observer = new ResizeObserver(run);
    observer.observe(root);
    window.addEventListener("beforeprint", run);
    return () => {
      observer.disconnect();
      window.removeEventListener("beforeprint", run);
    };
  }, [rootRef, watch]);
}
