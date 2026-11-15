import type { Role, SectionDef, TemplateDef } from "./types";

const agent = "agent" as const satisfies Role;
const landlord = "landlord" as const satisfies Role;
const tenant = "tenant" as const satisfies Role;

export const F = {
  refNo: "refNo",
  agreementDateEn: "agreementDateEn",
  agreementYear: "agreementYear",
  agreementMonth: "agreementMonth",
  agreementDay: "agreementDay",
  rentDueDay: "rentDueDay",
  premisesAddress: "premisesAddress",
  landlordName: "landlordName",
  landlordTel: "landlordTel",
  landlordAddress: "landlordAddress",
  tenantName: "tenantName",
  tenantTel: "tenantTel",
  tenantAddress: "tenantAddress",
  termFromYear: "termFromYear",
  termFromMonth: "termFromMonth",
  termFromDay: "termFromDay",
  termToYear: "termToYear",
  termToMonth: "termToMonth",
  termToDay: "termToDay",
  monthlyRent: "monthlyRent",
  depositWan: "depositWan",
  depositQian: "depositQian",
  depositBai: "depositBai",
  depositShi: "depositShi",
  rentFreeDays: "rentFreeDays",
  rentFreeFrom: "rentFreeFrom",
  rentFreeTo: "rentFreeTo",
  breakNoticeMonths: "breakNoticeMonths",
  breakLieuMonths: "breakLieuMonths",
  breakLockMonths: "breakLockMonths",
  furnLivingOther: "furnLivingOther",
  furnKitchenOther: "furnKitchenOther",
  furnMasterOther: "furnMasterOther",
  furnBed2Other: "furnBed2Other",
  furnMasterBathOther: "furnMasterBathOther",
  furnBed3Other: "furnBed3Other",
  furnBathOther: "furnBathOther",
  rentAccount: "rentAccount",
  remarks: "remarks",
  depositReceived: "depositReceived",
  keysReceived: "keysReceived",
  landlordSignId: "landlordSignId",
  tenantSignId: "tenantSignId",
} as const;

export const S = {
  useResidential: "check.use.residential",
  useCommercial: "check.use.commercial",
  useOffice: "check.use.office",
  useShop: "check.use.shop",
  useIndustrial: "check.use.industrial",
  feeMgmtLandlord: "strike.fee.mgmt.landlord",
  feeMgmtTenant: "strike.fee.mgmt.tenant",
  feeRatesLandlord: "strike.fee.rates.landlord",
  feeRatesTenant: "strike.fee.rates.tenant",
  feeGovRentLandlord: "strike.fee.govRent.landlord",
  feeGovRentTenant: "strike.fee.govRent.tenant",
  breakWhoLandlord: "strike.breakWho.landlord",
  breakWhoTenant: "strike.breakWho.tenant",
  breakWhoEither: "strike.breakWho.either",
  breakPayLandlord: "strike.breakPay.landlord",
  breakPayTenant: "strike.breakPay.tenant",
  breakPayOther: "strike.breakPay.other",
} as const;

export type FurnitureItem = { id: string; en: string; zh: string };

export type FurnitureRoom = {
  id: string;
  en: string;
  zh: string;
  otherId: string;
  items: FurnitureItem[];
};

export function furnitureCheckId(roomId: string, itemId: string) {
  return `check.furn.${roomId}.${itemId}`;
}

