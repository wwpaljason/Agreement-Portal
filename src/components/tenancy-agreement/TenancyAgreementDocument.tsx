"use client";

import { useRef, type ReactNode } from "react";
import {
  F,
  S,
  furnitureCheckId,
  furnitureLeft,
  furnitureRight,
  furnitureRooms,
  type FurnitureRoom,
} from "@/lib/templates/tenancy-agreement";
import { ModeProvider, useDocMode, useEditor } from "../editor-context";
import { Fill, Opt } from "../tenancy/fields";
import { useFitInputs } from "../tenancy/fit-input";
import "../tenancy/tenancy.css";
import "./ta.css";

const pageNames = ["第一頁", "第二頁", "第三頁", "第四頁"];

function Sheet({ n, children }: { n: number; children: ReactNode }) {
  return (
    <section className="page">
      <div className="page-content">
        <div className="page-fit">{children}</div>
      </div>
      <footer className="page-footer">
        <span>
          Page {n} {pageNames[n - 1]}
        </span>
      </footer>
    </section>
  );
}

function Clause({ n, en, zh }: { n?: string; en?: ReactNode; zh?: ReactNode }) {
  return (
    <div className={n ? "clause" : "clause cont"}>
      {n ? <div className="n">{n}</div> : null}
      {en ? <div className="en">{en}</div> : null}
      {zh ? <div className="zh">{zh}</div> : null}
    </div>
  );
}

function Tick({ id, children }: { id: string; children: ReactNode }) {
  const editor = useEditor();
  const mode = useDocMode();
  const on = !!editor.strikes[id];
  const interactive = mode === "edit" && editor.canEditStrikes;

  return (
    <span
      className={on ? "tick on" : "tick"}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      title={interactive ? "點擊勾選 Click to tick" : undefined}
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
      <span className="box">{on ? "✓" : ""}</span>
      <span className="lab">{children}</span>
    </span>
  );
}

function Key({ en, zh }: { en: string; zh: string }) {
  return (
    <span className="k">
      <b>{en}</b>
      <span>{zh}</span>
    </span>
  );
}

function Room({ room }: { room: FurnitureRoom }) {
  return (
    <div className="room">
      <div className="room-title">
        {room.en} {room.zh}
      </div>
      {room.items.map((item) => (
        <Tick key={item.id} id={furnitureCheckId(room.id, item.id)}>
          {item.en} {item.zh}
        </Tick>
      ))}
      <div className="other-line">
        <span>Other 其他</span>
        <Fill id={room.otherId} width="grow" />
      </div>
    </div>
  );
}

function roomsBy(ids: readonly string[]) {
  return ids.map((id) => furnitureRooms.find((room) => room.id === id)!);
}

const clausesAfterRent = [
  {
    n: "2.",
    en: "The Tenant shall not make any alteration and / or additions to the Premises without the prior written consent of the Landlord, which consent shall not be unreasonably withheld.",
    zh: "租客在沒有業主書面同意前，不得對該物業作任何改動及/或加建，唯業主不得無理拒絕給予租客有關的同意書。",
  },
  {
    n: "3.",
    en: "The Tenant shall not assign, transfer, sublet or part with the possession of the Premises or any part thereof to any other person. This tenancy shall be personal to the Tenant named herein.",
    zh: "租客不得轉讓、轉租或分租該物業或其他任何部分或將該物業或其他任何部分的佔用權讓予任何其他人等。此租約權益為租客名下擁有。",
  },
  {
    n: "4.",
    en: "The Tenant shall comply with all ordinances, regulations and rules of Hong Kong and shall observe and perform the covenants, terms and conditions of the Deed of Mutual Covenant and Sub-Deed of Mutual Covenant (if any) relating to the Premises. The Tenant shall not contravene any negative or restrictive covenants contained in the Government Lease(s) under which the Premises are held from the Government.",
    zh: "租客須遵守香港一切法律條例和規則及該物業所屬的大廈有關的公契內的條款。租客亦不可違反屬該物業地段內的官批地契上的任何制約性條款。",
  },
  {
    n: "5.",
    en: "The Tenant shall during the Term pay and discharge all charges in respect of water, electricity, gas and telephone and other similar charges payable in respect of the Premises.",
    zh: "租客須在租約期內清繳一切有關物業的水費、電費、煤氣費、電話費及其他類似的雜費等。",
  },
  {
    n: "6.",
    en: "The Tenant shall during the Term keep the interior of the Premises in good and tenantable repair and condition (fair wear and tear and damage caused by inherent defects excepted) and shall deliver up vacant possession of the Premises in the same repair and condition on the expiration or sooner determination of this Agreement.",
    zh: "租客須在租約期內保持物業內部的維修狀態良好（自然損耗及因固有的缺陷所產生的損壞除外）並須於租約期滿或終止時將物業在同樣維修狀態下交吉交回業主。",
  },
] as const;

