import type { Role, TemplateDef } from "./types";

const agent = "agent" as const satisfies Role;
const landlord = "landlord" as const satisfies Role;
const tenant = "tenant" as const satisfies Role;

export const F = {
  agreementDate: "agreementDate",
  landlordName: "landlordName",
  landlordHkid: "landlordHkid",
  landlordBr: "landlordBr",
  landlordAddress1: "landlordAddress1",
  landlordAddress2: "landlordAddress2",
  tenantName: "tenantName",
  tenantHkid: "tenantHkid",
  tenantBr: "tenantBr",
  tenantAddress1: "tenantAddress1",
  tenantAddress2: "tenantAddress2",
  agentName: "agentName",
  agentBr: "agentBr",
  agentLicence: "agentLicence",
  agentAddress: "agentAddress",
  premisesAddress: "premisesAddress",
  tenancyStart: "tenancyStart",
  tenancyEnd: "tenancyEnd",
  breakFixedMonths: "breakFixedMonths",
  breakNoticeMonths: "breakNoticeMonths",
  breakLieuMonths: "breakLieuMonths",
  minimumTenancyMonths: "minimumTenancyMonths",
  inclusiveNoticeMonths: "inclusiveNoticeMonths",
  monthlyRent: "monthlyRent",
  rentFreeDays: "rentFreeDays",
  rentFreeStart: "rentFreeStart",
  rentFreeEnd: "rentFreeEnd",
  initialDeposit: "initialDeposit",
  depositBalance: "depositBalance",
  advanceRent: "advanceRent",
  formalSigningLocation: "formalSigningLocation",
  formalSigningDate: "formalSigningDate",
  permittedUse: "permittedUse",
  landlordCommission: "landlordCommission",
  tenantCommission: "tenantCommission",
  agentCompensation: "agentCompensation",
  remarks1: "remarks1",
  remarks2: "remarks2",
  remarks3: "remarks3",
  signatoryLandlordName: "signatoryLandlordName",
  signatoryLandlordId: "signatoryLandlordId",
  signatoryAgentName: "signatoryAgentName",
  signatoryAgentLicence: "signatoryAgentLicence",
  signatoryTenantName: "signatoryTenantName",
  signatoryTenantId: "signatoryTenantId",
  receiptDeposit: "receiptDeposit",
  chequeNumber: "chequeNumber",
  bankName: "bankName",
  receiptLandlordName: "receiptLandlordName",
  receiptLandlordId: "receiptLandlordId",
} as const;

export const S = {
  breakWhoLandlord: "strike.breakWho.landlord",
  breakWhoTenant: "strike.breakWho.tenant",
  breakWhoEither: "strike.breakWho.either",
  breakNoticeLandlord: "strike.breakNotice.landlord",
  breakNoticeTenant: "strike.breakNotice.tenant",
  breakNoticeEither: "strike.breakNotice.either",
  rentRatesInclusive: "strike.rentRates.inclusive",
  rentRatesExclusive: "strike.rentRates.exclusive",
  rentFreeLandlord: "strike.rentFree.landlord",
  rentFreeTenant: "strike.rentFree.tenant",
  appointmentBoth: "strike.appointment.both",
  appointmentLandlord: "strike.appointment.landlord",
  appointmentTenant: "strike.appointment.tenant",
  landlordIdHkid: "strike.landlordId.hkid",
  landlordIdBr: "strike.landlordId.br",
  tenantIdHkid: "strike.tenantId.hkid",
  tenantIdBr: "strike.tenantId.br",
} as const;

function field(
  id: string,
  labelZh: string,
  labelEn: string,
  defaultRole: Role,
) {
  return { id, labelZh, labelEn, defaultRole };
}