export const furnitureRooms: FurnitureRoom[] = [
  {
    id: "living",
    en: "Living Room & Dining Room",
    zh: "客廳及飯廳",
    otherId: F.furnLivingOther,
    items: [
      { id: "ac", en: "Air-conditioner(s)", zh: "冷氣機" },
      { id: "curtain", en: "Curtain With Rails(s)", zh: "窗簾連架" },
      { id: "lamp", en: "Ceiling Lamp(s)", zh: "天花燈" },
      { id: "tv", en: "TV", zh: "電視機" },
      { id: "chair", en: "Dining Chair", zh: "餐椅" },
      { id: "table", en: "Dining Table", zh: "餐桌" },
    ],
  },
  {
    id: "kitchen",
    en: "Kitchen",
    zh: "廚房",
    otherId: F.furnKitchenOther,
    items: [
      { id: "fan", en: "Ventilation Fan", zh: "抽氣扇" },
      { id: "cooker", en: "Cooker / oven", zh: "煮食爐" },
      { id: "cabinet", en: "Wall Unit Cabinet", zh: "廚櫃" },
      { id: "hood", en: "Range Hood", zh: "抽油煙機" },
      { id: "microwave", en: "Microwave", zh: "微波爐" },
      { id: "fridge", en: "Refrigerator", zh: "雪櫃" },
      { id: "washer", en: "Wash-machine", zh: "洗衣機" },
      { id: "dryer", en: "Drying Machine", zh: "乾衣機" },
    ],
  },
  {
    id: "master",
    en: "Master Bedroom",
    zh: "主人房",
    otherId: F.furnMasterOther,
    items: [
      { id: "ac", en: "Air-conditioner(s)", zh: "冷氣機" },
      { id: "curtain", en: "Curtain With Rails(s)", zh: "窗簾連架" },
      { id: "lamp", en: "Ceiling Lamp(s)", zh: "天花燈" },
      { id: "wardrobe", en: "Wardrobe", zh: "衣櫃" },
      { id: "bed", en: "Double Bed", zh: "雙人床" },
    ],
  },
  {
    id: "bed2",
    en: "No.2 Bedroom",
    zh: "第二間房",
    otherId: F.furnBed2Other,
    items: [
      { id: "ac", en: "Air-conditioner(s)", zh: "冷氣機" },
      { id: "curtain", en: "Curtain With Rails(s)", zh: "窗簾連架" },
      { id: "lamp", en: "Ceiling Lamp(s)", zh: "天花燈" },
      { id: "wardrobe", en: "Wardrobe", zh: "衣櫃" },
      { id: "bed", en: "Double/Single Bed", zh: "單雙人床" },
    ],
  },
  {
    id: "masterBath",
    en: "Bathroom (Master Room)",
    zh: "浴室（主人房）",
    otherId: F.furnMasterBathOther,
    items: [
      { id: "heater", en: "Water Heater", zh: "熱水爐" },
      { id: "fan", en: "Ventilation Fan", zh: "抽氣扇" },
      { id: "mirror", en: "Mirror Box", zh: "鏡箱" },
    ],
  },
  {
    id: "bed3",
    en: "No.3 Bedroom",
    zh: "第三間房",
    otherId: F.furnBed3Other,
    items: [
      { id: "ac", en: "Air-conditioner(s)", zh: "冷氣機" },
      { id: "curtain", en: "Curtain With Rails(s)", zh: "窗簾連架" },
      { id: "lamp", en: "Ceiling Lamp(s)", zh: "天花燈" },
      { id: "wardrobe", en: "Wardrobe", zh: "衣櫃" },
      { id: "bed", en: "Double/Single Bed", zh: "單雙人床" },
    ],
  },
  {
    id: "bath",
    en: "Bathroom",
    zh: "浴室",
    otherId: F.furnBathOther,
    items: [
      { id: "heater", en: "Water Heater", zh: "熱水爐" },
      { id: "fan", en: "Ventilation Fan", zh: "抽氣扇" },
      { id: "mirror", en: "Mirror Box", zh: "鏡箱" },
    ],
  },
];

export const furnitureLeft = ["living", "master", "masterBath", "bath"] as const;
export const furnitureRight = ["kitchen", "bed2", "bed3"] as const;

function field(id: string, labelZh: string, labelEn: string, defaultRole: Role) {
  return { id, labelZh, labelEn, defaultRole };
}

function roomSection(room: FurnitureRoom): SectionDef {
  return {
    id: `furn-${room.id}`,
    zh: room.zh,
    en: room.en,
    fields: [field(room.otherId, `${room.zh}其他`, `${room.en} — other`, agent)],
    strikes: [
      {
        id: `furn-${room.id}`,
        kind: "check",
        labelZh: "包括的傢俬及設備",
        labelEn: "Furniture and fittings included",
        options: room.items.map((item) => ({
          id: furnitureCheckId(room.id, item.id),
          zh: item.zh,
          en: item.en,
        })),
      },
    ],
  };
}