const clausesEightToSixteen = [
  {
    n: "8.",
    en: "Provided the Tenant shall have paid the Rent and other outgoings on the days and in the manner herein provided and observed and perform the terms and conditions herein contained and on the Tenant's part to be observed and performed, the Tenant shall peacefully hold and enjoy the Premises during the Term without any interruption by the Landlord.",
    zh: "若租客按時清繳租金和雜費及沒有干犯此合約內任何條款，則業主不得在租約期內干擾租客享用該物業。",
  },
  {
    n: "9.",
    en: "The Landlord shall keep and maintain the structural parts of the Premises including the main drains, pipes and cables in proper state of repair provided that the Landlord's liability shall not be incurred unless and until written notice of any defect or want of repair has been given by the Tenant to the Landlord and the Landlord shall have failed to take reasonable steps to repair and remedy the same after the lapse of a reasonable time from the date of service of such notice.",
    zh: "業主須保養及適當維修物業內各主要結構部分（包括主要的排污渠、喉管和電線）。唯業主須在收到租客的書面要求後才會有責任在合理時限內將有關損壞維修妥當。",
  },
  {
    n: "10.",
    en: "The Landlord shall pay the Property Tax payable in respect of the Premises.",
    zh: "業主負責繳付有關該物業的物業稅。",
  },
  {
    n: "11.",
    en: "The Stamp Duty payable on this Agreement in duplicate shall be borne by the Landlord and the Tenant in equal shares.",
    zh: "業主及租客各負責此合約一式兩份的印花稅一半費用。",
  },
  {
    n: "12.",
    en: "The Landlord and the Tenant agree to be bound by the additional terms and conditions in Schedule II (if any).",
    zh: "業主及租客雙方同意遵守附表二的附加條件（如有的話）。",
  },
  {
    n: "13.",
    en: "The Tenant shall himself/herself cover insurance for his/her own belongings against Typhoon, Depression, Storm, Flood, Fire, Theft and Accidents in relation to this Tenancy. The Landlord shall not be responsible for any damage or loss under all circumstances.",
    zh: "租客須自投買風災、水災、火災、盜竊、意外保險，租客如有任何損失，業主不負任何責任。",
  },
  {
    n: "14.",
    en: "The Tenant has to move out all his/her own belongings from the date of delivery of vacant possession of the Premises to the Landlord.",
    zh: "租客遷出時須搬走自己的物品。",
  },
  {
    n: "15.",
    en: "Security Deposit cannot be utilised as rent payment.",
    zh: "租客應清楚明白該筆按金不能用作現金支付租金。",
  },
  {
    n: "16.",
    en: "If there is any conflict between the English version and the Chinese version in this Agreement, the Chinese version shall prevail.",
    zh: "此合約內的英文本與中文本存有差異時，將以中文文本為準。",
  },
] as const;

const uses = [
  { id: S.useResidential, en: "Residential", zh: "住宅" },
  { id: S.useCommercial, en: "Commercial", zh: "商業" },
  { id: S.useOffice, en: "Office", zh: "辦公室" },
  { id: S.useShop, en: "Shop", zh: "商店" },
  { id: S.useIndustrial, en: "Industrial", zh: "工業" },
] as const;

