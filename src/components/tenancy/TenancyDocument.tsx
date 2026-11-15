"use client";

import { useRef, type ReactNode } from "react";
import { F, S } from "@/lib/templates/provisional-tenancy";
import { ModeProvider } from "../editor-context";
import { useEditor } from "../editor-context";
import { Fill, Opt } from "./fields";
import { useFitInputs } from "./fit-input";
import "./tenancy.css";

function Stack({ zh, en }: { zh: ReactNode; en: ReactNode }) {
  return (
    <span className="field-stack">
      <span className="zh-part">{zh}</span>
      <span className="en-part">{en}</span>
    </span>
  );
}

function Block({ zh, en }: { zh: ReactNode; en: ReactNode }) {
  return (
    <div className="bilingual-block">
      <div className="zh-line">{zh}</div>
      <div className="en-line">{en}</div>
    </div>
  );
}

function Copyright() {
  return (
    <div className="copyright-box">
{"WIN WIN PROPERTY AGENCY LIMITED"}
    </div>
  );
}

function Footer() {
  return (
    <footer className="page-footer">
      <span>* 刪去不適用者{"\u00a0\u00a0\u00a0\u00a0"}To be deleted where inapplicable</span>
      <span />
    </footer>
  );
}

export function TenancyDocument({ mode }: { mode: "edit" | "print" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { values, strikes } = useEditor();
  useFitInputs(rootRef, { values, strikes, mode });

  return (
    <ModeProvider mode={mode}>
      <div className="tenancy" ref={rootRef}>
        <section className="page">
          <div className="page-content">
            <div className="page-fit">
            <div className="top-meta-row">
              <Copyright />
            </div>
            <header className="doc-header">
              <h1>臨時租約</h1>
              <div className="en-title">PROVISIONAL TENANCY AGREEMENT</div>
            </header>
            <table className="agreement-grid">
              <tbody>
                <tr>
                  <td className="margin-label" />
                  <td className="main-body">
                    <div className="bilingual-row">
                      <Stack zh="此合約訂於" en="This AGREEMENT is made on" />
                      <Fill id={F.agreementDate} width="grow" />
                      <Stack zh={"\u00a0"} en="BETWEEN" />
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    業主
                    <br />
                    Landlord
                  </td>
                  <td className="main-body">
                    <div className="bilingual-row">
                      <Stack zh="合約第一方為" en="the first party" />
                      <Fill id={F.landlordName} width="grow" />
                      <Stack
                        zh={
                          <>
                            持有<Opt id={S.landlordIdHkid}>香港身份證</Opt> /
                          </>
                        }
                        en={
                          <>
                            (holder of <Opt id={S.landlordIdHkid}>Hong Kong Identity Card No.</Opt> /
                          </>
                        }
                      />
                      <Fill id={F.landlordHkid} width="md" />
                    </div>
                    <div className="bilingual-row">
                      <Stack
                        zh={<Opt id={S.landlordIdBr}>商業登記證號碼</Opt>}
                        en={<Opt id={S.landlordIdBr}>Business Registration No.</Opt>}
                      />
                      <Fill id={F.landlordBr} width="lg" />
                      <Stack zh="地址在" en=") of" />
                      <Fill id={F.landlordAddress1} width="grow" />
                    </div>
                    <div className="bilingual-row">
                      <Fill id={F.landlordAddress2} width="grow" />
                      <Stack zh={'以下稱 "業主"'} en={'(hereinafter called " the Landlord ") and;'} />
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    租客
                    <br />
                    Tenant
                  </td>
                  <td className="main-body">
                    <div className="bilingual-row">
                      <Stack zh="合約第二方為" en="the second party" />
                      <Fill id={F.tenantName} width="grow" />
                      <Stack
                        zh={
                          <>
                            持有<Opt id={S.tenantIdHkid}>香港身份證</Opt> /
                          </>
                        }
                        en={
                          <>
                            (holder of <Opt id={S.tenantIdHkid}>Hong Kong Identity Card No.</Opt> /
                          </>
                        }
                      />
                      <Fill id={F.tenantHkid} width="md" />
                    </div>
                    <div className="bilingual-row">
                      <Stack
                        zh={<Opt id={S.tenantIdBr}>商業登記證號碼</Opt>}
                        en={<Opt id={S.tenantIdBr}>Business Registration No.</Opt>}
                      />
                      <Fill id={F.tenantBr} width="lg" />
                      <Stack zh="地址在" en=") of" />
                      <Fill id={F.tenantAddress1} width="grow" />
                    </div>
                    <div className="bilingual-row">
                      <Fill id={F.tenantAddress2} width="grow" />
                      <Stack zh={'以下稱 "租客"'} en={'(hereinafter called " the Tenant ") and;'} />
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    代理
                    <br />
                    Agent
                  </td>
                  <td className="main-body">
                    <div className="bilingual-row">
                      <Stack zh="合約第三方為" en="the third party" />
                      <Fill id={F.agentName} width="grow" />
                    </div>
                    <div className="bilingual-row">
                      <Stack zh="持有商業登記證號碼" en="holder of Business Registration No." />
                      <Fill id={F.agentBr} width="md" />
                      <Stack zh="及持有地產代理(公司)牌照號碼" en="and holder of Estate Agent (Company) Licence No." />
                      <Fill id={F.agentLicence} width="grow" />
                    </div>
                    <div className="bilingual-row">
                      <Stack zh="註冊地址在" en="of" />
                      <Fill id={F.agentAddress} width="grow" />
                      <Stack zh={'以下稱 "代理"'} en={'(hereinafter called " the Agent ")'} />
                    </div>
                    <div style={{ marginTop: 2 }}>
                      <Block zh="合約三方茲同意租約條款如下：-" en="NOW IT IS HEREBY AGREED as follows:-" />
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    物業
                    <br />
                    Premises
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">1.</div>
                      <div className="clause-content">
                        <Block
                          zh="業主及租客雙方通過代理，同意以下列條款出租及租入"
                          en="The Landlord agrees to let and the Tenant agrees to take, through the Agent subject to the terms and conditions herein contained"
                        />
                        <div className="bilingual-row">
                          <Stack zh={"\u00a0"} en="all that" />
                          <Fill id={F.premisesAddress} width="grow" />
                          <Stack zh={'以下稱 "該物業"'} en={'(hereinafter called "the said Premises")'} />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    租期
                    <br />
                    Term of Tenancy
                    <br />
                    退租權
                    <br />
                    Break Clause
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">2.</div>
                      <div className="subclause-num">a) i)</div>
                      <div className="clause-content">
                        <div className="bilingual-row">
                          <Stack zh="租期由" en="The term of tenancy is from" />
                          <Fill id={F.tenancyStart} width="grow" />
                          <Stack zh="至" en="to" />
                          <Fill id={F.tenancyEnd} width="grow" />
                          <Stack zh="包括首尾日期" en="both days inclusive." />
                        </div>
                      </div>
                    </div>
                    <div className="clause-row">
                      <div className="clause-num" />
                      <div className="subclause-num">*ii)</div>
                      <div className="clause-content">
                        <div className="bilingual-row">
                          <Stack zh="租客住滿" en="After the first" />
                          <Fill id={F.breakFixedMonths} width="xs" />
                          <Stack
                            zh={
                              <>
                                個月後 *
                                <Opt id={S.breakWhoLandlord}>業主</Opt> / <Opt id={S.breakWhoTenant}>租客</Opt> /{" "}
                                <Opt id={S.breakWhoEither}>業主或租客</Opt>
                                有權提早終止租約
                              </>
                            }
                            en={
                              <>
                                months of the tenancy, *
                                <Opt id={S.breakWhoLandlord}>the Landlord</Opt> /{" "}
                                <Opt id={S.breakWhoTenant}>the Tenant</Opt> /{" "}
                                <Opt id={S.breakWhoEither}>either the Landlord or the Tenant</Opt> is entitled
                              </>
                            }
                          />
                        </div>
                        <div className="bilingual-row">
                          <Stack zh="唯必須以" en="To terminate the tenancy by serving a" />
                          <Fill id={F.breakNoticeMonths} width="xs" />
                          <Stack
                            zh={
                              <>
                                個月書面通知 *
                                <Opt id={S.breakNoticeLandlord}>業主</Opt> / <Opt id={S.breakNoticeTenant}>租客</Opt> /{" "}
                                <Opt id={S.breakNoticeEither}>業主或租客</Opt>
                              </>
                            }
                            en={
                              <>
                                {"months' prior notice in writing to *"}
                                <Opt id={S.breakNoticeLandlord}>the Landlord</Opt> /{" "}
                                <Opt id={S.breakNoticeTenant}>the Tenant</Opt> /{" "}
                                <Opt id={S.breakNoticeEither}>the Landlord or the Tenant</Opt>
                              </>
                            }
                          />
                        </div>
                        <div className="bilingual-row">
                          <Stack zh="或支付相當於" en="or by paying a sum equivalent to" />
                          <Fill id={F.breakLieuMonths} width="xs" />
                          <Stack
                            zh="個月租金之代通知金，唯租約期"
                            en="month's rental in lieu of the notice and the length of the tenancy in"
                          />
                        </div>
                        <div className="bilingual-row">
                          <Stack zh="在任何情況下不得少於" en="any event shall not be less than" />
                          <Fill id={F.minimumTenancyMonths} width="xs" />
                          <Stack zh="個月包括" en="months inclusive of" />
                          <Fill id={F.inclusiveNoticeMonths} width="xs" />
                          <Stack zh="個月書面通知期。" en="month's written notice." />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    每月租金
                    <br />
                    Monthly Rental
                    <br />
                    免租期
                    <br />
                    Rent Free Period
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num" />
                      <div className="subclause-num">b) i)</div>
                      <div className="clause-content">
                        <div className="bilingual-row">
                          <Stack zh="每個月租金為港幣" en="The monthly rent is HK$" />
                          <Fill id={F.monthlyRent} width="grow" />
                          <Stack
                            zh={
                              <>
                                (*
                                <Opt id={S.rentRatesInclusive}>包括</Opt> / <Opt id={S.rentRatesExclusive}>不包括</Opt>
                                差餉、管理費及地租) 須每月以上期方式繳付
                              </>
                            }
                            en={
                              <>
                                (*
                                <Opt id={S.rentRatesInclusive}>inclusive</Opt>/
                                <Opt id={S.rentRatesExclusive}>exclusive</Opt> of rates, management fees and government
                              </>
                            }
                          />
                        </div>
                        <div className="en-line" style={{ marginTop: -1, marginBottom: 1.5 }}>
                          rent) to be paid in advance.
                        </div>
                      </div>
                    </div>
                    <div className="clause-row">
                      <div className="clause-num" />
                      <div className="subclause-num">*ii)</div>
                      <div className="clause-content">
                        <div className="bilingual-row">
                          <Stack zh="免租期為" en="The rent free period is" />
                          <Fill id={F.rentFreeDays} width="sm" />
                          <Stack zh="天 由" en="day(s) from" />
                          <Fill id={F.rentFreeStart} width="grow" />
                          <Stack zh="至" en="to" />
                          <Fill id={F.rentFreeEnd} width="grow" />
                        </div>
                        <Block
                          zh={
                            <>
                              免租期內 *
                              <Opt id={S.rentFreeLandlord}>業主</Opt> / <Opt id={S.rentFreeTenant}>租客</Opt>
                              負責支付差餉、管理費及地租。
                            </>
                          }
                          en={
                            <>
                              During the rent free period, *<Opt id={S.rentFreeLandlord}>the Landlord</Opt> /{" "}
                              <Opt id={S.rentFreeTenant}>the Tenant</Opt> shall be responsible for paying rates,
                              management fees and government rent
                            </>
                          }
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    臨時訂金
                    <br />
                    Initial Deposit
                    <br />
                    按金
                    <br />
                    Deposit
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num" />
                      <div className="subclause-num">c) i)</div>
                      <div className="clause-content">
                        <div className="bilingual-row">
                          <Stack zh="臨時訂金港幣" en="An initial deposit of HK$" />
                          <Fill id={F.initialDeposit} width="grow" />
                          <Stack
                            zh="在簽署本合約時須由租客付清予業主"
                            en="shall be paid by the Tenant to the Landlord upon signing of this Agreement."
                          />
                        </div>
                      </div>
                    </div>
                    <div className="clause-row">
                      <div className="clause-num" />
                      <div className="subclause-num">ii)</div>
                      <div className="clause-content">
                        <div className="bilingual-row">
                          <Stack zh="按金餘額港幣" en="An further sum of HK$" />
                          <Fill id={F.depositBalance} width="grow" />
                          <Stack zh="連同一個月上期租金港幣" en="as the balance of deposit together with another sum of HK$" />
                          <Fill id={F.advanceRent} width="md" />
                        </div>
                        <Block
                          zh="須由租客在簽署正式租約時付清予業主而正式租約"
                          en="as one month's rental payment in advance shall be paid by the Tenant to the Landlord upon signing of the Formal"
                        />
                        <div className="bilingual-row">
                          <Stack zh="必須前往" en="Tenancy Agreement at" />
                          <Fill id={F.formalSigningLocation} width="grow" />
                          <Stack zh="及於" en="on or before" />
                          <Fill id={F.formalSigningDate} width="grow" />
                          <Stack zh="或之前簽署。" en={"\u00a0"} />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label" />
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">3.</div>
                      <div className="clause-content">
                        <Block
                          zh="業主及租客須平均支付正式租約之厘印費。"
                          en="The Landlord and the Tenant shall equally share the stamp duty of the Formal Tenancy Agreement."
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    用途
                    <br />
                    Use
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">4.</div>
                      <div className="clause-content">
                        <div className="bilingual-row">
                          <Stack zh="該物業除作為" en="The said Premises shall not be used for any purpose other than for" />
                          <Fill id={F.permittedUse} width="grow" />
                          <Stack zh="用途外，不得作其他用途。" en="purpose." />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    不得轉讓
                    <br />
                    Not to Assign
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">5.</div>
                      <div className="clause-content">
                        <Block
                          zh="租客在租期內不得將該物業或任何部分轉讓或分租或將其使用權交予他人。"
                          en="The Tenant shall not assign or sublet or part with possession of the said Premises or any part thereof during the term of tenancy."
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    雜費
                    <br />
                    Expenses
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">6.</div>
                      <div className="clause-content">
                        <Block
                          zh="交吉前有關該物業之所有雜費 (包括水、電、煤氣、差餉、管理費及地租) 由業主負責。"
                          en="Before delivery of vacant possession, all expenses of the said Premises (including water, electricity, gas charge, rates, management fees and government rent) shall be paid by the Landlord."
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    業主悔約
                    <br />
                    Landlord Fails
                    <br />
                    to Perform
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">7.</div>
                      <div className="clause-content">
                        <Block
                          zh="如業主在收取臨時訂金後，不依合約之條款將該物業租予租客，"
                          en="The Landlord after receiving the initial deposit paid hereunder fail to let the said Premises to the Tenant in the manner herein"
                        />
                        <Block
                          zh="則業主除須退還租客所付之臨時訂金全數外，並須以同等數目之金額賠償予租客，"
                          en="contained, the Landlord shall immediately compensate the Tenant with a refund of the initial deposit together with a sum"
                        />
                        <Block
                          zh="唯租客不得再向業主追究任何責任，包括其他賠償及申請強制執行令。"
                          en="equivalent to the amount of the initial deposit as liquidated damages and the Tenant shall not take any further action to claim for damages or to enforce specific performance."
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
          <Footer />
        </section>

        <section className="page">
          <div className="page-content">
            <div className="page-fit">
            <div className="top-meta-row" style={{ marginBottom: 4 }}>
              <Copyright />
            </div>
            <table className="agreement-grid">
              <tbody>
                <tr>
                  <td className="margin-label">
                    租客悔約
                    <br />
                    Tenant Fails to Perform
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">8.</div>
                      <div className="clause-content">
                        <Block
                          zh="如租客未能履行本合約之條款租入該物業，業主除將租客已付之臨時訂金沒收外，"
                          en="Should the Tenant fail to take up the tenancy of the said premises in the manner herein contained, the initial deposit shall be"
                        />
                        <Block
                          zh="並有權將該物業再行出租予他人，惟業主不可為此向租客追究任何責任或"
                          en="forfeited to the Landlord and the Landlord shall then be entitled at his absolute discretion to let the said premises to anyone he"
                        />
                        <Block
                          zh="要求任何賠償及申請強制執行令。"
                          en="thinks fit and the Landlord shall not sue the Tenant for any liabilities and / for damages or to enforce specific performance."
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    代理佣金
                    <br />
                    {"Agent's Commission"}
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">9.</div>
                      <div className="clause-content">
                        <div className="bilingual-row">
                          <Stack
                            zh="基於代理在促成該物業租賃中所提供之服務，代理有權向業主收取港幣"
                            en="In consideration of the service rendered by the Agent, the Agent shall be entitled to receive HK$"
                          />
                          <Fill id={F.landlordCommission} width="grow" />
                        </div>
                        <div className="bilingual-row">
                          <Stack zh="並向租方收取港幣" en="from the Landlord and HK$" />
                          <Fill id={F.tenantCommission} width="lg" />
                          <Stack
                            zh="作為佣金，該等佣金須於簽署正式租約"
                            en="from the Tenant as commission. Such commission shall be paid on or"
                          />
                        </div>
                        <Block zh="之時或之前繳付。" en="before the date of signing the Formal Tenancy Agreement." />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    代理之賠償
                    <br />
                    Compensation to Agent
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">10.</div>
                      <div className="subclause-num">a)</div>
                      <div className="clause-content">
                        <Block
                          zh="無論在任何情況下，若業主或租客未能履行本合約之條款租出或租入該物業，"
                          en="If in any case either the Landlord or the Tenant fails to let or take up the Tenancy of the said premises in the manner herein"
                        />
                        <div className="bilingual-row">
                          <Stack
                            zh="則悔約的一方須即時付予代理港幣"
                            en="contained, the defaulting party/parties shall compensate at once the Agent HK$"
                          />
                          <Fill id={F.agentCompensation} width="grow" />
                          <Stack zh="作為賠償代理之損失。" en="as liquidated damages." />
                        </div>
                      </div>
                    </div>
                    <div className="clause-row">
                      <div className="clause-num" />
                      <div className="subclause-num">b)</div>
                      <div className="clause-content">
                        <Block
                          zh="簽署合約後如業主及租客雙方未得代理同意而協議取消本合約，"
                          en="Should the Landlord and the Tenant after signing this Agreement, both agree to cancel this Agreement without the consent of"
                        />
                        <Block
                          zh="則雙方將同時及分別成為本合約之悔約者，"
                          en="the Agent, they will jointly and severally become the defaulting parties of this Agreement and will still be liable for the"
                        />
                        <Block zh="並仍須各自負責付予上述佣金。" en="payment of their own commission mentioned herein before." />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    委任代理
                    <br />
                    Appointment to Agent
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">*11.</div>
                      <div className="clause-content">
                        <Block
                          zh={
                            <>
                              茲聲明本合約之代理為
                              <Opt id={S.appointmentBoth}>雙方代理</Opt> / <Opt id={S.appointmentLandlord}>只是業主代理</Opt> /{" "}
                              <Opt id={S.appointmentTenant}>只是租客代理</Opt>。
                            </>
                          }
                          en={
                            <>
                              It is hereby declared that the Agent is the Agent{" "}
                              <Opt id={S.appointmentBoth}>for both the Landlord and the Tenant</Opt> /{" "}
                              <Opt id={S.appointmentLandlord}>for the Landlord only</Opt> /{" "}
                              <Opt id={S.appointmentTenant}>for the Tenant only</Opt>.
                            </>
                          }
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    責任
                    <br />
                    Liabilities
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">12.</div>
                      <div className="subclause-num">a)</div>
                      <div className="clause-content">
                        <Block
                          zh="如業主或租客是有限公司而不依本合約之條款租出或租入該物業，代表該"
                          en="Should the Landlord or the Tenant be a limited company which fails to let or take up the tenancy of the said Premises, the"
                        />
                        <Block
                          zh="有限公司簽署的人須負責支付及承擔代理應收之所有佣金。"
                          en="person(s) who signed this Agreement on behalf of the limited company shall be personally liable for all commission due to the Agent."
                        />
                      </div>
                    </div>
                    <div className="clause-row">
                      <div className="clause-num" />
                      <div className="subclause-num">b)</div>
                      <div className="clause-content">
                        <Block
                          zh="如本合約由業主或租客的代理人或授權人簽署，則代理人或授權人須承擔"
                          en="Should the signatory be donee(s) or attorney(s) of the Landlord / Tenant, the donee(s) or attorney(s) shall be personally"
                        />
                        <Block zh="本合約之所有責任。" en="liable for all the liabilities from this Agreement." />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    宣稱
                    <br />
                    Declaration
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">13.</div>
                      <div className="clause-content">
                        <Block
                          zh="業主宣稱其為該物業之唯一業主或業主已得其他聯名業主之同意。"
                          en="The Landlord declares that he/she is the sole registered owner of the said premises or otherwise he/she has the consent and approval of the other joint owner(s)."
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    過往談判
                    <br />
                    Prior Negotiations
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">14.</div>
                      <div className="clause-content">
                        <Block
                          zh="本合約取代三方過往所有之談判、或聲稱及理解。"
                          en="This Agreement supersedes all prior negotiations, representation and understanding of the parties hereto."
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    解釋
                    <br />
                    Interpretation
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">15.</div>
                      <div className="clause-content">
                        <Block
                          zh="如果本合約的中英文版本有衝突，本合約以中文為準。"
                          en="In case of conflict between the English & Chinese Version of this Agreement, the Chinese Version shall prevail."
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className="section-spacer">
                  <td className="margin-label">
                    備註
                    <br />
                    Remarks
                  </td>
                  <td className="main-body">
                    <div className="clause-row">
                      <div className="clause-num">16.</div>
                      <div className="clause-content">
                        <div className="remarks-lines">
                          <Fill id={F.remarks1} width="remark" />
                          <Fill id={F.remarks2} width="remark" />
                          <Fill id={F.remarks3} width="remark" />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="on-behalf-header">For and on behalf of</div>
            <table className="sig-table">
              <tbody>
                <tr>
                  <td>
                    <div className="sig-line-top">
                      業主簽署接受
                      <br />
                      Signed by the Landlord
                    </div>
                    <div className="sig-field">
                      <span className="lbl">姓名 Name :</span>
                      <Fill id={F.signatoryLandlordName} width="grow" />
                    </div>
                    <div className="sig-field">
                      <span className="lbl">身份證號碼 I.D.No.:</span>
                      <Fill id={F.signatoryLandlordId} width="grow" />
                    </div>
                  </td>
                  <td>
                    <div className="sig-line-top">
                      代理簽署接受
                      <br />
                      Signed by the Agent
                    </div>
                    <div className="sig-field">
                      <span className="lbl">姓名 Name :</span>
                      <Fill id={F.signatoryAgentName} width="grow" />
                    </div>
                    <div className="sig-field">
                      <span className="lbl">牌照號碼 Licence No.:</span>
                      <Fill id={F.signatoryAgentLicence} width="grow" />
                    </div>
                  </td>
                  <td>
                    <div className="sig-line-top">
                      租客簽署接受
                      <br />
                      Signed by the Tenant
                    </div>
                    <div className="sig-field">
                      <span className="lbl">姓名 Name :</span>
                      <Fill id={F.signatoryTenantName} width="grow" />
                    </div>
                    <div className="sig-field">
                      <span className="lbl">身份證號碼 I.D.No.:</span>
                      <Fill id={F.signatoryTenantId} width="grow" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="receipt-table">
              <tbody>
                <tr>
                  <td className="receipt-left">
                    <div className="bilingual-row" style={{ marginBottom: 0 }}>
                      <Stack zh="茲收到租客臨時訂金港幣" en="Received from the Tenant the initial deposit in sum of HK$" />
                      <Fill id={F.receiptDeposit} width="grow" />
                    </div>
                  </td>
                  <td className="receipt-right">
                    <div className="bilingual-row" style={{ marginBottom: 0 }}>
                      <Stack zh="業主簽收" en="Signed by the Landlord" />
                      <span className="wet-sign" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="receipt-left" style={{ paddingTop: 5 }}>
                    <div className="bilingual-row" style={{ marginBottom: 0 }}>
                      <Stack zh="支票號碼" en="(Cheque No." />
                      <Fill id={F.chequeNumber} width="grow" />
                      <Stack zh="銀行" en=") Bank" />
                      <Fill id={F.bankName} width="grow" />
                    </div>
                  </td>
                  <td className="receipt-right" style={{ paddingTop: 5 }}>
                    <div className="sig-field">
                      <span className="lbl">姓名 Name :</span>
                      <Fill id={F.receiptLandlordName} width="grow" />
                    </div>
                    <div className="sig-field">
                      <span className="lbl">身份證號碼 I.D.No.:</span>
                      <Fill id={F.receiptLandlordId} width="grow" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
          <Footer />
        </section>
      </div>
    </ModeProvider>
  );
}
