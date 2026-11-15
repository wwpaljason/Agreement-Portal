export type Role = "agent" | "landlord" | "tenant";

export type FieldDef = {
  id: string;
  labelZh: string;
  labelEn: string;
  defaultRole: Role;
};

export type StrikeOption = {
  id: string;
  zh: string;
  en: string;
};

export type StrikeGroup = {
  id: string;
  labelZh: string;
  labelEn: string;
  options: StrikeOption[];
};

export type SectionDef = {
  id: string;
  zh: string;
  en: string;
  fields: FieldDef[];
  strikes?: StrikeGroup[];
};

export type TemplateDef = {
  slug: string;
  nameZh: string;
  nameEn: string;
  description: string;
  pages: number;
  sections: SectionDef[];
};
