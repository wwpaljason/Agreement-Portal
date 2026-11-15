"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Role } from "@/lib/templates/types";

export type EditorState = {
  actor: "agent" | "landlord" | "tenant";
  templateSlug: string;
  values: Record<string, string>;
  strikes: Record<string, boolean>;
  fieldRoles: Record<string, Role>;
  setValue: (id: string, value: string) => void;
  toggleStrike: (id: string) => void;
  canEditField: (id: string) => boolean;
  canEditStrikes: boolean;
};

const EditorContext = createContext<EditorState | null>(null);
const ModeContext = createContext<"edit" | "print">("edit");

export function EditorProvider({ value, children }: { value: EditorState; children: ReactNode }) {
  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function ModeProvider({ mode, children }: { mode: "edit" | "print"; children: ReactNode }) {
  return <ModeContext.Provider value={mode}>{children}</ModeContext.Provider>;
}

export function useEditor() {
  const value = useContext(EditorContext);
  if (!value) throw new Error("Editor context missing");
  return value;
}

export function useDocMode() {
  return useContext(ModeContext);
}
