import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ReceiptIcon } from "@/components/icons";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import type { MockPurchase, PublicLandRecord } from "@/lib/types";

type PurchaseCardProps = {
  purchase: MockPurchase;
  records: PublicLandRecord[];
  featured?: boolean;
};

export function PurchaseCard({
  purchase,
  records,
  featured = false,
}: PurchaseCardProps) {
  const recordsById = new Map(records.map((record) => [record.id, record]));
  const orderedRecords = purchase.recordIds
    .map((recordId) => recordsById.get(recordId))
    .filter((record): record is PublicLandRecord => Boolean(record));

  return (
    <article className={`purchase-card${featured ? " purchase-card--featured" : ""}`}>
      <header className="purchase-card__header">
        <span className="purchase-card__status">
          <CheckIcon />
          테스트 결제 완료
        </span>
        <span>{formatDateTime(purchase.paidAt)}</span>
      </header>
      <div className="purchase-card__summary">
        <div className="purchase-card__icon">
          <ReceiptIcon />
        </div>
        <div>
          <p>주문번호</p>
          <strong>{purchase.id}</strong>
          <span>결제키 {purchase.paymentKey}</span>
        </div>
        <dl>
          <div>
            <dt>구매 기록</dt>
            <dd>{formatNumber(purchase.recordIds.length)}건</dd>
          </div>
          <div>
            <dt>결제금액</dt>
            <dd>{formatCurrency(purchase.amountTotal)}</dd>
          </div>
        </dl>
      </div>
      <div className="purchase-card__records">
        {orderedRecords.map((record) => (
          <Link href={`/records/${record.id}`} key={record.id}>
            <span>
              <small>{record.recordNumber}</small>
              <strong>{record.name}</strong>
              <em>
                {record.province} · {record.county} {record.town ?? ""}
              </em>
            </span>
            <span className="purchase-card__record-action">
              상세 지번 열람
              <ArrowRightIcon />
            </span>
          </Link>
        ))}
      </div>
    </article>
  );
}