export function TenancyAgreementDocument({ mode }: { mode: "edit" | "print" }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { values, strikes } = useEditor();
  useFitInputs(rootRef, { values, strikes, mode });

  return (
    <ModeProvider mode={mode}>
      <div className="tenancy ta" ref={rootRef}>
        <Sheet n={1}>
          <header className="ta-head">
            <h1>Tenancy Agreement</h1>
            <div className="ta-title-zh">租約</div>
            <div className="ta-ref">
              <span>
                Ref No. / 編號
              </span>
              <Fill id={F.refNo} width="lg" />
            </div>
          </header>

          <div className="intro">
            <div className="en">
              An Agreement made the day of <Fill id={F.agreementDateEn} width="xl" /> , between the Landlord and the
              Tenant as more particularly described in Schedule I.
            </div>
            <div className="zh">
              此合約由業主及租客（雙方資料詳列於附表一）於 <Fill id={F.agreementYear} width="sm" /> 年{" "}
              <Fill id={F.agreementMonth} width="xs" /> 月 <Fill id={F.agreementDay} width="xs" /> 日訂立：
            </div>
          </div>

          <div className="intro">
            <div className="en">
              The Landlord shall let and the Tenant shall take the Premises for the Term and at the Rent as more
              particularly described in Schedule I and both parties agree to observe and perform the terms and
              conditions as follows:
            </div>
            <div className="zh">
              業主及租客雙方以詳列於附表一的租期及租金分別租出及租入詳列於附表一的物業，並同意遵守及履行下列條款：
            </div>
          </div>

          <Clause
            n="1."
            en={
              <>
                The Tenant shall pay to the Landlord the Rent in advance on the <Fill id={F.rentDueDay} width="xs" />{" "}
                day of each and every calendar month during the Term. If the Tenant shall fail to pay the Rent within 7
                days from the due date, the Landlord shall have the right to institute appropriate action to recover
                the Rent and all costs, expenses and other outgoings so incurred by the Landlord in relation to such
                action shall be a debt owed by the Tenant to the Landlord and shall be recoverable in full by the
                Landlord.
              </>
            }
            zh={
              <>
                租客須在租期內每個月份第 <Fill id={F.rentDueDay} width="xs" />{" "}
                天上期繳付指定的租金予業主。倘租客於應繳租金之日的七天內仍未清付該租金，則業主有權採取適當行動追討租客所欠的租金，而由此而引起的一切費用及開支將構成租客所欠業主的債項，業主將有權向租客一併追討所欠款項全數。
              </>
            }
          />

          {clausesAfterRent.map((clause) => (
            <Clause key={clause.n} n={clause.n} en={clause.en} zh={clause.zh} />
          ))}

          <Clause
            n="7."
            en="The Tenant shall pay to the Landlord the Security Deposit set out in Schedule I for the due observance and performance of the terms and conditions herein contained and on his part to be observed and performed. Provided that there is no antecedent breach of any of the terms and conditions herein contained, the Landlord shall refund the Security Deposit to the Tenant without interest within 7 days from the date of delivery of vacant possession of the Premises to the Landlord or settlement of any outstanding payment owed by the Tenant to the Landlord, whichever is later. If the Rent and/or any charges payable by the Tenant hereunder or any part thereof shall be unpaid for seven (7) days after the same shall become payable (whether legally demanded or not) or if the Tenant shall commit a breach of any of the terms and conditions herein contained, it shall be lawful for the Landlord at any time thereafter to re-enter the Premises whereupon this Agreement shall absolutely determine and the Landlord may deduct any loss or damage suffered by the Landlord as a result of the Tenant's breach from the Security Deposit without prejudice to any other right of action or any remedy of the Landlord in respect of such breach by the Tenant."
          />
        </Sheet>

        <Sheet n={2}>
          <Clause zh="租客須交予業主保證金（金額如附表一所列）作為保證物業租客遵守及履行此租約上租客所需遵守及履行的條款的按金。若租客在租期內並無干犯此合約內任何條款，則業主須於收回交吉的物業或一切租客欠款後（以較遲者作準）七天內無息退還該保證金予租客。但若租客拖欠根據此合約需要支付的租金及/或其他款項超過七天（無論有否以法律行動追討）或若租客違反此合約內任何條款，業主可合法收回該物業而此租約將立即被終止；業主可從保證金內扣除因租客違約而令業主所受的損失，而此項權利將不會影響業主因租客違約而可採取的其他合法行動的權利。" />
          {clausesEightToSixteen.map((clause) => (
            <Clause key={clause.n} n={clause.n} en={clause.en} zh={clause.zh} />
          ))}

          <div className="split">
            <div className="cap">
              <div className="en">Received the Security Deposit of</div>
              <div className="zh">業主收到租客所交的保證金</div>
              <div className="amount-line">
                <span>HK$ / 港幣</span>
                <Fill id={F.depositReceived} width="grow" />
                <span>by the Landlord</span>
              </div>
            </div>
            <div className="cap">
              <div className="en">
                Received <Fill id={F.keysReceived} width="xs" /> key(s) of the Premises by the Tenant
              </div>
              <div className="zh">
                租客收到 <Fill id={F.keysReceived} width="xs" /> 條業主所交屬該物業的鎖匙
              </div>
            </div>
          </div>

          <div className="split sign-block">
            <div>
              <div className="sign-rule" />
              <div className="cap">
                <div className="en">Confirmed and accepted all the terms and conditions</div>
                <div className="en">Contained herein by the Landlord:</div>
                <div className="zh">業主確認及接受這合約內所有條款的約束</div>
              </div>
              <div className="id-row">
                <span className="meta">
                  <span>HKID / B.R. No.</span>
                  <span className="zh">香港身份證 / 商業登記證號碼</span>
                </span>
                <Fill id={F.landlordSignId} width="grow" />
              </div>
            </div>
            <div>
              <div className="sign-rule" />
              <div className="cap">
                <div className="en">Confirmed and accepted all the terms and conditions</div>
                <div className="en">Contained herein by the Tenant:</div>
                <div className="zh">租客確認及接受這合約內所有條款的約束</div>
              </div>
              <div className="id-row">
                <span className="meta">
                  <span>HKID / B.R. No.</span>
                  <span className="zh">香港身份證 / 商業登記證號碼</span>
                </span>
                <Fill id={F.tenantSignId} width="grow" />
              </div>
            </div>
          </div>
        </Sheet>

        <Sheet n={3}>
          <h2 className="sched-title">
            Schedule I<span>附表一</span>
          </h2>

          <div className="block">
            <div className="bilingual-row">
              <Key en="The Premises" zh="物業" />
              <span className="colon">:</span>
              <Fill id={F.premisesAddress} width="grow" />
            </div>
          </div>

          <div className="block">
            <div className="party-line">
              <div className="bilingual-row">
                <Key en="The Landlord" zh="業主" />
                <span className="colon">:</span>
                <Fill id={F.landlordName} width="grow" />
              </div>
              <div className="bilingual-row">
                <Key en="Tel. No." zh="電話號碼" />
                <Fill id={F.landlordTel} width="lg" />
              </div>
            </div>
            <div className="bilingual-row">
              <Key en="Address" zh="地址" />
              <span className="colon">:</span>
              <Fill id={F.landlordAddress} width="grow" />
            </div>
          </div>

          <div className="block">
            <div className="party-line">
              <div className="bilingual-row">
                <Key en="The Tenant" zh="租客" />
                <span className="colon">:</span>
                <Fill id={F.tenantName} width="grow" />
              </div>
              <div className="bilingual-row">
                <Key en="Tel. No." zh="電話號碼" />
                <Fill id={F.tenantTel} width="lg" />
              </div>
            </div>
            <div className="bilingual-row">
              <Key en="Address" zh="地址" />
              <span className="colon">:</span>
              <Fill id={F.tenantAddress} width="grow" />
            </div>
          </div>

          <div className="block">
            <div className="term-en">
              <b>Term 租期</b>
              <span>From 由</span>
              <span className="grow" />
              <span>to 至</span>
              <span className="grow" />
              <span className="right-note">(both days inclusive)（包括首尾兩天）</span>
            </div>
            <div className="bilingual-row">
              <Fill id={F.termFromYear} width="sm" />
              <span>年</span>
              <Fill id={F.termFromMonth} width="xs" />
              <span>月</span>
              <Fill id={F.termFromDay} width="xs" />
              <span>日</span>
              <span className="colon">至</span>
              <Fill id={F.termToYear} width="sm" />
              <span>年</span>
              <Fill id={F.termToMonth} width="xs" />
              <span>月</span>
              <Fill id={F.termToDay} width="xs" />
              <span>日止</span>
            </div>
          </div>

          <div className="block">
            <div className="bilingual-row">
              <Key en="Rent" zh="租金" />
              <span>HK$ / 每月為港幣</span>
              <Fill id={F.monthlyRent} width="grow" />
              <span>per month</span>
            </div>
          </div>

          <div className="block">
            <div className="bilingual-row deposit-row">
              <Key en="Security Deposit" zh="保證金" />
              <span>HK$ / 港幣</span>
              <Fill id={F.depositWan} width="sm" />
              <span>萬</span>
              <Fill id={F.depositQian} width="xs" />
              <span>千</span>
              <Fill id={F.depositBai} width="xs" />
              <span>百</span>
              <Fill id={F.depositShi} width="xs" />
              <span>拾元正</span>
            </div>
          </div>

          <h2 className="sched-title later">
            Schedule II<span>附表二</span>
          </h2>

          <div className="block">
            <div className="h-use">1. Use 用途</div>
            <div className="en">
              The Tenant shall not use or permit to be used the Premises or any part thereof for any purpose other than
              for the following purpose only.
            </div>
            <div className="zh">租客除將該物業作以下用途外，不可將物業或其任何部分作其他用途。</div>
            <div className="use-row">
              <div className="use-note">
                <div>(Note – select one item :</div>
                <div>（備註 — 請選一項：</div>
              </div>
              {uses.map((item) => (
                <Tick key={item.id} id={item.id}>
                  {item.en}
                  <span>{item.zh}</span>
                </Tick>
              ))}
              <span>)</span>
            </div>
          </div>

          <div className="block">
            <div className="h-use">2. Miscellaneous Payments 雜項費用</div>
            <div className="en">The following payments payable in respect of the Premises during the Term:</div>
            <div className="zh">租期內下列費用：</div>
            <div className="pay">
              <div className="en">
                *(a) Management fee paid by <Opt id={S.feeMgmtLandlord}>Landlord</Opt> /{" "}
                <Opt id={S.feeMgmtTenant}>Tenant</Opt> *(at current rate) (per month) (subject to revision from time to
                time)
              </div>
              <div className="zh">
                管理費由<Opt id={S.feeMgmtLandlord}>業主</Opt> / <Opt id={S.feeMgmtTenant}>租客</Opt>
                支付（每月管理費以管理處實收為準）
              </div>
            </div>
            <div className="pay">
              <div className="en">
                *(b) Government Rates paid by <Opt id={S.feeRatesLandlord}>Landlord</Opt> /{" "}
                <Opt id={S.feeRatesTenant}>Tenant</Opt> *(subject to actual amount demanded by the Government)
              </div>
              <div className="zh">
                差餉由<Opt id={S.feeRatesLandlord}>業主</Opt> / <Opt id={S.feeRatesTenant}>租客</Opt>
                支付（每季以政府實收為準）
              </div>
            </div>
            <div className="pay">
              <div className="en">
                *(c) Government Rent paid by <Opt id={S.feeGovRentLandlord}>Landlord</Opt> /{" "}
                <Opt id={S.feeGovRentTenant}>Tenant</Opt> *(subject to actual amount demanded by the Government)
              </div>
              <div className="zh">
                地租由<Opt id={S.feeGovRentLandlord}>業主</Opt> / <Opt id={S.feeGovRentTenant}>租客</Opt>
                支付（每季以政府實收為準）
              </div>
            </div>
            <div className="fine">* Delete where inapplicable. 刪去不適用者</div>
          </div>

          <div className="block">
            <div className="h-use">3. Rent Free Period 免租期</div>
            <div className="en">
              Tenant shall be entitled to a rent free period from the <Fill id={F.rentFreeFrom} width="md" /> to{" "}
              <Fill id={F.rentFreeTo} width="md" /> <span className="nowrap">(both days inclusive)</span>
            </div>
            <div className="zh">
              租客可享有 <Fill id={F.rentFreeDays} width="xs" /> 天免租期，由 <Fill id={F.rentFreeFrom} width="md" /> 至{" "}
              <Fill id={F.rentFreeTo} width="md" /> <span className="nowrap">（包括首尾兩天）</span>
            </div>
            <div className="en">
              provided that the Tenant shall be responsible for the charges of Government Rent, Government Rates,
              management fees, water, electricity, gas, telephone and other outgoings payable in respect of the
              Premises during such rent free period.
            </div>
            <div className="zh">但租客仍需負責繳付免租期內一切地租、差餉、管理費、水、電、煤氣及電話費及其他一切雜費支出。</div>
          </div>
        </Sheet>

        <Sheet n={4}>
          <div className="break-head">4. Break Clause 退租權</div>
          <div className="en">
            Notwithstanding anything to the contrary hereinbefore contained, the{" "}
            <Opt id={S.breakWhoLandlord}>Landlord</Opt> / <Opt id={S.breakWhoTenant}>Tenant</Opt> /{" "}
            <Opt id={S.breakWhoEither}>either party</Opt> shall be entitled to terminate this Agreement earlier than as
            herein provided by serving not less than <Fill id={F.breakNoticeMonths} width="xs" /> months&apos; written
            notice or by paying <Fill id={F.breakLieuMonths} width="xs" /> months&apos; Rent in lieu to the{" "}
            <Opt id={S.breakPayLandlord}>Landlord</Opt> / <Opt id={S.breakPayTenant}>Tenant</Opt> /{" "}
            <Opt id={S.breakPayOther}>other party</Opt> provided that the said written notice shall not be served
            before the expiration of the [ <Fill id={F.breakLockMonths} width="xs" /> ] month of the Term of Tenancy.
          </div>
          <div className="zh">
            儘管與前文不符，<Opt id={S.breakWhoLandlord}>業主</Opt> / <Opt id={S.breakWhoTenant}>租客</Opt> /{" "}
            <Opt id={S.breakWhoEither}>任何一方</Opt>可給予<Opt id={S.breakPayLandlord}>業主</Opt> /{" "}
            <Opt id={S.breakPayTenant}>租客</Opt> / <Opt id={S.breakPayOther}>另一方</Opt>不少於{" "}
            <Fill id={F.breakNoticeMonths} width="xs" /> 個月的書面通知或 <Fill id={F.breakLieuMonths} width="xs" />{" "}
            個月租金作代通知金提早解除此租約；唯該書面通知書不得早於由租期起計之【{" "}
            <Fill id={F.breakLockMonths} width="xs" /> 】個月內發出。
          </div>

          <div className="inventory">
            <div className="inventory-lead">
              <div>The above rent includes the following furniture &amp; fixture by the Landlord:</div>
              <div>以上租金包括租用由業主提供之傢俬及設備如下：</div>
            </div>
            <div className="furn-grid">
              <div>
                {roomsBy(furnitureLeft).map((room) => (
                  <Room key={room.id} room={room} />
                ))}
              </div>
              <div>
                {roomsBy(furnitureRight).map((room) => (
                  <Room key={room.id} room={room} />
                ))}
              </div>
            </div>
            <div className="remarks">
              <div>Remarks 備註：</div>
              <div>
                1. Tenant shall pay monthly Rent to Landlord&apos;s A/C No.
              </div>
              <div className="bilingual-row">
                <span>租客須將租金存入業主銀行戶口號碼：</span>
                <Fill id={F.rentAccount} width="grow" />
              </div>
              <div className="bilingual-row">
                <span>2.</span>
                <Fill id={F.remarks} width="grow" />
              </div>
              <div className="ruled" />
              <div className="ruled" />
              <div className="ruled" />
              <div className="ruled" />
            </div>
          </div>
        </Sheet>
      </div>
    </ModeProvider>
  );
}