export const tenancyAgreement: TemplateDef = {
  slug: "tenancy-agreement",
  nameZh: "租約",
  nameEn: "Tenancy Agreement",
  description: "Four-page A4 tenancy agreement. Schedules, break clause, and furniture inventory stay on those pages when exported.",
  pages: 4,
  sections: [
    {
      id: "date",
      zh: "編號及訂立日期",
      en: "Reference and date",
      fields: [
        field(F.refNo, "編號", "Ref. no.", agent),
        field(F.agreementDateEn, "英文訂立日期", "Agreement date (English)", agent),
        field(F.agreementYear, "訂立年份", "Agreement year", agent),
        field(F.agreementMonth, "訂立月份", "Agreement month", agent),
        field(F.agreementDay, "訂立日子", "Agreement day", agent),
      ],
    },
    {
      id: "rent-day",
      zh: "交租日",
      en: "Rent due day",
      fields: [field(F.rentDueDay, "每月交租日", "Day of month rent is paid", agent)],
    },
    {
      id: "schedule-parties",
      zh: "附表一 · 物業及雙方",
      en: "Schedule I · Premises and parties",
      fields: [
        field(F.premisesAddress, "物業地址", "Premises", agent),
        field(F.landlordName, "業主姓名", "Landlord name", landlord),
        field(F.landlordTel, "業主電話", "Landlord telephone", landlord),
        field(F.landlordAddress, "業主地址", "Landlord address", landlord),
        field(F.tenantName, "租客姓名", "Tenant name", tenant),
        field(F.tenantTel, "租客電話", "Tenant telephone", tenant),
        field(F.tenantAddress, "租客地址", "Tenant address", tenant),
      ],
    },
    {
      id: "schedule-term",
      zh: "附表一 · 租期、租金、保證金",
      en: "Schedule I · Term, rent and deposit",
      fields: [
        field(F.termFromYear, "租期開始年", "Term start year", agent),
        field(F.termFromMonth, "租期開始月", "Term start month", agent),
        field(F.termFromDay, "租期開始日", "Term start day", agent),
        field(F.termToYear, "租期結束年", "Term end year", agent),
        field(F.termToMonth, "租期結束月", "Term end month", agent),
        field(F.termToDay, "租期結束日", "Term end day", agent),
        field(F.monthlyRent, "每月租金（港幣）", "Monthly rent HK$", agent),
        field(F.depositWan, "保證金（萬）", "Deposit — 萬", agent),
        field(F.depositQian, "保證金（千）", "Deposit — 千", agent),
        field(F.depositBai, "保證金（百）", "Deposit — 百", agent),
        field(F.depositShi, "保證金（拾）", "Deposit — 拾", agent),
      ],
    },
    {
      id: "use",
      zh: "附表二 · 用途",
      en: "Schedule II · Use",
      fields: [],
      strikes: [
        {
          id: "use",
          kind: "check",
          exclusive: true,
          labelZh: "准許用途",
          labelEn: "Permitted use",
          options: [
            { id: S.useResidential, zh: "住宅", en: "Residential" },
            { id: S.useCommercial, zh: "商業", en: "Commercial" },
            { id: S.useOffice, zh: "辦公室", en: "Office" },
            { id: S.useShop, zh: "商店", en: "Shop" },
            { id: S.useIndustrial, zh: "工業", en: "Industrial" },
          ],
        },
      ],
    },
    {
      id: "fees",
      zh: "附表二 · 雜項費用",
      en: "Schedule II · Miscellaneous payments",
      fields: [],
      strikes: [
        {
          id: "feeMgmt",
          labelZh: "管理費由誰支付",
          labelEn: "Management fee paid by",
          options: [
            { id: S.feeMgmtLandlord, zh: "業主", en: "Landlord" },
            { id: S.feeMgmtTenant, zh: "租客", en: "Tenant" },
          ],
        },
        {
          id: "feeRates",
          labelZh: "差餉由誰支付",
          labelEn: "Government rates paid by",
          options: [
            { id: S.feeRatesLandlord, zh: "業主", en: "Landlord" },
            { id: S.feeRatesTenant, zh: "租客", en: "Tenant" },
          ],
        },
        {
          id: "feeGovRent",
          labelZh: "地租由誰支付",
          labelEn: "Government rent paid by",
          options: [
            { id: S.feeGovRentLandlord, zh: "業主", en: "Landlord" },
            { id: S.feeGovRentTenant, zh: "租客", en: "Tenant" },
          ],
        },
      ],
    },
    {
      id: "rent-free",
      zh: "附表二 · 免租期",
      en: "Schedule II · Rent-free period",
      fields: [
        field(F.rentFreeDays, "免租期日數", "Rent-free days", agent),
        field(F.rentFreeFrom, "免租期開始", "Rent-free from", agent),
        field(F.rentFreeTo, "免租期結束", "Rent-free to", agent),
      ],
    },
    {
      id: "break",
      zh: "退租權",
      en: "Break clause",
      fields: [
        field(F.breakNoticeMonths, "書面通知月數", "Notice months", agent),
        field(F.breakLieuMonths, "代通知金月數", "Months' rent in lieu", agent),
        field(F.breakLockMonths, "不得早於租期第幾個月", "Notice locked until month", agent),
      ],
      strikes: [
        {
          id: "breakWho",
          labelZh: "誰可提早終止",
          labelEn: "Who may break",
          options: [
            { id: S.breakWhoLandlord, zh: "業主", en: "Landlord" },
            { id: S.breakWhoTenant, zh: "租客", en: "Tenant" },
            { id: S.breakWhoEither, zh: "任何一方", en: "either party" },
          ],
        },
        {
          id: "breakPay",
          labelZh: "代通知金付給誰",
          labelEn: "Rent in lieu paid to",
          options: [
            { id: S.breakPayLandlord, zh: "業主", en: "Landlord" },
            { id: S.breakPayTenant, zh: "租客", en: "Tenant" },
            { id: S.breakPayOther, zh: "另一方", en: "other party" },
          ],
        },
      ],
    },
    ...furnitureRooms.map(roomSection),
    {
      id: "remarks",
      zh: "備註",
      en: "Remarks",
      fields: [
        field(F.rentAccount, "業主銀行戶口號碼", "Landlord account number", landlord),
        field(F.remarks, "備註第 2 項", "Remark 2", agent),
      ],
    },
    {
      id: "handover",
      zh: "保證金及鎖匙",
      en: "Deposit and keys received",
      fields: [
        field(F.depositReceived, "業主收到保證金（港幣）", "Security deposit received HK$", agent),
        field(F.keysReceived, "租客收到鎖匙數量", "Keys received", agent),
      ],
    },
    {
      id: "execution",
      zh: "簽署",
      en: "Execution",
      fields: [
        field(F.landlordSignId, "業主香港身份證 / 商業登記證號碼", "Landlord HKID / BR", agent),
        field(F.tenantSignId, "租客香港身份證 / 商業登記證號碼", "Tenant HKID / BR", agent),
      ],
    },
  ],
};