export const provisionalTenancy: TemplateDef = {
  slug: "provisional-tenancy",
  nameZh: "臨時租約",
  nameEn: "Provisional Tenancy Agreement",
  description:
    "Two-page A4 provisional tenancy agreement. Long answers stay on those two pages when exported.",
  pages: 2,
  sections: [
    {
      id: "date",
      zh: "日期",
      en: "Date",
      fields: [field(F.agreementDate, "合約日期", "Agreement date", agent)],
    },
    {
      id: "landlord",
      zh: "業主",
      en: "Landlord",
      fields: [
        field(F.landlordName, "業主姓名", "Landlord name", landlord),
        field(F.landlordHkid, "業主身份證號碼", "Landlord HKID", agent),
        field(F.landlordBr, "業主商業登記證號碼", "Landlord BR number", agent),
        field(F.landlordAddress1, "業主地址（第一行）", "Landlord address line 1", landlord),
        field(F.landlordAddress2, "業主地址（第二行）", "Landlord address line 2", landlord),
      ],
      strikes: [
        {
          id: "landlordId",
          labelZh: "持有香港身份證 / 商業登記證號碼",
          labelEn: "Hong Kong Identity Card or Business Registration",
          options: [
            { id: S.landlordIdHkid, zh: "香港身份證", en: "Hong Kong Identity Card No." },
            { id: S.landlordIdBr, zh: "商業登記證號碼", en: "Business Registration No." },
          ],
        },
      ],
    },
    {
      id: "tenant",
      zh: "租客",
      en: "Tenant",
      fields: [
        field(F.tenantName, "租客姓名", "Tenant name", tenant),
        field(F.tenantHkid, "租客身份證號碼", "Tenant HKID", agent),
        field(F.tenantBr, "租客商業登記證號碼", "Tenant BR number", agent),
        field(F.tenantAddress1, "租客地址（第一行）", "Tenant address line 1", tenant),
        field(F.tenantAddress2, "租客地址（第二行）", "Tenant address line 2", tenant),
      ],
      strikes: [
        {
          id: "tenantId",
          labelZh: "持有香港身份證 / 商業登記證號碼",
          labelEn: "Hong Kong Identity Card or Business Registration",
          options: [
            { id: S.tenantIdHkid, zh: "香港身份證", en: "Hong Kong Identity Card No." },
            { id: S.tenantIdBr, zh: "商業登記證號碼", en: "Business Registration No." },
          ],
        },
      ],
    },
    {
      id: "agent",
      zh: "代理",
      en: "Agent",
      fields: [
        field(F.agentName, "代理名稱", "Agent name", agent),
        field(F.agentBr, "代理商業登記證號碼", "Agent BR number", agent),
        field(F.agentLicence, "地產代理牌照號碼", "Estate agent licence number", agent),
        field(F.agentAddress, "代理註冊地址", "Agent registered address", agent),
      ],
    },
    {
      id: "premises",
      zh: "物業",
      en: "Premises",
      fields: [field(F.premisesAddress, "物業地址", "Premises address", agent)],
    },
    {
      id: "term",
      zh: "租期及退租權",
      en: "Term and break clause",
      fields: [
        field(F.tenancyStart, "租期開始", "Tenancy start", agent),
        field(F.tenancyEnd, "租期結束", "Tenancy end", agent),
        field(F.breakFixedMonths, "住滿月數", "Months before break right", agent),
        field(F.breakNoticeMonths, "書面通知月數", "Notice months", agent),
        field(F.breakLieuMonths, "代通知金月數", "Months in lieu", agent),
        field(F.minimumTenancyMonths, "最短租期月數", "Minimum tenancy months", agent),
        field(F.inclusiveNoticeMonths, "包括通知期月數", "Inclusive notice months", agent),
      ],
      strikes: [
        {
          id: "breakWho",
          labelZh: "住滿後誰可提早終止",
          labelEn: "Who may break after the fixed months",
          options: [
            { id: S.breakWhoLandlord, zh: "業主", en: "the Landlord" },
            { id: S.breakWhoTenant, zh: "租客", en: "the Tenant" },
            { id: S.breakWhoEither, zh: "業主或租客", en: "either the Landlord or the Tenant" },
          ],
        },
        {
          id: "breakNotice",
          labelZh: "書面通知發給誰",
          labelEn: "Who receives the break notice",
          options: [
            { id: S.breakNoticeLandlord, zh: "業主", en: "the Landlord" },
            { id: S.breakNoticeTenant, zh: "租客", en: "the Tenant" },
            { id: S.breakNoticeEither, zh: "業主或租客", en: "the Landlord or the Tenant" },
          ],
        },
      ],
    },
    {
      id: "rent",
      zh: "租金及免租期",
      en: "Rent and rent-free period",
      fields: [
        field(F.monthlyRent, "每月租金（港幣）", "Monthly rent HK$", agent),
        field(F.rentFreeDays, "免租期日數", "Rent-free days", agent),
        field(F.rentFreeStart, "免租期開始", "Rent-free start", agent),
        field(F.rentFreeEnd, "免租期結束", "Rent-free end", agent),
      ],
      strikes: [
        {
          id: "rentRates",
          labelZh: "租金是否包括差餉、管理費及地租",
          labelEn: "Rent inclusive or exclusive of rates and fees",
          options: [
            { id: S.rentRatesInclusive, zh: "包括", en: "inclusive" },
            { id: S.rentRatesExclusive, zh: "不包括", en: "exclusive" },
          ],
        },
        {
          id: "rentFreePayer",
          labelZh: "免租期內誰支付差餉、管理費及地租",
          labelEn: "Who pays rates and fees during the rent-free period",
          options: [
            { id: S.rentFreeLandlord, zh: "業主", en: "the Landlord" },
            { id: S.rentFreeTenant, zh: "租客", en: "the Tenant" },
          ],
        },
      ],
    },
    {
      id: "deposit",
      zh: "訂金、按金及正式租約",
      en: "Deposits and formal agreement",
      fields: [
        field(F.initialDeposit, "臨時訂金（港幣）", "Initial deposit HK$", agent),
        field(F.depositBalance, "按金餘額（港幣）", "Deposit balance HK$", agent),
        field(F.advanceRent, "上期租金（港幣）", "Advance rent HK$", agent),
        field(F.formalSigningLocation, "簽署正式租約地點", "Formal signing location", agent),
        field(F.formalSigningDate, "簽署正式租約日期", "Formal signing date", agent),
      ],
    },
    {
      id: "use",
      zh: "用途",
      en: "Use",
      fields: [field(F.permittedUse, "准許用途", "Permitted use", agent)],
    },
    {
      id: "commission",
      zh: "佣金及賠償",
      en: "Commission and compensation",
      fields: [
        field(F.landlordCommission, "向業主收取佣金（港幣）", "Commission from landlord HK$", agent),
        field(F.tenantCommission, "向租客收取佣金（港幣）", "Commission from tenant HK$", agent),
        field(F.agentCompensation, "悔約賠償代理（港幣）", "Compensation to agent HK$", agent),
      ],
    },
    {
      id: "appointment",
      zh: "委任代理",
      en: "Appointment",
      fields: [],
      strikes: [
        {
          id: "appointment",
          labelZh: "代理身份（刪去不適用）",
          labelEn: "The agent acts for",
          options: [
            { id: S.appointmentBoth, zh: "雙方代理", en: "both the Landlord and the Tenant" },
            { id: S.appointmentLandlord, zh: "只是業主代理", en: "the Landlord only" },
            { id: S.appointmentTenant, zh: "只是租客代理", en: "the Tenant only" },
          ],
        },
      ],
    },
    {
      id: "remarks",
      zh: "備註",
      en: "Remarks",
      fields: [
        field(F.remarks1, "備註第 1 行", "Remarks line 1", agent),
        field(F.remarks2, "備註第 2 行", "Remarks line 2", agent),
        field(F.remarks3, "備註第 3 行", "Remarks line 3", agent),
      ],
    },
    {
      id: "signatures",
      zh: "簽署",
      en: "Signatures",
      fields: [
        field(F.signatoryLandlordName, "業主簽署姓名", "Signatory landlord name", landlord),
        field(F.signatoryLandlordId, "業主簽署身份證號碼", "Signatory landlord ID", agent),
        field(F.signatoryAgentName, "代理簽署姓名", "Signatory agent name", agent),
        field(F.signatoryAgentLicence, "代理簽署牌照號碼", "Signatory agent licence", agent),
        field(F.signatoryTenantName, "租客簽署姓名", "Signatory tenant name", tenant),
        field(F.signatoryTenantId, "租客簽署身份證號碼", "Signatory tenant ID", agent),
      ],
    },
    {
      id: "receipt",
      zh: "訂金收據",
      en: "Deposit receipt",
      fields: [
        field(F.receiptDeposit, "收據訂金金額", "Receipt deposit amount", agent),
        field(F.chequeNumber, "支票號碼", "Cheque number", agent),
        field(F.bankName, "銀行", "Bank", agent),
        field(F.receiptLandlordName, "業主簽收姓名", "Receipt landlord name", landlord),
        field(F.receiptLandlordId, "業主簽收身份證號碼", "Receipt landlord ID", agent),
      ],
    },
  ],
};
